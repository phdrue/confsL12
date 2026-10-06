<?php

use App\Legacy\WpLegacyFilter;

it('keeps published conference posts', function () {
    $reason = (new WpLegacyFilter)->dropReason([
        'post_type' => 'post',
        'post_status' => 'publish',
        'post_title' => 'Конференция по хирургии',
        'post_content' => 'Программа',
        'post_excerpt' => '',
    ]);

    expect($reason)->toBeNull();
});

it('drops casino spam and html-title posts', function (array $post, string $expected) {
    expect((new WpLegacyFilter)->dropReason($post))->toBe($expected);
})->with([
    'casino' => [[
        'post_type' => 'post',
        'post_status' => 'publish',
        'post_title' => 'BetonRed7 Plongez dans l\'univers compétitif de l\'e-sport',
        'post_content' => 'casino',
        'post_excerpt' => '',
    ], 'spam_keyword'],
    'html title' => [[
        'post_type' => 'post',
        'post_status' => 'publish',
        'post_title' => '<h1>Test Post for WordPress</h1>',
        'post_content' => '',
        'post_excerpt' => '',
    ], 'spam_html_title'],
    'trash' => [[
        'post_type' => 'post',
        'post_status' => 'trash',
        'post_title' => 'Настоящая конференция',
        'post_content' => '',
        'post_excerpt' => '',
    ], 'trash'],
    'page' => [[
        'post_type' => 'page',
        'post_status' => 'publish',
        'post_title' => 'О нас',
        'post_content' => '',
        'post_excerpt' => '',
    ], 'not_post'],
]);

it('keeps only attached-file thumbnail and old-slug meta keys for the clean dump', function () {
    $filter = new WpLegacyFilter;

    expect($filter->shouldKeepMetaKey('_wp_attached_file'))->toBeTrue()
        ->and($filter->shouldKeepMetaKey('_thumbnail_id'))->toBeTrue()
        ->and($filter->shouldKeepMetaKey('_wp_old_slug'))->toBeTrue()
        ->and($filter->shouldKeepMetaKey('_elementor_data'))->toBeFalse()
        ->and($filter->shouldKeepMetaKey('_wp_attachment_metadata'))->toBeFalse();
});
