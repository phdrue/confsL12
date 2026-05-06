<?php

use App\Enums\Role as RoleEnum;
use App\Models\Conference;
use App\Models\Role;
use App\Models\User;

it('allows admin to download certificates book', function () {
    Role::create(['id' => 1, 'name' => 'Участник']);
    Role::create(['id' => 2, 'name' => 'Администратор']);
    Role::create(['id' => 3, 'name' => 'Ответственный за конференцию']);

    /** @var User $admin */
    $admin = User::factory()->create();
    $admin->roles()->attach(RoleEnum::ADMIN->value);

    $conference = Conference::factory()->create();

    $participants = User::factory()->count(2)->create();
    foreach ($participants as $participant) {
        $conference->users()->attach($participant->id, ['confirmed' => true]);
    }

    $response = $this->actingAs($admin)->get(route('adm.conferences.get-certificates-book', $conference));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
});

it('allows admin to override conference name and date for certificates book', function () {
    Role::create(['id' => 1, 'name' => 'Участник']);
    Role::create(['id' => 2, 'name' => 'Администратор']);
    Role::create(['id' => 3, 'name' => 'Ответственный за конференцию']);

    /** @var User $admin */
    $admin = User::factory()->create();
    $admin->roles()->attach(RoleEnum::ADMIN->value);

    $conference = Conference::factory()->create();
    $participant = User::factory()->create();
    $conference->users()->attach($participant->id, ['confirmed' => true]);

    $response = $this
        ->actingAs($admin)
        ->get(route('adm.conferences.get-certificates-book', $conference).'?conference_name=Тестовая+конференция&data=13+января+2026+года');

    $response->assertOk();
    $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
});
