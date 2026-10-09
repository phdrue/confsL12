<?php

use App\Enums\ConferenceStateEnum;
use App\Models\Conference;
use App\Models\ConferenceState;
use App\Models\ConferenceUser;
use App\Models\Country;
use App\Models\Document;
use App\Models\ReportType;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\get;
use function Pest\Laravel\post;

beforeEach(function () {
    $this->withoutVite();
});

function createActiveConference(array $overrides = []): Conference
{
    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Active',
    ]);

    return Conference::factory()->create(array_merge([
        'state_id' => ConferenceStateEnum::ACTIVE->value,
        'date' => now()->addMonths(2),
        'allow_report' => true,
        'allow_thesis' => true,
        'force_enroll' => false,
    ], $overrides));
}

function draftThesisPayload(?int $countryId = null): array
{
    $countryId ??= Country::firstOrCreate(['name' => 'Wizard Country'])->id;

    return [
        'topic' => 'Thesis topic',
        'text' => 'Thesis text',
        'literature' => 'Literature',
        'authors' => [[
            'name' => 'Author Name',
            'organization' => 'Org',
            'city' => 'City',
            'country_id' => $countryId,
        ]],
        'science_guides' => [],
    ];
}

function draftReportPayload(?int $countryId = null, ?int $reportTypeId = null): array
{
    $countryId ??= Country::firstOrCreate(['name' => 'Wizard Country'])->id;
    $reportTypeId ??= ReportType::create(['name' => 'Доклад'])->id;

    return [
        'topic' => 'Report topic',
        'report_type_id' => $reportTypeId,
        'authors' => [[
            'name' => 'Author Name',
            'organization' => 'Org',
            'city' => 'City',
            'country_id' => $countryId,
        ]],
        'science_guides' => [],
    ];
}

test('participation wizard page renders with document prefill props', function () {
    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();

    actingAs($user);

    get(route('client.conferences.participation', $conference))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/conferences/participate/index')
            ->where('canAddThesis', true)
            ->where('canAddReport', true)
            ->where('canFinish', true)
            ->where('documents.thesises', [])
            ->where('documents.reports', [])
        );
});

test('within one month before conference document options are closed', function () {
    $user = createUserWithCompleteProfile();
    $conference = createActiveConference([
        'date' => now()->addDays(10),
    ]);

    actingAs($user);

    get(route('client.conferences.participation', $conference))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/conferences/participate/index')
            ->where('canEditDocuments', false)
            ->where('canAddThesis', false)
            ->where('canAddReport', false)
            ->where('canFinish', true)
            ->where('documents.thesises', [])
            ->where('documents.reports', [])
        );
});

test('wizard access without complete profile redirects with a toastable error flash', function () {
    $user = \App\Models\User::factory()->create([
        'first_name' => null,
        'last_name' => null,
        'second_name' => null,
        'organization' => null,
        'position' => null,
        'city' => null,
        'phone' => null,
        'country_id' => null,
        'degree_id' => null,
        'title_id' => null,
    ]);
    $conference = createActiveConference();

    actingAs($user);

    get(route('client.conferences.participation', $conference))
        ->assertRedirect(route('conferences.show', $conference))
        ->assertSessionHas(
            'error',
            'Для участия в конференции необходимо заполнить все данные профиля.',
        );
});

test('finish is rejected with an authorization error when documents are closed', function () {
    $user = createUserWithCompleteProfile();
    $conference = createActiveConference([
        'date' => now()->addDays(10),
    ]);
    ensureDocumentTypesExist();

    actingAs($user);

    $this->from(route('client.conferences.participation', $conference))
        ->post(route('client.conferences.participation.finish.store', $conference), [
            'thesises' => [draftThesisPayload()],
            'reports' => [],
        ])
        ->assertSessionHasErrors([
            'authorization' => 'Вы можете зарегистрироваться на конференцию, но приём докладов и тезисов уже закрыт (до начала конференции осталось менее месяца).',
        ]);
});

