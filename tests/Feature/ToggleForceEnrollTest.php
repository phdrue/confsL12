<?php

use App\Models\Conference;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\put;

test('admin can toggle force_enroll on conference', function () {
    /** @var User $admin */
    $admin = User::factory()->create();

    $conference = Conference::factory()->create([
        'force_enroll' => false,
    ]);

    Gate::shouldReceive('allows')->andReturnTrue();
    Gate::shouldReceive('authorize')->andReturnTrue();

    actingAs($admin);

    put(route('adm.conferences.toggle-force-enroll', $conference))
        ->assertRedirect(route('adm.conferences.index'));

    expect($conference->refresh()->force_enroll)->toBeTrue();
});
