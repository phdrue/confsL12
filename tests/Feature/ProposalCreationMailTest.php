<?php

use App\Enums\Role as RoleEnum;
use App\Mail\NewProposalMail;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\post;

test('email is sent when proposal is created', function () {
    Mail::fake();

    /** @var User $user */
    $user = User::factory()->create();

    Role::firstOrCreate(
        ['id' => RoleEnum::RESPONSIBLE->value],
        ['name' => 'Ответственный']
    );

    $user->roles()->attach(RoleEnum::RESPONSIBLE->value);

    actingAs($user);

    $payload = [
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
    ];

    $response = post(route('adm.proposals.store'), $payload);

    $response->assertRedirect(route('adm.proposals.index'));

    Mail::assertSent(NewProposalMail::class, function (NewProposalMail $mail) use ($user) {
        return $mail->proposal->user_id === $user->id;
    });
});
