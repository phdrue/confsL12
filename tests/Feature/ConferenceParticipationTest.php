<?php

use App\Enums\ConferenceStateEnum;
use App\Models\Conference;
use App\Models\ConferenceState;
use App\Models\ConferenceUser;
use App\Models\Country;
use App\Models\ReportType;
use App\Notifications\ParticipationConfirmed;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

test('user can participate without documents when conference is in the future', function () {
    Notification::fake();
    Mail::fake();

    $user = createUserWithCompleteProfile();

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Active',
    ]);

    /** @var Conference $conference */
    $conference = Conference::factory()->create([
        'state_id' => ConferenceStateEnum::ACTIVE->value,
        'date' => now()->addYear(),
        'allow_report' => false,
        'allow_thesis' => false,
        'force_enroll' => true,
    ]);

    expect(now()->addMonth()->lt($conference->date))->toBeTrue();

    actingAs($user);

    $response = post(route('client.conferences.participate', $conference), [
        'authorization' => '',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('conferences.show', $conference));

    expect(
        ConferenceUser::where('conference_id', $conference->id)
            ->where('user_id', $user->id)
            ->exists()
    )->toBeTrue();

    Notification::assertSentTo($user, ParticipationConfirmed::class);
    Mail::assertNothingSent();
});

test('participation notification is sent on both create and update', function () {
    Notification::fake();
    Mail::fake();

    $user = createUserWithCompleteProfile();

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Active',
    ]);

    /** @var Conference $conference */
    $conference = Conference::factory()->create([
        'state_id' => ConferenceStateEnum::ACTIVE->value,
        'date' => now()->addMonths(2),
        'allow_report' => false,
        'allow_thesis' => false,
        'force_enroll' => false,
    ]);

    actingAs($user);

    post(route('client.conferences.participate', $conference), [
        'authorization' => '',
    ])->assertSessionHasNoErrors();

    post(route('client.conferences.participate', $conference), [
        'authorization' => '',
    ])->assertSessionHasNoErrors();

    Notification::assertSentToTimes($user, ParticipationConfirmed::class, 2);
    Mail::assertNothingSent();
});

test('user cannot submit documents within one month before conference when force_enroll is false', function () {
    $user = createUserWithCompleteProfile();

    ensureDocumentTypesExist();

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Active',
    ]);

    $country = Country::firstOrCreate(['name' => 'Docs Country']);
    $reportType = ReportType::create(['name' => 'Доклад']);

    /** @var Conference $conference */
    $conference = Conference::factory()->create([
        'state_id' => ConferenceStateEnum::ACTIVE->value,
        'date' => now()->addDays(10),
        'allow_report' => true,
        'force_enroll' => false,
    ]);

    actingAs($user);

    $response = $this->from(route('conferences.show', $conference))
        ->post(route('client.conferences.participate', $conference), [
            'authorization' => '',
            'reports' => [
                [
                    'topic' => 'Test topic',
                    'report_type_id' => $reportType->id,
                    'authors' => [
                        [
                            'name' => 'Author Name',
                            'organization' => 'Org',
                            'city' => 'City',
                            'country_id' => $country->id,
                        ],
                    ],
                    'science_guides' => [],
                ],
            ],
        ]);

    $response
        ->assertSessionHasErrors('authorization')
        ->assertRedirect(route('conferences.show', $conference));
});

test('user can submit documents more than one month before conference', function () {
    $user = createUserWithCompleteProfile();

    ensureDocumentTypesExist();

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Active',
    ]);

    $country = Country::firstOrCreate(['name' => 'Docs Country 2']);
    $reportType = ReportType::create(['name' => 'Доклад']);

    /** @var Conference $conference */
    $conference = Conference::factory()->create([
        'state_id' => ConferenceStateEnum::ACTIVE->value,
        'date' => now()->addMonths(2),
        'allow_report' => true,
        'force_enroll' => false,
    ]);

    actingAs($user);

    $response = post(route('client.conferences.participate', $conference), [
        'authorization' => '',
        'reports' => [
            [
                'topic' => 'Test topic',
                'report_type_id' => $reportType->id,
                'authors' => [
                    [
                        'name' => 'Author Name',
                        'organization' => 'Org',
                        'city' => 'City',
                        'country_id' => $country->id,
                    ],
                ],
                'science_guides' => [],
            ],
        ],
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('conferences.show', $conference));
});

test('force_enroll allows participation and documents regardless of date and state', function () {
    $user = createUserWithCompleteProfile();

    ensureDocumentTypesExist();

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ARCHIVE->value,
        'name' => 'Archive',
    ]);

    $country = Country::firstOrCreate(['name' => 'Docs Country 3']);
    $reportType = ReportType::create(['name' => 'Доклад']);

    /** @var Conference $conference */
    $conference = Conference::factory()->create([
        'state_id' => ConferenceStateEnum::ARCHIVE->value,
        'date' => now()->subDays(10),
        'allow_report' => true,
        'force_enroll' => true,
    ]);

    actingAs($user);

    $response = post(route('client.conferences.participate', $conference), [
        'authorization' => '',
        'reports' => [
            [
                'topic' => 'Test topic',
                'report_type_id' => $reportType->id,
                'authors' => [
                    [
                        'name' => 'Author Name',
                        'organization' => 'Org',
                        'city' => 'City',
                        'country_id' => $country->id,
                    ],
                ],
                'science_guides' => [],
            ],
        ],
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('conferences.show', $conference));

    expect(
        ConferenceUser::where('conference_id', $conference->id)
            ->where('user_id', $user->id)
            ->exists()
    )->toBeTrue();
});

function participationPayloadWith(array $kinds, int $countryId, int $reportTypeId): array
{
    $authors = [[
        'name' => 'Author Name',
        'organization' => 'Org',
        'city' => 'City',
        'country_id' => $countryId,
    ]];
    $payload = ['authorization' => ''];

    if (in_array('reports', $kinds, true)) {
        $payload['reports'] = [[
            'topic' => 'Report topic',
            'report_type_id' => $reportTypeId,
            'authors' => $authors,
            'science_guides' => [],
        ]];
    }

    if (in_array('thesises', $kinds, true)) {
        $payload['thesises'] = [[
            'topic' => 'Thesis topic',
            'text' => 'Thesis text',
            'literature' => 'Literature',
            'authors' => $authors,
            'science_guides' => [],
        ]];
    }

    return $payload;
}

test('when both thesises and reports are allowed, reports alone are rejected', function (array $kinds, bool $isValid) {
    $user = createUserWithCompleteProfile();
    ensureDocumentTypesExist();

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Active',
    ]);

    $country = Country::firstOrCreate(['name' => 'Rule Country']);
    $reportType = ReportType::create(['name' => 'Доклад']);

    /** @var Conference $conference */
    $conference = Conference::factory()->create([
        'state_id' => ConferenceStateEnum::ACTIVE->value,
        'date' => now()->addMonths(2),
        'allow_report' => true,
        'allow_thesis' => true,
        'force_enroll' => false,
    ]);

    actingAs($user);

    $response = $this->from(route('conferences.show', $conference))
        ->post(
            route('client.conferences.participate', $conference),
            participationPayloadWith($kinds, $country->id, $reportType->id)
        );

    if ($isValid) {
        $response->assertSessionHasNoErrors();
    } else {
        $response->assertSessionHasErrors('reports');
    }
})->with([
    'thesises only' => [['thesises'], true],
    'thesises and reports' => [['thesises', 'reports'], true],
    'reports only' => [['reports'], false],
]);
