<?php

use App\Enums\Role as RoleEnum;
use App\Models\Conference;
use App\Models\Role;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

it('paginates admin conference participations', function () {
    Role::create(['id' => 1, 'name' => 'Участник']);
    Role::create(['id' => 2, 'name' => 'Администратор']);
    Role::create(['id' => 3, 'name' => 'Ответственный за конференцию']);

    $admin = User::factory()->create();
    $admin->roles()->attach(RoleEnum::ADMIN->value);

    $conference = Conference::factory()->create();

    $participants = User::factory()->count(55)->create();
    foreach ($participants as $participant) {
        $conference->users()->attach($participant->id, ['confirmed' => false]);
    }

    $response = $this->actingAs($admin)->get(route('adm.conferences.participations', $conference).'?per_page=20');
    $response->assertOk();

    $props = $response->viewData('page')['props'];
    expect($props)->toHaveKey('users');
    expect($props['users']['current_page'])->toBe(1);
    expect($props['users']['per_page'])->toBe(20);
    expect($props['users']['total'])->toBe(55);
    expect($props['users']['last_page'])->toBe(3);
    expect($props['users']['data'])->toHaveCount(20);

    $response = $this->actingAs($admin)->get(route('adm.conferences.participations', $conference).'?per_page=20&page=3');
    $response->assertOk();

    $props = $response->viewData('page')['props'];
    expect($props['users']['current_page'])->toBe(3);
    expect($props['users']['data'])->toHaveCount(15);
});
