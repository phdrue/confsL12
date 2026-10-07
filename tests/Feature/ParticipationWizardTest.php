<?php

use App\Enums\ConferenceStateEnum;
use App\Models\Conference;
use App\Models\ConferenceState;
use App\Models\ConferenceUser;
use App\Models\Country;
use App\Models\Document;
use App\Models\ReportType;
use App\Services\ParticipationDraft;
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

test('participation choice and form pages render', function () {
    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();

    actingAs($user);

    get(route('client.conferences.participation', $conference))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/conferences/participate/choice')
            ->where('canAddThesis', true)
            ->where('canAddReport', true)
            ->where('canFinish', true)
        );

    get(route('client.conferences.participation.thesis', $conference))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/conferences/participate/thesis')
        );

    get(route('client.conferences.participation.report', $conference))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/conferences/participate/report')
        );

    get(route('client.conferences.participation.finish', $conference))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('client/conferences/participate/finish')
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
            ->component('client/conferences/participate/choice')
            ->where('canEditDocuments', false)
            ->where('canAddThesis', false)
            ->where('canAddReport', false)
            ->where('canFinish', true)
            ->where('draft.thesises', [])
            ->where('draft.reports', [])
        );

    get(route('client.conferences.participation.thesis', $conference))
        ->assertForbidden();

    get(route('client.conferences.participation.report', $conference))
        ->assertForbidden();
});

test('adding a thesis without required fields is rejected', function () {
    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();

    actingAs($user);

    post(route('client.conferences.participation.thesis.store', $conference), [])
        ->assertSessionHasErrors(['topic', 'text', 'literature', 'authors']);
});

test('adding a report without required fields is rejected', function () {
    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();

    actingAs($user);

    post(route('client.conferences.participation.report.store', $conference), [])
        ->assertSessionHasErrors(['topic', 'report_type_id', 'authors']);
});

test('adding a thesis writes the session and not documents', function () {
    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();
    ensureDocumentTypesExist();

    actingAs($user);

    post(route('client.conferences.participation.thesis.store', $conference), draftThesisPayload())
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $draft = session((new ParticipationDraft)->sessionKey($user, $conference));

    expect($draft['thesises'])->toHaveCount(1)
        ->and($draft['thesises'][0]['topic'])->toBe('Thesis topic')
        ->and($draft['thesises'][0]['key'])->not->toBeEmpty()
        ->and(Document::query()->count())->toBe(0)
        ->and(
            ConferenceUser::query()
                ->where('conference_id', $conference->id)
                ->where('user_id', $user->id)
                ->exists()
        )->toBeFalse();
});

test('delete and draft reset stay in the session', function () {
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

    expect(Document::query()->count())->toBe(1);

    get(route('client.conferences.participation', $conference))->assertSuccessful();

    post(route('client.conferences.participation.thesis.store', $conference), [
        ...draftThesisPayload($countryId),
        'topic' => 'Second thesis',
    ])->assertSessionHasNoErrors();

    $draft = new ParticipationDraft;
    $sessionDraft = session($draft->sessionKey($user, $conference));
    expect($sessionDraft['thesises'])->toHaveCount(2);
    expect(Document::query()->count())->toBe(1);

    $addedKey = collect($sessionDraft['thesises'])->firstWhere('topic', 'Second thesis')['key'];

    $this->delete(route('client.conferences.participation.thesis.destroy', [
        'conference' => $conference,
        'item' => $addedKey,
    ]))->assertRedirect();

    $sessionDraft = session($draft->sessionKey($user, $conference));
    expect($sessionDraft['thesises'])->toHaveCount(1)
        ->and($sessionDraft['thesises'][0]['topic'])->toBe('Thesis topic');
    expect(Document::query()->count())->toBe(1);

    post(route('client.conferences.participation.thesis.store', $conference), [
        ...draftThesisPayload($countryId),
        'topic' => 'Temporary thesis',
    ]);

    post(route('client.conferences.participation.draft.reset', $conference))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('conferences.show', $conference));

    $sessionDraft = session($draft->sessionKey($user, $conference));
    expect($sessionDraft['thesises'])->toHaveCount(1)
        ->and($sessionDraft['thesises'][0]['topic'])->toBe('Thesis topic');
    expect(Document::query()->count())->toBe(1);
});

test('leaving without saving discards an unsaved application', function () {
    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();
    ensureDocumentTypesExist();

    actingAs($user);

    post(route('client.conferences.participation.thesis.store', $conference), draftThesisPayload())
        ->assertSessionHasNoErrors();

    post(route('client.conferences.participation.draft.reset', $conference))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('conferences.show', $conference));

    $sessionDraft = session((new ParticipationDraft)->sessionKey($user, $conference));

    expect($sessionDraft['thesises'])->toBeEmpty()
        ->and(Document::query()->count())->toBe(0)
        ->and(
            ConferenceUser::query()
                ->where('conference_id', $conference->id)
                ->where('user_id', $user->id)
                ->exists()
        )->toBeFalse();
});

test('finish creates the participation and clears the draft', function () {
    Mail::fake();

    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();
    ensureDocumentTypesExist();

    actingAs($user);

    post(route('client.conferences.participation.thesis.store', $conference), draftThesisPayload())
        ->assertSessionHasNoErrors();

    post(route('client.conferences.participation.finish.store', $conference), [
        'reports' => [['topic' => 'Client should not be able to inject this']],
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
    expect(session()->has((new ParticipationDraft)->sessionKey($user, $conference)))->toBeFalse();
});

test('report without thesis still fails on finish', function () {
    $user = createUserWithCompleteProfile();
    $conference = createActiveConference();
    ensureDocumentTypesExist();

    actingAs($user);

    post(route('client.conferences.participation.report.store', $conference), draftReportPayload())
        ->assertSessionHasNoErrors();

    $this->from(route('client.conferences.participation.finish', $conference))
        ->post(route('client.conferences.participation.finish.store', $conference))
        ->assertSessionHasErrors('reports');

    expect(Document::query()->count())->toBe(0)
        ->and(
            ConferenceUser::query()
                ->where('conference_id', $conference->id)
                ->where('user_id', $user->id)
                ->exists()
        )->toBeFalse();
});

test('an abandoned draft does not change an existing application', function () {
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

    get(route('client.conferences.participation', $conference))->assertSuccessful();

    post(route('client.conferences.participation.thesis.store', $conference), [
        ...draftThesisPayload($countryId),
        'topic' => 'Unsaved thesis',
    ])->assertSessionHasNoErrors();

    expect(Document::query()->count())->toBe(1)
        ->and(Document::query()->first()->topic)->toBe('Thesis topic');
});
