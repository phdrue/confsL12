<?php

use App\Enums\Role as RoleEnum;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

it('provides the manuals for download from public storage', function () {
    expect(public_path('manual1.pdf'))->toBeFile()
        ->and(public_path('manual2.pdf'))->toBeFile();
});

it('shows the responsible dashboard with manuals to responsible users', function () {
    Role::create(['id' => RoleEnum::RESPONSIBLE->value, 'name' => 'Ответственный за конференцию']);

    $responsible = User::factory()->create();
    $responsible->roles()->attach(RoleEnum::RESPONSIBLE->value);

    $this->actingAs($responsible)
        ->get('/dashboard')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboards/responsible')
        );
});
