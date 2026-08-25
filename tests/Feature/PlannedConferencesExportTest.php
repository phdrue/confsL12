<?php

use App\Enums\ConferenceStateEnum;
use App\Enums\Role as RoleEnum;
use App\Exports\PlannedConferencesExporter;
use App\Models\Conference;
use App\Models\ConferenceState;
use App\Models\ConferenceType;
use App\Models\Proposal;
use App\Models\Role;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    Role::create(['id' => RoleEnum::ADMIN->value, 'name' => 'Администратор']);
    Role::create(['id' => RoleEnum::RESPONSIBLE->value, 'name' => 'Ответственный за конференцию']);

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::PLANNED->value,
        'name' => 'Planned',
    ]);

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Active',
    ]);
});

function createResponsibleUser(): User
{
    $user = User::factory()->create();
    $user->roles()->attach(RoleEnum::RESPONSIBLE->value);

    return $user;
}

function plannedConferenceExportPayload(array $overrides = []): array
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
        'organizationOther' => 'Другая организация',
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

it('allows responsible user to export planned conferences as docx', function () {
    $user = createResponsibleUser();
    $type = ConferenceType::factory()->create();
    $proposalAuthor = User::factory()->create();

    $futureConference = Conference::factory()->create([
        'type_id' => $type->id,
        'state_id' => ConferenceStateEnum::PLANNED->value,
        'name' => 'Future Conference',
        'date' => now()->addMonth(),
    ]);

    Proposal::create([
        'user_id' => $proposalAuthor->id,
        'conference_id' => $futureConference->id,
        'payload' => plannedConferenceExportPayload([
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
        'user_id' => $proposalAuthor->id,
        'conference_id' => $pastConference->id,
        'payload' => plannedConferenceExportPayload([
            'name' => 'Past Conference',
            'endDate' => now()->subMonth()->toDateString(),
        ]),
    ]);

    $response = $this->actingAs($user)->get(route('adm.conferences.export-planned-docx'));

    $response->assertOk();
    $response->assertHeader(
        'content-type',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
});

it('allows responsible user to export planned conferences as pdf', function () {
    $user = createResponsibleUser();
    $type = ConferenceType::factory()->create();

    Conference::factory()->create([
        'type_id' => $type->id,
        'state_id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Future Without Proposal',
        'date' => now()->addWeek(),
    ]);

    $response = $this->actingAs($user)->get(route('adm.conferences.export-planned-pdf'));

    $response->assertOk();
    $response->assertHeader('content-type', 'application/pdf');
});

it('builds export rows with the same planned conference columns', function () {
    $type = ConferenceType::factory()->create();
    $proposalAuthor = User::factory()->create();

    $conference = Conference::factory()->create([
        'type_id' => $type->id,
        'state_id' => ConferenceStateEnum::PLANNED->value,
        'name' => 'Fallback Name',
        'date' => now()->addMonth(),
    ]);

    Proposal::create([
        'user_id' => $proposalAuthor->id,
        'conference_id' => $conference->id,
        'payload' => plannedConferenceExportPayload([
            'name' => 'Planned Conference',
            'date' => '2026-07-01',
            'endDate' => '2026-07-05',
            'organization' => 'КГМУ',
            'organizationOther' => 'Партнер 1; Партнер 2',
            'form' => 'Очная',
            'bookType' => 'Сборник тезисов',
        ]),
    ]);

    $rows = app(PlannedConferencesExporter::class)->rows();

    expect($rows)->toHaveCount(1);
    expect($rows[0])->toMatchArray([
        'name' => 'Planned Conference',
        'start_date' => '01.07.2026',
        'end_date' => '05.07.2026',
        'organization' => "КГМУ\nПартнер 1\nПартнер 2",
        'form' => 'Очная',
        'book_type' => 'Сборник тезисов',
    ]);
});

it('forbids guest from exporting planned conferences', function () {
    $this->get(route('adm.conferences.export-planned-docx'))->assertRedirect(route('login'));
    $this->get(route('adm.conferences.export-planned-pdf'))->assertRedirect(route('login'));
});
