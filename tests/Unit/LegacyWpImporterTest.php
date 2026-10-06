<?php

use App\Legacy\WpLegacyImporter;
use App\Models\LegacyConference;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Schema;
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
        ->and(LegacyConference::query()->count())->toBe(1)
        ->and(Schema::hasTable('legacy_conference_categories'))->toBeFalse()
        ->and(Schema::hasTable('legacy_conference_category'))->toBeFalse();

    $conference = LegacyConference::query()->first();
    expect($conference->title)->toBe('Конференция по хирургии')
        ->and($conference->content_html)->not->toContain('<script')
        ->and($conference->content_html)->not->toContain('<iframe')
        ->and($conference->content_html)->toContain('/legacy-files/2021/08/photo.jpg')
        ->and(LegacyConference::query()->where('title', 'like', '%BetonRed%')->exists())->toBeFalse();

    Storage::disk('public')->assertExists('legacy/2021/08/photo.jpg');
});

it('stores download attachments and the featured image only', function () {
    Storage::fake('public');

    $uploads = sys_get_temp_dir().DIRECTORY_SEPARATOR.'legacy-uploads-'.uniqid();
    mkdir($uploads.'/2021/08', 0777, true);
    foreach ([
        'photo.jpg',
        'photo-300x225.jpg',
        'extra.jpg',
        'extra-300x200.jpg',
        'program.pdf',
        'unused.jpg',
        'gallery.jpg',
        'logo.png',
    ] as $name) {
        file_put_contents($uploads.'/2021/08/'.$name, $name.'-bytes');
    }

    $importer = app(WpLegacyImporter::class);
    $plan = $importer->analyze(dirname(__DIR__).'/fixtures/legacy/files-wp.sql');
    $result = $importer->import($plan, $uploads);

    $conference = LegacyConference::query()->where('wp_id', 100)->first();
    $titled = LegacyConference::query()->where('wp_id', 110)->first();

    expect($result['imported'])->toBe(2)
        ->and($titled->title)->toBe('Коррупция в сфере образования')
        ->and($conference->content_html)->toContain('/legacy-files/2021/08/extra.jpg')
        ->and($conference->content_html)->toContain('/legacy-files/2021/08/gallery.jpg')
        ->and($conference->content_html)->not->toContain('[FinalTilesGallery')
        ->and($conference->content_html)->not->toContain('printfriendly')
        ->and($conference->content_html)->not->toContain('konferencii.ru')
        ->and($conference->files)->toHaveCount(2)
        ->and($conference->files->where('is_featured', true)->first()->original_name)->toBe('photo-300x225.jpg')
        ->and($conference->files->where('kind', 'document')->first()->original_name)->toBe('program.pdf')
        ->and($conference->files->where('kind', 'image')->where('is_featured', false))->toHaveCount(0);

    Storage::disk('public')->assertExists('legacy/2021/08/photo-300x225.jpg');
    Storage::disk('public')->assertExists('legacy/2021/08/extra.jpg');
    Storage::disk('public')->assertExists('legacy/2021/08/gallery.jpg');
    Storage::disk('public')->assertExists('legacy/2021/08/program.pdf');
    Storage::disk('public')->assertMissing('legacy/2021/08/photo.jpg');
    Storage::disk('public')->assertMissing('legacy/2021/08/extra-300x200.jpg');
    Storage::disk('public')->assertMissing('legacy/2021/08/unused.jpg');
    Storage::disk('public')->assertMissing('legacy/2021/08/logo.png');
});
