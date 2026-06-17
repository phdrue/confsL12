<?php

use App\Enums\Role as RoleEnum;
use App\Models\Conference;
use App\Models\Role;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

it('allows admin to download participants excel', function () {
    Role::create(['id' => 1, 'name' => 'Участник']);
    Role::create(['id' => 2, 'name' => 'Администратор']);
    Role::create(['id' => 3, 'name' => 'Ответственный за конференцию']);

    /** @var User $admin */
    $admin = User::factory()->create();
    $admin->roles()->attach(RoleEnum::ADMIN->value);

    $conference = Conference::factory()->create();
    $participant = User::factory()->create();
    $conference->users()->attach($participant->id, ['confirmed' => false]);

    $response = $this->actingAs($admin)->get(route('adm.conferences.get-participants-excel', $conference));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
});

it('returns not found when conference has no participants for excel export', function () {
    Role::create(['id' => 1, 'name' => 'Участник']);
    Role::create(['id' => 2, 'name' => 'Администратор']);
    Role::create(['id' => 3, 'name' => 'Ответственный за конференцию']);

    /** @var User $admin */
    $admin = User::factory()->create();
    $admin->roles()->attach(RoleEnum::ADMIN->value);

    $conference = Conference::factory()->create();

    $response = $this->actingAs($admin)->get(route('adm.conferences.get-participants-excel', $conference));

    $response->assertNotFound();
    $response->assertJson([
        'error' => 'Нет участников для экспорта',
    ]);
});
