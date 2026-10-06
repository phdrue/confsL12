<?php

namespace App\Legacy;

use InvalidArgumentException;
use RuntimeException;

class WpSqlDumpParser
{
    /**
     * @var array<string, list<string>>
     */
    private const TABLE_COLUMNS = [
        'wp_posts' => [
            'ID', 'post_author', 'post_date', 'post_date_gmt', 'post_content', 'post_title',
            'post_excerpt', 'post_status', 'comment_status', 'ping_status', 'post_password',
            'post_name', 'to_ping', 'pinged', 'post_modified', 'post_modified_gmt',
            'post_content_filtered', 'post_parent', 'guid', 'menu_order', 'post_type',
            'post_mime_type', 'comment_count',
        ],
        'wp_postmeta' => ['meta_id', 'post_id', 'meta_key', 'meta_value'],
        'wp_term_relationships' => ['object_id', 'term_taxonomy_id', 'term_order'],
        'wp_term_taxonomy' => ['term_taxonomy_id', 'term_id', 'taxonomy', 'description', 'parent', 'count'],
        'wp_terms' => ['term_id', 'name', 'slug', 'term_group'],
        'wp_finaltiles_gallery_images' => [
            'Id', 'gid', 'type', 'imageId', 'imagePath', 'filters', 'link', 'title',
            'alt', 'target', 'blank', 'description', 'sortOrder', 'group', 'hidden',
        ],
    ];

    /**
     * @return array<string, list<array<string, mixed>>>
     */
    public function parse(string $path): array
    {
        if (! is_readable($path)) {
            throw new InvalidArgumentException("SQL dump is not readable: {$path}");
        }

        $handle = fopen($path, 'r');

        if ($handle === false) {
            throw new RuntimeException("Unable to open SQL dump: {$path}");
        }

        $tables = [];

        try {
            while (($line = fgets($handle)) !== false) {
                if (! str_starts_with($line, 'INSERT INTO `')) {
                    continue;
                }

                if (! preg_match('/^INSERT INTO `([^`]+)` VALUES /', $line, $matches)) {
                    continue;
                }

                $table = $matches[1];
                $valuesPart = substr($line, strlen($matches[0]));
                $valuesPart = rtrim($valuesPart);
                if (str_ends_with($valuesPart, ';')) {
                    $valuesPart = substr($valuesPart, 0, -1);
                }

                $rows = $this->parseValueGroups($valuesPart);
                $named = array_map(fn (array $row): array => $this->nameRow($table, $row), $rows);
                $tables[$table] = array_merge($tables[$table] ?? [], $named);
            }
        } finally {
            fclose($handle);
        }

        return $tables;
    }

    /**
     * @param  list<mixed>  $row
     * @return array<string, mixed>
     */
    private function nameRow(string $table, array $row): array
    {
        $columns = self::TABLE_COLUMNS[$table] ?? null;

        if ($columns === null) {
            return $row;
        }

        $named = [];
        foreach ($columns as $index => $column) {
            $named[$column] = $row[$index] ?? null;
        }

        return $named;
    }

    /**
     * @return list<list<mixed>>
     */
    public function parseValueGroups(string $sql): array
    {
        $rows = [];
        $length = strlen($sql);
        $i = 0;

        while ($i < $length) {
            while ($i < $length && in_array($sql[$i], [' ', ',', "\n", "\r", "\t"], true)) {
                $i++;
            }

            if ($i >= $length) {
                break;
            }

            if ($sql[$i] !== '(') {
                throw new RuntimeException('Unexpected SQL dump token while parsing INSERT values.');
            }

            $i++;
            $row = [];
            $field = '';
            $inString = false;

            while ($i < $length) {
                $char = $sql[$i];

                if ($inString) {
                    if ($char === '\\') {
                        $i++;
                        if ($i >= $length) {
                            break;
                        }
                        $field .= $this->unescape($sql[$i]);
                    } elseif ($char === "'") {
                        $inString = false;
                    } else {
                        $field .= $char;
                    }
                    $i++;

                    continue;
                }

                if ($char === "'") {
                    $inString = true;
                    $field = '';
                    $i++;

                    continue;
                }

                if ($char === ',') {
                    $row[] = $this->castField($field);
                    $field = '';
                    $i++;

                    continue;
                }

                if ($char === ')') {
                    $row[] = $this->castField($field);
                    $rows[] = $row;
                    $i++;
                    break;
                }

                $field .= $char;
                $i++;
            }
        }

        return $rows;
    }

    private function unescape(string $char): string
    {
        return match ($char) {
            'n' => "\n",
            'r' => "\r",
            't' => "\t",
            '0' => "\0",
            'Z' => "\x1A",
            default => $char,
        };
    }

    private function castField(string $field): mixed
    {
        $field = trim($field);

        if ($field === 'NULL' || $field === '') {
            return $field === 'NULL' ? null : $field;
        }

        return $field;
    }
}
