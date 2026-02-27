<?php

use App\Enums\ConferenceStateEnum;
use App\Models\Conference;
use App\Models\ConferenceState;
use App\Models\ConferenceUser;
use App\Models\Country;
use App\Models\Degree;
use App\Models\DocumentType;
use App\Models\ReportType;
use App\Models\Title;
use App\Models\User;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

function createUserWithCompleteProfile(): User
{
    $country = Country::create(['name' => 'Test Country']);
    $degree = Degree::create(['name' => 'Test Degree']);
    $title = Title::create(['name' => 'Test Title']);

    return User::factory()->create([
        'first_name' => 'First',
        'last_name' => 'Last',
        'second_name' => 'Middle',
        'organization' => 'Org',
        'position' => 'Position',
        'city' => 'City',
        'phone' => '+10000000000',
        'country_id' => $country->id,
        'degree_id' => $degree->id,
        'title_id' => $title->id,
    ]);
}

function ensureDocumentTypesExist(): void
{
    DocumentType::firstOrCreate(['id' => 1], ['name' => 'Доклад']);
    DocumentType::firstOrCreate(['id' => 2], ['name' => 'Тезисы']);
}

test('user can participate without documents when conference is in the future', function () {
    $user = createUserWithCompleteProfile();

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Active',
    ]);

    /** @var Conference $conference */
    $conference = Conference::factory()->create([
        'state_id' => ConferenceStateEnum::ACTIVE->value,
        'date' => now()->addDays(5),
        'allow_report' => false,
        'allow_thesis' => false,
        'force_enroll' => false,
    ]);

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
