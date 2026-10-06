<?php

use App\Enums\Role as RoleEnum;
use App\Models\Conference;
use App\Models\Proposal;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    Role::create(['id' => 1, 'name' => 'Участник']);
    Role::create(['id' => 2, 'name' => 'Администратор']);
    Role::create(['id' => 3, 'name' => 'Ответственный за конференцию']);

    config([
        'services.yandex_calendar.email' => 'user@yandex.ru',
        'services.yandex_calendar.app_password' => 'secret',
        'services.yandex_calendar.calendar_path' => 'events-1',
        'services.yandex_calendar.caldav_url' => 'https://caldav.test',
        'app.url' => 'https://confs.test',
    ]);

    $this->admin = User::factory()->create();
    $this->admin->roles()->attach(RoleEnum::ADMIN->value);
});

it('pushes the event and stores the uid when enabled', function () {
    Http::fake(['caldav.test/*' => Http::response('', 201)]);

    $conference = Conference::factory()->create();
    Proposal::create([
        'user_id' => $this->admin->id,
        'conference_id' => $conference->id,
        'payload' => ['date' => '2026-11-10', 'endDate' => '2026-11-12', 'organization' => 'KSMU'],
    ]);

    $this->actingAs($this->admin)
        ->put(route('adm.conferences.toggle-yandex-calendar', $conference))
        ->assertRedirect();

    $uid = "conf-{$conference->id}@confs.test";
    expect($conference->fresh()->yandex_calendar_uid)->toBe($uid);

    Http::assertSent(fn (Request $request) => $request->method() === 'PUT'
        && str_contains($request->url(), "{$uid}.ics")
        && str_contains($request->body(), 'DTSTART;VALUE=DATE:20261110')
        && str_contains($request->body(), 'DTEND;VALUE=DATE:20261113')
        && str_contains($request->body(), 'LOCATION:KSMU'));
});

it('deletes the event and clears the uid when disabled', function () {
    Http::fake(['caldav.test/*' => Http::response('', 204)]);

    $conference = Conference::factory()->create(['yandex_calendar_uid' => 'conf-1@confs.test']);

    $this->actingAs($this->admin)
        ->put(route('adm.conferences.toggle-yandex-calendar', $conference))
        ->assertRedirect();

    expect($conference->fresh()->yandex_calendar_uid)->toBeNull();
    Http::assertSent(fn (Request $request) => $request->method() === 'DELETE');
});

it('keeps state and reports an error when the push fails', function () {
    Http::fake(['caldav.test/*' => Http::response('', 500)]);

    $conference = Conference::factory()->create();

    $this->actingAs($this->admin)
        ->put(route('adm.conferences.toggle-yandex-calendar', $conference))
        ->assertSessionHasErrors('yandex_calendar');

    expect($conference->fresh()->yandex_calendar_uid)->toBeNull();
});