test('legacy draft add and delete endpoints are gone', function () {
    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();

    actingAs($user);

    foreach ([
        fn () => post("/participate/{$conference->id}/thesis", draftThesisPayload()),
        fn () => post("/participate/{$conference->id}/report", draftReportPayload()),
        fn () => $this->delete("/participate/{$conference->id}/thesis/some-key"),
        fn () => $this->delete("/participate/{$conference->id}/report/some-key"),
        fn () => post("/participate/{$conference->id}/draft/reset"),
        fn () => get("/participate/{$conference->id}/thesis"),
        fn () => get("/participate/{$conference->id}/report"),
        fn () => get("/participate/{$conference->id}/finish"),
    ] as $request) {
        expect($request()->status())->toBeIn([404, 405]);
    }
});

test('finish with body creates the participation and documents', function () {
    Mail::fake();

    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();
    ensureDocumentTypesExist();

    actingAs($user);

    post(route('client.conferences.participation.finish.store', $conference), [
        'thesises' => [draftThesisPayload()],
        'reports' => [],
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('conferences.show', $conference));

    expect(
        ConferenceUser::query()
            ->where('conference_id', $conference->id)
            ->where('user_id', $user->id)
            ->exists()
    )->toBeTrue();
    expect(Document::query()->where('type_id', 2)->count())->toBe(1);
    expect(Document::query()->where('type_id', 1)->count())->toBe(0);
});

test('finish strips client meta keys and ignores injected session state', function () {
    Mail::fake();

    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();
    ensureDocumentTypesExist();
    $countryId = Country::firstOrCreate(['name' => 'Wizard Country'])->id;

    actingAs($user);

    post(route('client.conferences.participation.finish.store', $conference), [
        'thesises' => [[
            ...draftThesisPayload($countryId),
            'key' => 'client-key',
            'id' => 999999,
        ]],
        'reports' => [],
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('conferences.show', $conference));

    $document = Document::query()->where('type_id', 2)->first();

    expect($document)->not->toBeNull()
        ->and($document->topic)->toBe('Thesis topic')
        ->and($document->id)->not->toBe(999999);
});

test('report without thesis still fails on finish', function () {
    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();
    ensureDocumentTypesExist();

    actingAs($user);

    $this->from(route('client.conferences.participation', $conference))
        ->post(route('client.conferences.participation.finish.store', $conference), [
            'reports' => [draftReportPayload()],
            'thesises' => [],
        ])
        ->assertSessionHasErrors('reports');

    expect(Document::query()->count())->toBe(0)
        ->and(
            ConferenceUser::query()
                ->where('conference_id', $conference->id)
                ->where('user_id', $user->id)
                ->exists()
        )->toBeFalse();
});

test('opening the wizard without finishing leaves an existing application unchanged', function () {
    Mail::fake();

    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();
    ensureDocumentTypesExist();
    $countryId = Country::firstOrCreate(['name' => 'Wizard Country'])->id;

    actingAs($user);

    post(route('client.conferences.participate', $conference), [
        'authorization' => '',
        'thesises' => [draftThesisPayload($countryId)],
    ])->assertSessionHasNoErrors();

    get(route('client.conferences.participation', $conference))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/conferences/participate/index')
            ->has('documents.thesises', 1)
            ->where('documents.thesises.0.topic', 'Thesis topic')
        );

    expect(Document::query()->count())->toBe(1)
        ->and(Document::query()->first()->topic)->toBe('Thesis topic');
});

test('finish updates an existing participation from the request body', function () {
    Mail::fake();

    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();
    ensureDocumentTypesExist();
    $countryId = Country::firstOrCreate(['name' => 'Wizard Country'])->id;

    actingAs($user);

    post(route('client.conferences.participate', $conference), [
        'authorization' => '',
        'thesises' => [draftThesisPayload($countryId)],
    ])->assertSessionHasNoErrors();

    post(route('client.conferences.participation.finish.store', $conference), [
        'thesises' => [[
            ...draftThesisPayload($countryId),
            'topic' => 'Updated thesis',
        ]],
        'reports' => [],
    ])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('conferences.show', $conference));

    expect(Document::query()->count())->toBe(1)
        ->and(Document::query()->first()->topic)->toBe('Updated thesis');
});
