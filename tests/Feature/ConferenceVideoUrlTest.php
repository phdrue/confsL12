<?php

use App\Enums\Role as RoleEnum;
use App\Models\Conference;
use App\Models\Role;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

function createAdminForVideoTests(): User
{
    Role::create(['id' => 1, 'name' => 'Участник']);
    Role::create(['id' => 2, 'name' => 'Администратор']);
    Role::create(['id' => 3, 'name' => 'Ответственный за конференцию']);

    /** @var User $admin */
    $admin = User::factory()->create();
    $admin->roles()->attach(RoleEnum::ADMIN->value);

    return $admin;
}

/**
 * @return array<string, mixed>
 */
function conferenceUpdatePayload(Conference $conference, ?string $videoUrl): array
{
    return [
        'name' => $conference->name,
        'description' => $conference->description,
        'primary_color' => $conference->primary_color,
        'type_id' => $conference->type_id,
        'date' => '2030-01-15',
        'allow_thesis' => false,
        'allow_report' => false,
        'video_url' => $videoUrl,
    ];
}

it('stores a vk video url on conference update', function () {
    $admin = createAdminForVideoTests();
    $conference = Conference::factory()->create();
    $url = 'https://vk.ru/video_ext.php?oid=-22822305&id=456241864&hd=2';

    $this->actingAs($admin)
        ->put(route('adm.conferences.update', $conference), conferenceUpdatePayload($conference, $url))
        ->assertSessionHasNoErrors();

    expect($conference->fresh()->video_url)->toBe($url);
});

it('allows clearing the video url', function () {
    $admin = createAdminForVideoTests();
    $conference = Conference::factory()->create(['video_url' => 'https://vk.ru/video_ext.php?oid=1&id=2']);

    $this->actingAs($admin)
        ->put(route('adm.conferences.update', $conference), conferenceUpdatePayload($conference, ''))
        ->assertSessionHasNoErrors();

    expect($conference->fresh()->video_url)->toBeNull();
});

it('rejects non vk video urls', function (string $url) {
    $admin = createAdminForVideoTests();
    $conference = Conference::factory()->create();

    $this->actingAs($admin)
        ->put(route('adm.conferences.update', $conference), conferenceUpdatePayload($conference, $url))
        ->assertSessionHasErrors('video_url');

    expect($conference->fresh()->video_url)->toBeNull();
})->with([
    'other host' => 'https://youtube.com/video_ext.php?oid=1&id=2',
    'not embed path' => 'https://vk.ru/video-1_2',
    'not a url' => 'not-a-url',
]);
