<?php

use App\Models\LegacyConference;
use App\Models\LegacyConferenceFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\get;

it('renders the archive index', function () {
    LegacyConference::factory()->create([
        'title' => 'Архивная конференция',
        'published_at' => '2021-08-19 09:39:50',
    ]);

    get('/archive/conferences')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('archive/conferences/index')
            ->has('conferences.data', 1)
            ->where('conferences.data.0.title', 'Архивная конференция')
            ->missing('conferences.data.0.categories'));
});

it('renders sanitized html on the archive show page', function () {
    $conference = LegacyConference::factory()->create([
        'slug' => 'hirurgiya',
        'title' => 'Конференция по хирургии',
        'content_html' => '<p>Hello</p><img src="/legacy-files/2021/08/photo.jpg" alt="">',
        'published_at' => '2021-08-19 09:39:50',
    ]);

    LegacyConferenceFile::factory()->create([
        'legacy_conference_id' => $conference->id,
        'original_name' => 'photo.jpg',
        'path' => 'legacy/2021/08/photo.jpg',
        'mime' => 'image/jpeg',
        'kind' => 'image',
        'is_featured' => false,
    ]);

    LegacyConferenceFile::factory()->create([
        'legacy_conference_id' => $conference->id,
        'original_name' => 'program.pdf',
        'path' => 'legacy/2021/08/program.pdf',
        'mime' => 'application/pdf',
        'kind' => 'document',
        'is_featured' => false,
    ]);

    get('/archive/conferences/'.$conference->slug)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('archive/conferences/show')
            ->where('conference.title', 'Конференция по хирургии')
            ->where('conference.content_html', '<p>Hello</p><img src="/legacy-files/2021/08/photo.jpg" alt="">')
            ->has('conference.files', 1)
            ->where('conference.files.0.original_name', 'program.pdf')
            ->missing('conference.categories'));
});

it('downloads an archive file', function () {
    Storage::fake('public');
    Storage::disk('public')->put('legacy/2021/08/program.pdf', 'pdf-bytes');

    $conference = LegacyConference::factory()->create();
    $file = LegacyConferenceFile::factory()->create([
        'legacy_conference_id' => $conference->id,
        'original_name' => 'program.pdf',
        'path' => 'legacy/2021/08/program.pdf',
        'mime' => 'application/pdf',
        'size' => 9,
    ]);

    get(route('archive.files.download', $file))
        ->assertOk()
        ->assertDownload('program.pdf');
});

it('does not list spam posts that were never imported', function () {
    LegacyConference::factory()->create(['title' => 'Настоящая конференция']);

    get('/archive/conferences')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('conferences.data', 1)
            ->where('conferences.data.0.title', 'Настоящая конференция'));
});

it('renders the archive show page with a long conference title', function () {
    $conference = LegacyConference::factory()->create([
        'slug' => 'obshchestvennoe-zdorove',
        'title' => 'Проблемы общественного здоровья, организации здравоохранения и фармации',
        'content_html' => '<p>Программа</p>',
        'published_at' => '2021-08-19 09:39:50',
    ]);

    get('/archive/conferences/'.$conference->slug)
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('archive/conferences/show')
            ->where('conference.title', 'Проблемы общественного здоровья, организации здравоохранения и фармации'));
});

it('redirects archive to the conferences list', function () {
get('/archive')->assertRedirect('/archive/conferences');
    });
