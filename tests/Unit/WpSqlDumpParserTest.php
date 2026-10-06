<?php

use App\Legacy\WpSqlDumpParser;

it('parses insert rows into named wp_posts columns', function () {
    $path = dirname(__DIR__).'/fixtures/legacy/mini-wp.sql';
    $tables = (new WpSqlDumpParser)->parse($path);

    expect($tables['wp_posts'])->toHaveCount(4)
        ->and($tables['wp_posts'][0]['ID'])->toBe('100')
        ->and($tables['wp_posts'][0]['post_title'])->toBe('Конференция по хирургии')
        ->and($tables['wp_postmeta'][0]['meta_key'])->toBe('_wp_attached_file')
        ->and($tables['wp_terms'][0]['name'])->toBe('Архив');
});

it('unescapes quoted strings in values', function () {
    $parser = new WpSqlDumpParser;
    $rows = $parser->parseValueGroups("(1,'it\\'s a test',NULL)");

    expect($rows[0][0])->toBe('1')
        ->and($rows[0][1])->toBe("it's a test")
        ->and($rows[0][2])->toBeNull();
});
