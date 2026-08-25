<?php

use App\Enums\ConferenceStateEnum;
use App\Models\Conference;
use App\Models\ConferenceState;
use App\Models\ConferenceType;
use App\Models\Proposal;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\get;

function conferencePlanPayload(array $overrides = []): array
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
        'date' => now()->addMonth()->toDateString(),
        'endDate' => now()->addMonths(2)->toDateString(),
        'place' => 'Курск',
        'department' => 'Тестовое подразделение',
        'organization' => 'КГМУ',
        'organizationOther' => '',
        'participationsTotal' => '100',
        'participationsForeign' => '10',
        'audiences' => ['Студенты'],
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
    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::PLANNED->value,
        'name' => 'Planned',
    ]);

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Active',
    ]);
});

test('conferences plan page only includes conferences with future finish date from proposal', function () {
    $type = ConferenceType::factory()->create();
    $user = User::factory()->create();

    $futureConference = Conference::factory()->create([
        'type_id' => $type->id,
        'state_id' => ConferenceStateEnum::PLANNED->value,
        'name' => 'Future Conference',
        'date' => now()->addMonth(),
    ]);

    Proposal::create([
        'user_id' => $user->id,
        'conference_id' => $futureConference->id,
        'payload' => conferencePlanPayload([
            'name' => 'Future Conference',
            'endDate' => now()->addMonth()->toDateString(),
        ]),
    ]);

    $pastConference = Conference::factory()->create([
        'type_id' => $type->id,
        'state_id' => ConferenceStateEnum::PLANNED->value,
        'name' => 'Past Conference',
        'date' => now()->subMonths(2),
    ]);

    Proposal::create([
        'user_id' => $user->id,
        'conference_id' => $pastConference->id,
        'payload' => conferencePlanPayload([
            'name' => 'Past Conference',
            'date' => now()->subMonths(2)->toDateString(),
            'endDate' => now()->subMonth()->toDateString(),
        ]),
    ]);

    get(route('conferences.table'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/conferences/table')
            ->has('conferences.data', 1)
            ->where('conferences.data.0.id', $futureConference->id)
        );
});

test('conferences plan page falls back to conference date when proposal end date is missing', function () {
    $type = ConferenceType::factory()->create();

    $futureConference = Conference::factory()->create([
        'type_id' => $type->id,
        'state_id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Future Without Proposal',
        'date' => now()->addWeek(),
    ]);

    $pastConference = Conference::factory()->create([
        'type_id' => $type->id,
        'state_id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Past Without Proposal',
        'date' => now()->subWeek(),
    ]);

    get(route('conferences.table'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/conferences/table')
            ->has('conferences.data', 1)
            ->where('conferences.data.0.id', $futureConference->id)
        );
});
