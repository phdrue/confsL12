<?php

use App\Legacy\WpLegacyImporter;
use App\Models\LegacyConference;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;

uses(Tests\TestCase::class, RefreshDatabase::class);

it('imports kept posts from a mini dump and skips spam', function () {
    Storage::fake('public');

    $uploads = sys_get_temp_dir().DIRECTORY_SEPARATOR.'legacy-uploads-'.uniqid();
    mkdir($uploads.'/2021/08', 0777, true);
    file_put_contents($uploads.'/2021/08/photo.jpg', 'image-bytes');

    $importer = app(WpLegacyImporter::class);
    $plan = $importer->analyze(dirname(__DIR__).'/fixtures/legacy/mini-wp.sql');

    expect($plan['kept_posts'])->toHaveCount(1)
        ->and($plan['dropped_posts'])->toHaveCount(2)
        ->and(collect($plan['dropped_posts'])->pluck('reason')->all())->toContain('spam_keyword', 'trash');

    $result = $importer->import($plan, $uploads);

    expect($result['imported'])->toBe(1)
        ->and(LegacyConference::query()->count())->toBe(1);

    $conference = LegacyConference::query()->first();
    expect($conference->title)->toBe('Конференция по хирургии')
        ->and($conference->content_html)->not->toContain('<script')
        ->and($conference->content_html)->not->toContain('<iframe')
        ->and($conference->content_html)->toContain('/legacy-files/2021/08/photo.jpg')
        ->and(LegacyConference::query()->where('title', 'like', '%BetonRed%')->exists())->toBeFalse();

    Storage::disk('public')->assertExists('legacy/2021/08/photo.jpg');
});
