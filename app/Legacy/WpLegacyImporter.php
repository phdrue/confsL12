<?php

namespace App\Legacy;

use App\Models\LegacyConference;
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
    private const DOWNLOAD_EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'zip', 'rtf', 'mp4'];

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
     *     referenced_paths: list<string>,
     *     medium_paths: array<string, string>,
     *     galleries: array<int, list<array{src: string, alt: string}>>
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
        foreach ($keptPosts as $post) {
            $content = (string) ($post['post_content'] ?? '');
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

        $mediumByOriginal = [];
        foreach ($keptAttachments as $id => $attachment) {
            $attached = $metaByPost[$id]['_wp_attached_file'][0] ?? null;
            $original = is_string($attached) ? $this->normalizeRel($attached) : null;
            $metadata = $metaByPost[$id]['_wp_attachment_metadata'][0] ?? null;
            if (is_string($metadata) && $metadata !== '' && $original !== null) {
                $medium = $this->mediumFilenameFromMetadata($metadata);
                if ($medium !== null) {
                    $directory = str_contains($original, '/') ? dirname($original) : '';
                    $mediumRel = $directory !== '' && $directory !== '.' ? $directory.'/'.$medium : $medium;
                    $mediumRel = $this->normalizeRel($mediumRel);
                    if ($mediumRel !== null) {
                        $mediumByOriginal[$original] = $mediumRel;
                    }
                }
            }
        }

        $galleries = $this->buildGalleries($galleryImages);
        $referencedPaths = [];

        foreach ($keptPosts as $post) {
            $html = $this->sanitizer->sanitizeAndRewrite((string) ($post['post_content'] ?? ''), $galleries);
            foreach ($this->extractLegacyFileRels($html) as $path) {
                $referencedPaths[$path] = true;
            }

            $wpId = (int) $post['ID'];
            $rawThumbnail = $metaByPost[$wpId]['_thumbnail_id'][0] ?? null;
            $thumbnailId = (is_string($rawThumbnail) && ctype_digit($rawThumbnail)) ? (int) $rawThumbnail : null;
            if ($thumbnailId !== null && isset($keptAttachments[$thumbnailId])) {
                foreach ($this->attachmentRels($keptAttachments[$thumbnailId], $metaByPost[$thumbnailId] ?? []) as $rel) {
                    $referencedPaths[$rel] = true;
                    $mediumRel = $mediumByOriginal[$rel] ?? null;
                    if (is_string($mediumRel)) {
                        $referencedPaths[$mediumRel] = true;
                    }
                }
            }
        }

        foreach ($keptAttachments as $id => $attachment) {
            $parent = (int) ($attachment['post_parent'] ?? 0);
            $inContent = isset($contentAttachmentIds[$id]);
            if (! isset($keptIds[$parent]) && ! $inContent) {
                continue;
            }

            foreach ($this->attachmentRels($attachment, $metaByPost[$id] ?? []) as $rel) {
                if ($this->isDownloadRel($rel, (string) ($attachment['post_mime_type'] ?? ''))) {
                    $referencedPaths[$rel] = true;
                }
            }
        }

        $referencedPaths = array_keys($referencedPaths);
        sort($referencedPaths);

        return [
            'tables' => $tables,
            'kept_posts' => $keptPosts,
            'dropped_posts' => $droppedPosts,
            'attachments' => $keptAttachments,
            'meta_by_post' => $metaByPost,
            'referenced_paths' => $referencedPaths,
            'medium_paths' => $mediumByOriginal,
            'thumbnail_ids' => $thumbnailIds,
            'attachment_parents' => $contentAttachmentIds,
            'galleries' => $galleries,
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

        $postColumns = [
            'ID', 'post_author', 'post_date', 'post_date_gmt', 'post_content', 'post_title',
            'post_excerpt', 'post_status', 'post_password', 'post_name', 'post_modified',
            'post_modified_gmt', 'post_parent', 'guid', 'menu_order', 'post_type', 'post_mime_type',
        ];

        $galleryIds = [];
        foreach ($plan['kept_posts'] as $post) {
            if (preg_match_all('/\[FinalTilesGallery\s+id=["\']?(\d+)/i', (string) ($post['post_content'] ?? ''), $matches)) {
                foreach ($matches[1] as $galleryId) {
                    $galleryIds[(int) $galleryId] = true;
                }
            }
        }

        $galleryRows = array_values(array_filter(
            $plan['tables']['wp_finaltiles_gallery_images'] ?? [],
            fn (array $row): bool => isset($galleryIds[(int) ($row['gid'] ?? 0)]),
        ));

        $sql = "-- Filtered legacy WordPress dump\nSET NAMES utf8mb4;\n\n";
        $sql .= $this->insertSql('wp_posts', $postColumns, $posts);
        $sql .= $this->insertSql('wp_postmeta', ['meta_id', 'post_id', 'meta_key', 'meta_value'], $meta);
        $sql .= $this->insertSql('wp_finaltiles_gallery_images', [
            'Id', 'gid', 'type', 'imageId', 'imagePath', 'filters', 'link', 'title',
            'alt', 'target', 'blank', 'description', 'sortOrder', 'group', 'hidden',
        ], $galleryRows);

        file_put_contents($destination, $sql);
    }

    /**
     * @param  array<string, mixed>  $plan
     * @return array{imported: int, files: int, missing: list<string>, pruned: array{deleted: int, bytes: int}}
     */
    public function import(array $plan, ?string $uploadsDir): array
    {
        $usedSlugs = LegacyConference::query()->pluck('slug', 'wp_id')->all();
        $imported = 0;
        $filesCount = 0;
        $missing = [];
        $galleries = $plan['galleries'] ?? [];

        foreach ($plan['kept_posts'] as $post) {
            $wpId = (int) $post['ID'];
            $title = $this->sanitizer->sanitizeTitle((string) $post['post_title']);
            $slug = $this->conferenceSlug($post, $title, $usedSlugs);
            $usedSlugs[$wpId] = $slug;

            $content = $this->sanitizer->sanitizeAndRewrite((string) $post['post_content'], $galleries);
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

        $pruned = $this->pruneUnreferencedStorage($this->collectStoredKeepRels());

        return [
            'imported' => $imported,
            'files' => $filesCount,
            'missing' => array_values(array_unique($missing)),
            'pruned' => $pruned,
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

        $keepRowIds = [];
        $missing = [];
        $count = 0;

        $thumbnailAttachment = ($thumbnailId !== null && isset($attachmentIds[$thumbnailId]))
            ? $attachmentIds[$thumbnailId]
            : null;

        if (is_array($thumbnailAttachment)) {
            $originalRel = $this->primaryAttachmentRel($thumbnailAttachment, $plan['meta_by_post'][$thumbnailId] ?? []);
            if ($originalRel !== null && ! $this->shouldSkipRel($originalRel)) {
                $mediumRel = $plan['medium_paths'][$originalRel] ?? null;
                $serveRel = $originalRel;
                if (is_string($mediumRel)) {
                    $mediumStored = $this->storeLegacyFile($mediumRel, $uploadsDir);
                    if ($mediumStored !== null) {
                        $serveRel = $mediumRel;
                    } else {
                        $missing[] = $mediumRel;
                    }
                }

                $stored = $this->storeLegacyFile($serveRel, $uploadsDir);
                if ($stored === null) {
                    $missing[] = $serveRel;
                } else {
                    $row = LegacyConferenceFile::query()->updateOrCreate(
                        [
                            'legacy_conference_id' => $conference->id,
                            'wp_attachment_id' => $thumbnailId,
                            'path' => $stored['path'],
                        ],
                        [
                            'original_name' => basename($serveRel),
                            'mime' => $stored['mime'] ?: ($thumbnailAttachment['post_mime_type'] ?? null),
                            'size' => $stored['size'],
                            'kind' => 'image',
                            'is_featured' => true,
                        ],
                    );
                    $keepRowIds[] = $row->id;
                    $count++;
                }
            }
        }

        foreach ($attachmentIds as $attachmentId => $attachment) {
            $originalRel = $this->primaryAttachmentRel($attachment, $plan['meta_by_post'][$attachmentId] ?? []);
            if ($originalRel === null || $this->shouldSkipRel($originalRel)) {
                continue;
            }

            if (! $this->isDownloadRel($originalRel, (string) ($attachment['post_mime_type'] ?? ''))) {
                continue;
            }

            $stored = $this->storeLegacyFile($originalRel, $uploadsDir);
            if ($stored === null) {
                $missing[] = $originalRel;

                continue;
            }

            $row = LegacyConferenceFile::query()->updateOrCreate(
                [
                    'legacy_conference_id' => $conference->id,
                    'wp_attachment_id' => $attachmentId,
                    'path' => $stored['path'],
                ],
                [
                    'original_name' => basename($originalRel),
                    'mime' => $stored['mime'] ?: ($attachment['post_mime_type'] ?? null),
                    'size' => $stored['size'],
                    'kind' => $this->kindFromName($originalRel, (string) ($attachment['post_mime_type'] ?? '')),
                    'is_featured' => false,
                ],
            );
            $keepRowIds[] = $row->id;
            $count++;
        }

        $conference->files()
            ->whereNotIn('id', $keepRowIds !== [] ? $keepRowIds : [0])
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

        return 'INSERT INTO `'.$table.'` ('.implode(',', array_map(fn (string $column): string => '`'.$column.'`', $columns)).') VALUES '.implode(',', $values).";\n\n";
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
        if ($extension === 'mp4' || str_starts_with($mime, 'video/')) {
            return 'video';
        }
        if (in_array($extension, self::DOWNLOAD_EXTENSIONS, true) || str_starts_with($mime, 'application/pdf')) {
            return 'document';
        }

        return 'other';
    }

    /**
     * @param  list<array<string, mixed>>  $galleryImages
     * @return array<int, list<array{src: string, alt: string}>>
     */
    private function buildGalleries(array $galleryImages): array
    {
        $grouped = [];
        foreach ($galleryImages as $image) {
            if ((string) ($image['hidden'] ?? '0') === '1') {
                continue;
            }

            $gid = (int) ($image['gid'] ?? 0);
            if ($gid < 1) {
                continue;
            }

            $path = (string) ($image['imagePath'] ?? '');
            $src = $this->sanitizer->rewriteUploadUrls($path);
            if ($src === $path) {
                $normalized = $this->normalizeRel($path);
                if ($normalized !== null && ! str_starts_with($normalized, 'http')) {
                    $src = '/legacy-files/'.$normalized;
                }
            }

            if ($src === '') {
                continue;
            }

            $grouped[$gid][] = [
                'sort' => (int) ($image['sortOrder'] ?? 0),
                'src' => $src,
                'alt' => (string) ($image['alt'] ?? $image['title'] ?? ''),
            ];
        }

        $result = [];
        foreach ($grouped as $gid => $images) {
            usort($images, fn (array $a, array $b): int => $a['sort'] <=> $b['sort']);
            $result[$gid] = array_map(
                fn (array $image): array => ['src' => $image['src'], 'alt' => $image['alt']],
                $images,
            );
        }

        return $result;
    }

    /**
     * @return list<string>
     */
    public function extractLegacyFileRels(string $html): array
    {
        $paths = [];
        if (preg_match_all('#(?:https?:)?(?://[^/"\']+)?/legacy-files/([^"\'\s<>?]+)#i', $html, $matches)) {
            foreach ($matches[1] as $raw) {
                $normalized = $this->normalizeRel(rawurldecode($raw));
                if ($normalized !== null) {
                    $paths[$normalized] = true;
                }
            }
        }

        foreach ($this->extractUploadPaths($html) as $path) {
            $paths[$path] = true;
        }

        return array_keys($paths);
    }

    /**
     * @param  array<string, mixed>  $attachment
     * @param  array<string, list<string>>  $meta
     * @return list<string>
     */
    private function attachmentRels(array $attachment, array $meta): array
    {
        $rels = [];
        $primary = $this->primaryAttachmentRel($attachment, $meta);
        if ($primary !== null) {
            $rels[] = $primary;
        }

        return $rels;
    }

    /**
     * @param  array<string, mixed>  $attachment
     * @param  array<string, list<string>>  $meta
     */
    private function primaryAttachmentRel(array $attachment, array $meta): ?string
    {
        $attached = $meta['_wp_attached_file'][0] ?? null;
        if (is_string($attached) && $attached !== '') {
            $normalized = $this->normalizeRel($attached);
            if ($normalized !== null) {
                return $normalized;
            }
        }

        foreach ($this->extractUploadPaths((string) ($attachment['guid'] ?? '')) as $path) {
            return $path;
        }

        return null;
    }

    private function isDownloadRel(string $rel, string $mime = ''): bool
    {
        $extension = strtolower(pathinfo($rel, PATHINFO_EXTENSION));

        return in_array($extension, self::DOWNLOAD_EXTENSIONS, true)
            || $mime === 'application/pdf'
            || $mime === 'video/mp4';
    }

    /**
     * @return array<string, true>
     */
    public function collectStoredKeepRels(): array
    {
        $keep = [];
        foreach (LegacyConference::query()->get(['content_html']) as $conference) {
            foreach ($this->extractLegacyFileRels((string) $conference->content_html) as $rel) {
                $keep[$rel] = true;
            }
        }

        foreach (LegacyConferenceFile::query()->pluck('path') as $path) {
            $rel = preg_replace('#^legacy/#', '', str_replace('\\', '/', (string) $path));
            if (is_string($rel) && $rel !== '') {
                $keep[$rel] = true;
            }
        }

        return $keep;
    }

    /**
     * @param  array<string, true>  $keepRels
     * @return array{deleted: int, bytes: int}
     */
    public function pruneUnreferencedStorage(array $keepRels): array
    {
        $root = Storage::disk('public')->path('legacy');
        if (! is_dir($root)) {
            return ['deleted' => 0, 'bytes' => 0];
        }

        $deleted = 0;
        $bytes = 0;
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($root, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST,
        );

        foreach ($iterator as $file) {
            $full = $file->getPathname();
            if ($file->isDir()) {
                @rmdir($full);

                continue;
            }

            $rel = str_replace('\\', '/', substr($full, strlen(rtrim($root, '/\\')) + 1));
            if (isset($keepRels[$rel])) {
                continue;
            }

            $bytes += (int) $file->getSize();
            unlink($full);
            $deleted++;
        }

        return ['deleted' => $deleted, 'bytes' => $bytes];
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
