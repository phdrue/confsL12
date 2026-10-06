<?php

namespace App\Legacy;

use App\Models\LegacyConference;
use App\Models\LegacyConferenceCategory;
use App\Models\LegacyConferenceFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class WpLegacyImporter
{
    /**
     * @var list<string>
     */
    private const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];

    /**
     * @var list<string>
     */
    private const DOCUMENT_EXTENSIONS = ['pdf', 'zip', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'rtf', 'txt'];

    public function __construct(
        private WpSqlDumpParser $parser,
        private WpLegacyFilter $filter,
        private WpHtmlSanitizer $sanitizer,
    ) {}

    /**
     * @return array{
     *     tables: array<string, list<array<string, mixed>>>,
     *     kept_posts: list<array<string, mixed>>,
     *     dropped_posts: list<array{id: int, title: string, reason: string}>,
     *     attachments: array<int, array<string, mixed>>,
     *     meta_by_post: array<int, array<string, list<string>>>,
     *     categories: array<int, array{term_id: int, name: string, slug: string}>,
     *     post_category_ids: array<int, list<int>>,
     *     referenced_paths: list<string>,
     *     medium_paths: array<string, string>
     * }
     */
    public function analyze(string $sqlPath): array
    {
        $tables = $this->parser->parse($sqlPath);

        return $this->buildPlan($tables);
    }

    /**
     * @param  array<string, list<array<string, mixed>>>  $tables
     * @return array<string, mixed>
     */
    public function buildPlan(array $tables): array
    {
        $posts = $tables['wp_posts'] ?? [];
        $postmeta = $tables['wp_postmeta'] ?? [];
        $relationships = $tables['wp_term_relationships'] ?? [];
        $taxonomies = $tables['wp_term_taxonomy'] ?? [];
        $terms = $tables['wp_terms'] ?? [];
        $galleryImages = $tables['wp_finaltiles_gallery_images'] ?? [];

        $keptPosts = [];
        $droppedPosts = [];
        $attachments = [];

        foreach ($posts as $post) {
            $type = (string) ($post['post_type'] ?? '');
            if ($type === 'attachment') {
                if ($this->filter->dropReason($post) === null) {
                    $attachments[(int) $post['ID']] = $post;
                }

                continue;
            }

            $reason = $this->filter->dropReason($post);
            if ($reason !== null) {
                if ($type === 'post') {
                    $droppedPosts[] = $this->filter->reviewRow($post, $reason);
                }

                continue;
            }

            $keptPosts[] = $post;
        }

        $keptIds = [];
        foreach ($keptPosts as $post) {
            $keptIds[(int) $post['ID']] = true;
        }

        $metaByPost = [];
        foreach ($postmeta as $meta) {
            $postId = (int) ($meta['post_id'] ?? 0);
            $key = (string) ($meta['meta_key'] ?? '');
            $value = (string) ($meta['meta_value'] ?? '');
            $metaByPost[$postId][$key][] = $value;
        }

        $thumbnailIds = [];
        foreach ($keptPosts as $post) {
            $id = (int) $post['ID'];
            foreach ($metaByPost[$id]['_thumbnail_id'] ?? [] as $thumb) {
                if (ctype_digit((string) $thumb) && (int) $thumb > 0) {
                    $thumbnailIds[(int) $thumb] = $id;
                }
            }
        }

        $contentAttachmentIds = [];
        $contentPaths = [];
        foreach ($keptPosts as $post) {
            $content = (string) ($post['post_content'] ?? '');
            foreach ($this->extractUploadPaths($content) as $path) {
                $contentPaths[$path] = true;
            }
            if (preg_match_all('/wp-image-(\d+)/', $content, $matches)) {
                foreach ($matches[1] as $attachmentId) {
                    $contentAttachmentIds[(int) $attachmentId] = (int) $post['ID'];
                }
            }
            if (preg_match_all('/attachment_id=(\d+)/', $content, $matches)) {
                foreach ($matches[1] as $attachmentId) {
                    $contentAttachmentIds[(int) $attachmentId] = (int) $post['ID'];
                }
            }
        }

        $keptAttachments = [];
        foreach ($attachments as $id => $attachment) {
            $parent = (int) ($attachment['post_parent'] ?? 0);
            $keep = isset($keptIds[$parent])
                || isset($thumbnailIds[$id])
                || isset($contentAttachmentIds[$id]);

            if ($keep) {
                $keptAttachments[$id] = $attachment;
            }
        }

        $referencedPaths = $contentPaths;
        $mediumByOriginal = [];

        foreach ($keptAttachments as $id => $attachment) {
            $attached = $metaByPost[$id]['_wp_attached_file'][0] ?? null;
            if (is_string($attached) && $attached !== '') {
                $normalized = $this->normalizeRel($attached);
                if ($normalized !== null) {
                    $referencedPaths[$normalized] = true;
                }
            }

            $guid = (string) ($attachment['guid'] ?? '');
            foreach ($this->extractUploadPaths($guid) as $path) {
                $referencedPaths[$path] = true;
            }

            $metadata = $metaByPost[$id]['_wp_attachment_metadata'][0] ?? null;
            if (is_string($metadata) && $metadata !== '') {
                $medium = $this->mediumFilenameFromMetadata($metadata);
                $original = is_string($attached) ? $this->normalizeRel($attached) : null;
                if ($medium !== null && $original !== null) {
                    $directory = str_contains($original, '/') ? dirname($original) : '';
                    $mediumRel = $directory !== '' && $directory !== '.' ? $directory.'/'.$medium : $medium;
                    $mediumRel = $this->normalizeRel($mediumRel);
                    if ($mediumRel !== null) {
                        $referencedPaths[$mediumRel] = true;
                        $mediumByOriginal[$original] = $mediumRel;
                    }
                }
            }
        }

        foreach ($galleryImages as $image) {
            $imageId = (int) ($image['imageId'] ?? 0);
            if (! isset($keptAttachments[$imageId])) {
                continue;
            }
            foreach ($this->extractUploadPaths((string) ($image['imagePath'] ?? '')) as $path) {
                $referencedPaths[$path] = true;
            }
        }

        $referencedPaths = array_keys($referencedPaths);
        sort($referencedPaths);

        $termTaxonomy = [];
        foreach ($taxonomies as $taxonomy) {
            $termTaxonomy[(int) $taxonomy['term_taxonomy_id']] = $taxonomy;
        }

        $termsById = [];
        foreach ($terms as $term) {
            $termsById[(int) $term['term_id']] = $term;
        }

        $postCategoryIds = [];
        $categories = [];
        foreach ($relationships as $relationship) {
            $objectId = (int) $relationship['object_id'];
            if (! isset($keptIds[$objectId])) {
                continue;
            }
            $tt = $termTaxonomy[(int) $relationship['term_taxonomy_id']] ?? null;
            if ($tt === null || ($tt['taxonomy'] ?? '') !== 'category') {
                continue;
            }
            $termId = (int) $tt['term_id'];
            $term = $termsById[$termId] ?? null;
            if ($term === null) {
                continue;
            }
            $categories[$termId] = [
                'term_id' => $termId,
                'name' => (string) $term['name'],
                'slug' => (string) $term['slug'],
            ];
            $postCategoryIds[$objectId][] = $termId;
        }

        return [
            'tables' => $tables,
            'kept_posts' => $keptPosts,
            'dropped_posts' => $droppedPosts,
            'attachments' => $keptAttachments,
            'meta_by_post' => $metaByPost,
            'categories' => $categories,
            'post_category_ids' => $postCategoryIds,
            'referenced_paths' => $referencedPaths,
            'medium_paths' => $mediumByOriginal,
            'thumbnail_ids' => $thumbnailIds,
            'attachment_parents' => $contentAttachmentIds,
        ];
    }

    /**
     * @param  array<string, mixed>  $plan
     * @return array{kept: int, dropped: int, missing: list<string>, copied: int, bytes_kept: int}
     */
    public function copyReferencedFiles(array $plan, string $uploadsDir, string $destinationDir): array
    {
        $copied = 0;
        $bytes = 0;
        $missing = [];

        foreach ($plan['referenced_paths'] as $rel) {
            if ($this->shouldSkipRel($rel)) {
                continue;
            }

            $source = $this->joinPath($uploadsDir, $rel);
            if (! is_file($source)) {
                $missing[] = $rel;

                continue;
            }

            $dest = $this->joinPath($destinationDir, $rel);
            $directory = dirname($dest);
            if (! is_dir($directory)) {
                mkdir($directory, 0777, true);
            }

            if (! copy($source, $dest)) {
                $missing[] = $rel;

                continue;
            }

            $copied++;
            $bytes += (int) filesize($dest);
        }

        return [
            'kept' => count($plan['kept_posts']),
            'dropped' => count($plan['dropped_posts']),
            'missing' => $missing,
            'copied' => $copied,
            'bytes_kept' => $bytes,
        ];
    }

    /**
     * @param  array<string, mixed>  $plan
     */
    public function writeCleanSql(array $plan, string $destination): void
    {
        $keptIds = [];
        foreach ($plan['kept_posts'] as $post) {
            $keptIds[(int) $post['ID']] = true;
        }
        foreach ($plan['attachments'] as $id => $attachment) {
            $keptIds[$id] = true;
        }

        $posts = array_values(array_filter(
            $plan['tables']['wp_posts'] ?? [],
            fn (array $post): bool => isset($keptIds[(int) $post['ID']]),
        ));

        $meta = array_values(array_filter(
            $plan['tables']['wp_postmeta'] ?? [],
            function (array $row) use ($keptIds): bool {
                return isset($keptIds[(int) $row['post_id']])
                    && $this->filter->shouldKeepMetaKey((string) ($row['meta_key'] ?? ''));
            },
        ));

        $relationships = array_values(array_filter(
            $plan['tables']['wp_term_relationships'] ?? [],
            fn (array $row): bool => isset($keptIds[(int) $row['object_id']]),
        ));

        $usedTaxonomyIds = [];
        foreach ($relationships as $row) {
            $usedTaxonomyIds[(int) $row['term_taxonomy_id']] = true;
        }

        $taxonomies = array_values(array_filter(
            $plan['tables']['wp_term_taxonomy'] ?? [],
            fn (array $row): bool => isset($usedTaxonomyIds[(int) $row['term_taxonomy_id']]),
        ));

        $termIds = [];
        foreach ($taxonomies as $row) {
            $termIds[(int) $row['term_id']] = true;
        }

        $terms = array_values(array_filter(
            $plan['tables']['wp_terms'] ?? [],
            fn (array $row): bool => isset($termIds[(int) $row['term_id']]),
        ));

        $postColumns = [
            'ID', 'post_author', 'post_date', 'post_date_gmt', 'post_content', 'post_title',
            'post_excerpt', 'post_status', 'comment_status', 'ping_status', 'post_password',
            'post_name', 'to_ping', 'pinged', 'post_modified', 'post_modified_gmt',
            'post_content_filtered', 'post_parent', 'guid', 'menu_order', 'post_type',
            'post_mime_type', 'comment_count',
        ];

        $sql = "-- Filtered legacy WordPress dump\nSET NAMES utf8mb4;\n\n";
        $sql .= $this->insertSql('wp_posts', $postColumns, $posts);
        $sql .= $this->insertSql('wp_postmeta', ['meta_id', 'post_id', 'meta_key', 'meta_value'], $meta);
        $sql .= $this->insertSql('wp_term_relationships', ['object_id', 'term_taxonomy_id', 'term_order'], $relationships);
        $sql .= $this->insertSql('wp_term_taxonomy', ['term_taxonomy_id', 'term_id', 'taxonomy', 'description', 'parent', 'count'], $taxonomies);
        $sql .= $this->insertSql('wp_terms', ['term_id', 'name', 'slug', 'term_group'], $terms);

        file_put_contents($destination, $sql);
    }

    /**
     * @param  array<string, mixed>  $plan
     * @return array{imported: int, files: int, missing: list<string>}
     */
    public function import(array $plan, ?string $uploadsDir): array
    {
        $categoryModels = [];
        foreach ($plan['categories'] as $termId => $category) {
            $categoryModels[$termId] = LegacyConferenceCategory::query()->updateOrCreate(
                ['wp_term_id' => $termId],
                [
                    'name' => $category['name'],
                    'slug' => $this->uniqueCategorySlug($category['slug'], $termId),
                ],
            );
        }

        $usedSlugs = LegacyConference::query()->pluck('slug', 'wp_id')->all();
        $imported = 0;
        $filesCount = 0;
        $missing = [];

        foreach ($plan['kept_posts'] as $post) {
            $wpId = (int) $post['ID'];
            $title = html_entity_decode((string) $post['post_title'], ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $slug = $this->conferenceSlug($post, $title, $usedSlugs);
            $usedSlugs[$wpId] = $slug;

            $content = $this->sanitizer->sanitizeAndRewrite((string) $post['post_content']);
            $excerpt = trim((string) $post['post_excerpt']);
            if ($excerpt === '') {
                $excerpt = Str::limit(trim(preg_replace('/\s+/', ' ', strip_tags($content)) ?? ''), 300);
            }

            $oldSlug = $plan['meta_by_post'][$wpId]['_wp_old_slug'][0] ?? null;

            $conference = LegacyConference::query()->updateOrCreate(
                ['wp_id' => $wpId],
                [
                    'slug' => $slug,
                    'title' => $title,
                    'content_html' => $content,
                    'excerpt' => $excerpt !== '' ? $excerpt : null,
                    'status' => 'publish',
                    'published_at' => $this->parseDate((string) $post['post_date']),
                    'source_url' => 'https://ksmuconfs.org/?p='.$wpId,
                    'meta' => array_filter([
                        'old_slug' => $oldSlug,
                        'guid' => $post['guid'] ?? null,
                    ]),
                ],
            );

            $termIds = $plan['post_category_ids'][$wpId] ?? [];
            $conference->categories()->sync(array_map(
                fn (int $termId): int => $categoryModels[$termId]->id,
                array_values(array_filter($termIds, fn (int $termId): bool => isset($categoryModels[$termId]))),
            ));

            $fileResult = $this->syncFiles($conference, $post, $plan, $uploadsDir);
            $filesCount += $fileResult['count'];
            $missing = array_merge($missing, $fileResult['missing']);
            $imported++;
        }

        if ($uploadsDir !== null) {
            foreach ($plan['referenced_paths'] as $rel) {
                if ($this->shouldSkipRel($rel)) {
                    continue;
                }

                $stored = $this->storeLegacyFile($rel, $uploadsDir);
                if ($stored === null) {
                    $missing[] = $rel;
                }
            }
        }

        return [
            'imported' => $imported,
            'files' => $filesCount,
            'missing' => array_values(array_unique($missing)),
        ];
    }

    /**
     * @param  array<string, mixed>  $plan
     * @param  array<string, mixed>  $post
     * @return array{count: int, missing: list<string>}
     */
    private function syncFiles(LegacyConference $conference, array $post, array $plan, ?string $uploadsDir): array
    {
        $wpId = (int) $post['ID'];
        $rawThumbnail = $plan['meta_by_post'][$wpId]['_thumbnail_id'][0] ?? null;
        $thumbnailId = (is_string($rawThumbnail) && ctype_digit($rawThumbnail)) ? (int) $rawThumbnail : null;

        $attachmentIds = [];
        foreach ($plan['attachments'] as $id => $attachment) {
            $parent = (int) ($attachment['post_parent'] ?? 0);
            if ($parent === $wpId || $id === $thumbnailId) {
                $attachmentIds[$id] = $attachment;
            }
        }

        foreach ($plan['attachment_parents'] ?? [] as $attachmentId => $parentId) {
            if ($parentId === $wpId && isset($plan['attachments'][$attachmentId])) {
                $attachmentIds[$attachmentId] = $plan['attachments'][$attachmentId];
            }
        }

        $seenIds = [];
        $missing = [];
        $count = 0;

        foreach ($attachmentIds as $attachmentId => $attachment) {
            $attached = $plan['meta_by_post'][$attachmentId]['_wp_attached_file'][0] ?? null;
            $originalRel = is_string($attached) ? $this->normalizeRel($attached) : null;
            if ($originalRel === null) {
                foreach ($this->extractUploadPaths((string) ($attachment['guid'] ?? '')) as $path) {
                    $originalRel = $path;
                    break;
                }
            }

            if ($originalRel === null || $this->shouldSkipRel($originalRel)) {
                continue;
            }

            $isFeatured = $thumbnailId !== null && (int) $attachmentId === (int) $thumbnailId;
            $mediumRel = $plan['medium_paths'][$originalRel] ?? null;
            $serveRel = ($isFeatured && is_string($mediumRel)) ? $mediumRel : $originalRel;

            $pathsToStore = [$originalRel];
            if (is_string($mediumRel) && $mediumRel !== $originalRel) {
                $pathsToStore[] = $mediumRel;
            }

            foreach ($pathsToStore as $rel) {
                $stored = $this->storeLegacyFile($rel, $uploadsDir);
                if ($stored === null) {
                    $missing[] = $rel;

                    continue;
                }

                $kind = $this->kindFromName($rel, (string) ($attachment['post_mime_type'] ?? ''));
                $isThisFeatured = $isFeatured && $rel === $serveRel;

                LegacyConferenceFile::query()->updateOrCreate(
                    [
                        'legacy_conference_id' => $conference->id,
                        'wp_attachment_id' => $attachmentId,
                        'path' => $stored['path'],
                    ],
                    [
                        'original_name' => basename($rel),
                        'mime' => $stored['mime'] ?: ($attachment['post_mime_type'] ?? null),
                        'size' => $stored['size'],
                        'kind' => $kind,
                        'is_featured' => $isThisFeatured,
                    ],
                );
                $seenIds[] = $attachmentId;
                $count++;
            }
        }

        $conference->files()
            ->whereNotNull('wp_attachment_id')
            ->whereNotIn('wp_attachment_id', array_unique($seenIds) ?: [0])
            ->delete();

        return ['count' => $count, 'missing' => $missing];
    }

    /**
     * @return array{path: string, mime: ?string, size: int}|null
     */
    private function storeLegacyFile(string $rel, ?string $uploadsDir): ?array
    {
        $storagePath = 'legacy/'.$rel;

        if ($uploadsDir !== null) {
            $source = $this->joinPath($uploadsDir, $rel);
            if (! is_file($source)) {
                return Storage::disk('public')->exists($storagePath)
                    ? [
                        'path' => $storagePath,
                        'mime' => Storage::disk('public')->mimeType($storagePath) ?: null,
                        'size' => (int) Storage::disk('public')->size($storagePath),
                    ]
                    : null;
            }

            $destination = Storage::disk('public')->path($storagePath);
            $directory = dirname($destination);
            if (! is_dir($directory)) {
                mkdir($directory, 0777, true);
            }

            if (! is_file($destination) || filesize($destination) !== filesize($source)) {
                if (! copy($source, $destination)) {
                    return null;
                }
            }
        } elseif (! Storage::disk('public')->exists($storagePath)) {
            return null;
        }

        return [
            'path' => $storagePath,
            'mime' => Storage::disk('public')->mimeType($storagePath) ?: null,
            'size' => Storage::disk('public')->exists($storagePath) ? (int) Storage::disk('public')->size($storagePath) : 0,
        ];
    }

    /**
     * @param  list<string>  $columns
     * @param  list<array<string, mixed>>  $rows
     */
    private function insertSql(string $table, array $columns, array $rows): string
    {
        if ($rows === []) {
            return '';
        }

        $values = [];
        foreach ($rows as $row) {
            $fields = [];
            foreach ($columns as $column) {
                $fields[] = $this->sqlValue($row[$column] ?? null);
            }
            $values[] = '('.implode(',', $fields).')';
        }

        return 'INSERT INTO `'.$table.'` VALUES '.implode(',', $values).";\n\n";
    }

    private function sqlValue(mixed $value): string
    {
        if ($value === null) {
            return 'NULL';
        }

        $string = (string) $value;
        $escaped = str_replace(
            ['\\', "\0", "\n", "\r", "'", '"', "\x1A"],
            ['\\\\', '\\0', '\\n', '\\r', "\\'", '\\"', '\\Z'],
            $string,
        );

        return "'{$escaped}'";
    }

    /**
     * @param  array<int|string, string>  $usedSlugs
     * @param  array<string, mixed>  $post
     */
    private function conferenceSlug(array $post, string $title, array $usedSlugs): string
    {
        $raw = urldecode((string) ($post['post_name'] ?? ''));
        $slug = $raw !== '' ? Str::slug($raw, '-', 'ru') : '';
        if ($slug === '' || ctype_digit($slug)) {
            $slug = Str::slug($title, '-', 'ru');
        }
        if ($slug === '') {
            $slug = 'conference-'.(int) $post['ID'];
        }

        $wpId = (int) $post['ID'];
        $base = $slug;
        $i = 2;
        while (in_array($slug, $usedSlugs, true) && array_search($slug, $usedSlugs, true) != $wpId) {
            $slug = $base.'-'.$i;
            $i++;
        }

        return $slug;
    }

    private function uniqueCategorySlug(string $slug, int $termId): string
    {
        $decoded = urldecode($slug);
        $normalized = Str::slug($decoded, '-', 'ru') ?: 'category-'.$termId;
        $existing = LegacyConferenceCategory::query()
            ->where('slug', $normalized)
            ->where('wp_term_id', '!=', $termId)
            ->exists();

        return $existing ? $normalized.'-'.$termId : $normalized;
    }

    private function parseDate(string $date): ?string
    {
        if ($date === '' || str_starts_with($date, '0000-00-00')) {
            return null;
        }

        return $date;
    }

    /**
     * @return list<string>
     */
    public function extractUploadPaths(string $text): array
    {
        if ($text === '') {
            return [];
        }

        $paths = [];
        if (preg_match_all('#(?:https?:)?(?://(?:www\.)?ksmuconfs\.org)?/wp-content/uploads/([^"\'\s<>?]+)#i', $text, $matches)) {
            foreach ($matches[1] as $raw) {
                $normalized = $this->normalizeRel(rawurldecode($raw));
                if ($normalized !== null) {
                    $paths[$normalized] = true;
                }
            }
        }

        return array_keys($paths);
    }

    public function normalizeRel(string $raw): ?string
    {
        $path = str_replace('\\', '/', trim($raw));
        $path = ltrim($path, '/');
        $path = explode('?', $path, 2)[0];
        $path = explode('#', $path, 2)[0];

        if ($path === '' || str_ends_with($path, '/')) {
            return null;
        }

        $lower = strtolower($path);
        if (str_ends_with($lower, '.php') || str_ends_with($lower, '.phtml')) {
            return null;
        }

        if (in_array('..', explode('/', $path), true)) {
            return null;
        }

        return $path;
    }

    public function shouldSkipRel(string $rel): bool
    {
        return str_starts_with(strtolower($rel), 'rcl-uploads/');
    }

    public function isWpSizedDerivative(string $name): bool
    {
        return (bool) preg_match('/-\d+x\d+\.[A-Za-z0-9]+$/', $name);
    }

    private function mediumFilenameFromMetadata(string $serialized): ?string
    {
        if (preg_match('/s:6:"medium";a:\d+:\{s:4:"file";s:\d+:"([^"]+)"/', $serialized, $matches)) {
            return $matches[1];
        }

        return null;
    }

    private function kindFromName(string $rel, string $mime): string
    {
        $extension = strtolower(pathinfo($rel, PATHINFO_EXTENSION));
        if (in_array($extension, self::IMAGE_EXTENSIONS, true) || str_starts_with($mime, 'image/')) {
            return 'image';
        }
        if (in_array($extension, self::DOCUMENT_EXTENSIONS, true) || str_starts_with($mime, 'application/pdf')) {
            return 'document';
        }

        return 'other';
    }

    private function joinPath(string $base, string $rel): string
    {
        return rtrim($base, '/\\').DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $rel);
    }

    /**
     * @param  array<string, mixed>  $plan
     * @return list<array{path: string, bytes: int}>
     */
    public function largestKeptFiles(array $plan, string $uploadsDir, int $limit = 20): array
    {
        $items = [];
        foreach ($plan['referenced_paths'] as $rel) {
            if ($this->shouldSkipRel($rel)) {
                continue;
            }
            $source = $this->joinPath($uploadsDir, $rel);
            if (! is_file($source)) {
                continue;
            }
            $items[] = ['path' => $rel, 'bytes' => (int) filesize($source)];
        }

        usort($items, fn (array $a, array $b): int => $b['bytes'] <=> $a['bytes']);

        return array_slice($items, 0, $limit);
    }

    /**
     * @return array{files: int, bytes: int}
     */
    public function directoryStats(string $directory): array
    {
        if (! is_dir($directory)) {
            return ['files' => 0, 'bytes' => 0];
        }

        $files = 0;
        $bytes = 0;
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS));
        foreach ($iterator as $file) {
            if (! $file->isFile()) {
                continue;
            }
            $files++;
            $bytes += $file->getSize();
        }

        return ['files' => $files, 'bytes' => $bytes];
    }
}
