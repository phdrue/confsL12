<?php

use App\Enums\Role as RoleEnum;
use App\Models\Conference;
use App\Models\Proposal;
use App\Models\Role;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;
use function Pest\Laravel\put;

function proposalPayload(array $overrides = []): array
{
    return array_merge([
        'name' => 'Test Conference',
        'shortName' => 'Test',
        'engShortName' => 'Test ENG',
        'engName' => 'Test Conference ENG',
        'level' => 'Международный',
        'form' => 'Очная',
        'type' => 'Научная',
        'lang' => 'RU',
        'date' => '2025-01-01',
        'endDate' => '2025-01-02',
        'place' => 'Курск',
        'department' => 'Тестовое подразделение',
        'organization' => 'КГМУ',
        'organizationOther' => 'Другая организация',
        'participationsTotal' => '100',
        'participationsForeign' => '10',
        'audiences' => ['Студенты', 'Преподаватели'],
        'bookType' => 'Сборник тезисов',
        'topics' => 'Тестовая тематика',
        'budget' => '100000',
        'budgetSource' => 'Грант',
        'coverageInPerson' => '50',
        'coverageOnline' => '50',
        'coverageProfession' => 'Международный медицинский',
    ], $overrides);
}

beforeEach(function () {
    Role::firstOrCreate(
        ['id' => RoleEnum::RESPONSIBLE->value],
        ['name' => 'Ответственный']
    );
    Role::firstOrCreate(
        ['id' => RoleEnum::ADMIN->value],
        ['name' => 'Администратор']
    );
});

test('store rejects duplicate proposal by name and date', function () {
    $user = User::factory()->create();
    $user->roles()->attach(RoleEnum::RESPONSIBLE->value);
    actingAs($user);

    Proposal::create([
        'user_id' => $user->id,
        'payload' => proposalPayload(['name' => 'Unique Name', 'date' => '2025-06-15']),
    ]);

    $response = post(route('adm.proposals.store'), proposalPayload([
        'name' => 'Unique Name',
        'date' => '2025-06-15',
    ]));

    $response->assertSessionHasErrors('name');
    expect(Proposal::count())->toBe(1);
});

test('store accepts proposal when name and date pair is unique', function () {
    $user = User::factory()->create();
    $user->roles()->attach(RoleEnum::RESPONSIBLE->value);
    actingAs($user);

    Proposal::create([
        'user_id' => $user->id,
        'payload' => proposalPayload(['name' => 'First', 'date' => '2025-01-01']),
    ]);

    $response = post(route('adm.proposals.store'), proposalPayload([
        'name' => 'First',
        'date' => '2025-01-02',
    ]));

    $response->assertRedirect(route('adm.proposals.index'));
    expect(Proposal::count())->toBe(2);
});

test('update rejects when name and date pair is taken by another proposal', function () {
    $user = User::factory()->create();
    $user->roles()->attach(RoleEnum::ADMIN->value);
    actingAs($user);

    Proposal::create([
        'user_id' => $user->id,
        'payload' => proposalPayload(['name' => 'Existing', 'date' => '2025-03-01']),
    ]);
    $proposalToUpdate = Proposal::create([
        'user_id' => $user->id,
        'payload' => proposalPayload(['name' => 'Other', 'date' => '2025-04-01']),
    ]);

    $response = put(route('adm.proposals.update', $proposalToUpdate), proposalPayload([
        'name' => 'Existing',
        'date' => '2025-03-01',
    ]));

    $response->assertSessionHasErrors('name');
    $proposalToUpdate->refresh();
    expect($proposalToUpdate->payload['name'])->toBe('Other');
});

test('update accepts when name and date unchanged for same proposal', function () {
    $user = User::factory()->create();
    $user->roles()->attach(RoleEnum::ADMIN->value);
    actingAs($user);

    $proposal = Proposal::create([
        'user_id' => $user->id,
        'payload' => proposalPayload(['name' => 'Same', 'date' => '2025-05-10']),
    ]);

    $response = put(route('adm.proposals.update', $proposal), proposalPayload([
        'name' => 'Same',
        'date' => '2025-05-10',
        'topics' => 'Updated topics',
    ]));

    $response->assertRedirect(route('adm.proposals.index'));
    $proposal->refresh();
    expect($proposal->payload['topics'])->toBe('Updated topics');
});

test('update accepts proposal in any status including approved and denied', function () {
    $user = User::factory()->create();
    $user->roles()->attach(RoleEnum::ADMIN->value);
    actingAs($user);

    $conference = Conference::factory()->create();
    $proposal = Proposal::create([
        'user_id' => $user->id,
        'conference_id' => $conference->id,
        'denied' => true,
        'payload' => proposalPayload([
            'name' => 'Any Status',
            'date' => '2025-07-01',
            'topics' => 'Before update',
        ]),
    ]);

    $response = put(route('adm.proposals.update', $proposal), proposalPayload([
        'name' => 'Any Status',
        'date' => '2025-07-01',
        'topics' => 'Updated in approved+denied status',
    ]));

    $response->assertRedirect(route('adm.proposals.index'));
    $proposal->refresh();
    expect($proposal->payload['topics'])->toBe('Updated in approved+denied status');
});
