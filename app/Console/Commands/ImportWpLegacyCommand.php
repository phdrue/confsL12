<?php

namespace App\Console\Commands;

use App\Legacy\WpLegacyImporter;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ImportWpLegacyCommand extends Command
{
    protected $signature = 'legacy:import-wp
                            {--sql= : Path to the WordPress SQL dump}
                            {--uploads= : Path to wp-content/uploads}
                            {--dry-run : Analyze and write reports without importing}
                            {--import : Upsert kept posts into legacy_* tables}
                            {--write-clean-sql= : Write a filtered SQL dump to this path}
                            {--copy-to= : Copy referenced files here (never moves the backup)}
                            {--report-dir= : Directory for CSV/text reports}';

    protected $description = 'Filter and import the stripped WordPress conferences dump into the read-only archive';

    public function handle(WpLegacyImporter $importer): int
    {
        $sql = (string) ($this->option('sql') ?: config('legacy.sql'));
        $uploads = (string) ($this->option('uploads') ?: config('legacy.uploads'));
        $dryRun = (bool) $this->option('dry-run');
        $doImport = (bool) $this->option('import');
        $cleanSql = $this->option('write-clean-sql');
        $copyTo = $this->option('copy-to');
        $reportDir = $this->option('report-dir');

        if (! $dryRun && ! $doImport && $cleanSql === null && $copyTo === null) {
            $dryRun = true;
        }

        if ($sql === '' || ! is_readable($sql)) {
            $this->error('SQL dump not found: '.$sql);

            return self::FAILURE;
        }

        $this->info('Parsing dump: '.$sql);
        $plan = $importer->analyze($sql);

        $kept = count($plan['kept_posts']);
        $dropped = count($plan['dropped_posts']);
        $attachments = count($plan['attachments']);
        $paths = count($plan['referenced_paths']);

        $this->info("Kept posts: {$kept}");
        $this->info("Dropped posts: {$dropped}");
        $this->info("Kept attachments: {$attachments}");
        $this->info("Referenced file paths: {$paths}");

        $before = is_dir($uploads) ? $importer->directoryStats($uploads) : ['files' => 0, 'bytes' => 0];
        if (is_dir($uploads)) {
            $this->info('Uploads before: '.$before['files'].' files, '.$this->formatMb($before['bytes']));
        }

        $missing = [];
        $bytesKept = 0;
        if (is_dir($uploads)) {
            foreach ($plan['referenced_paths'] as $rel) {
                if ($importer->shouldSkipRel($rel)) {
                    continue;
                }
                $source = rtrim($uploads, '/\\').DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $rel);
                if (! is_file($source)) {
                    $missing[] = $rel;

                    continue;
                }
                $bytesKept += (int) filesize($source);
            }
        }

        $this->info('Referenced existing files: '.($paths - count($missing)).', missing: '.count($missing));
        $this->info('Referenced files size: '.$this->formatMb($bytesKept));

        if (is_dir($uploads)) {
            $this->info('Top 20 largest kept files:');
            foreach ($importer->largestKeptFiles($plan, $uploads) as $item) {
                $this->line('  '.$this->formatMb($item['bytes']).'  '.$item['path']);
            }
        }

        if (is_string($reportDir) && $reportDir !== '') {
            File::ensureDirectoryExists($reportDir);
            $this->writeCsv($reportDir.'/legacy-kept.csv', ['id', 'title', 'reason'], array_map(
                fn (array $post): array => [(int) $post['ID'], (string) $post['post_title'], 'keep'],
                $plan['kept_posts'],
            ));
            $this->writeCsv($reportDir.'/legacy-dropped.csv', ['id', 'title', 'reason'], array_map(
                fn (array $row): array => [$row['id'], $row['title'], $row['reason']],
                $plan['dropped_posts'],
            ));
            file_put_contents($reportDir.'/legacy-missing-files.txt', implode("\n", $missing).($missing === [] ? '' : "\n"));
            $this->info('Wrote reports to '.$reportDir);
        }

        if (is_string($cleanSql) && $cleanSql !== '') {
            File::ensureDirectoryExists(dirname($cleanSql));
            $importer->writeCleanSql($plan, $cleanSql);
            $this->info('Wrote clean SQL: '.$cleanSql);
        }

        if (is_string($copyTo) && $copyTo !== '') {
            if (! is_dir($uploads)) {
                $this->error('Uploads directory not found: '.$uploads);

                return self::FAILURE;
            }
            $copyResult = $importer->copyReferencedFiles($plan, $uploads, $copyTo);
            $this->info('Copied '.$copyResult['copied'].' files ('.$this->formatMb($copyResult['bytes_kept']).') to '.$copyTo);
        }

        if ($doImport) {
            $uploadsArg = is_dir($uploads) ? $uploads : null;
            $result = $importer->import($plan, $uploadsArg);
            $this->info('Imported '.$result['imported'].' conferences, '.$result['files'].' files.');
            if (($result['pruned']['deleted'] ?? 0) > 0) {
                $this->info('Pruned '.$result['pruned']['deleted'].' unused files ('.$this->formatMb($result['pruned']['bytes']).').');
            }
            if ($result['missing'] !== []) {
                $this->warn('Missing files during import: '.count($result['missing']));
            }
        } elseif ($dryRun) {
            $this->comment('Dry-run only. Pass --import to upsert into legacy_* tables.');
        }

        return self::SUCCESS;
    }

    /**
     * @param  list<string>  $headers
     * @param  list<list<mixed>>  $rows
     */
    private function writeCsv(string $path, array $headers, array $rows): void
    {
        $handle = fopen($path, 'w');
        if ($handle === false) {
            return;
        }

        fputcsv($handle, $headers);
        foreach ($rows as $row) {
            fputcsv($handle, $row);
        }
        fclose($handle);
    }

    private function formatMb(int $bytes): string
    {
        return number_format($bytes / 1048576, 1).' MB';
    }
}
