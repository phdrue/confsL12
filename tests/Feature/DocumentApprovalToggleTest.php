<?php

use App\Enums\Role as RoleEnum;
use App\Models\Conference;
use App\Models\ConferenceUser;
use App\Models\Document;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

it('toggles document approval from participations page', function () {
    Role::create(['id' => 1, 'name' => 'Участник']);
    Role::create(['id' => 2, 'name' => 'Администратор']);
    Role::create(['id' => 3, 'name' => 'Ответственный за конференцию']);

    $responsible = User::factory()->create();
    $responsible->roles()->attach(RoleEnum::RESPONSIBLE->value);

    $conference = Conference::factory()->create();
    $conference->responsible()->attach($responsible->id);

    $participant = User::factory()->create();
    $conference->users()->attach($participant->id, ['confirmed' => false]);
    $conferenceUser = ConferenceUser::query()
        ->where('conference_id', $conference->id)
        ->where('user_id', $participant->id)
        ->firstOrFail();

    DB::table('document_types')->insert([
        'id' => 2,
        'name' => 'Тезис',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $document = Document::query()->create([
        'conference_user_id' => $conferenceUser->id,
        'type_id' => 2,
        'topic' => 'Test topic',
        'is_approved' => true,
    ]);

    $this->actingAs($responsible)
        ->put(route('adm.conferences.toggle-document-approval', [$conference, $document]))
        ->assertRedirect(route('adm.conferences.participations', $conference));

    expect($document->fresh()->is_approved)->toBeFalse();

    $participationsResponse = $this->actingAs($responsible)
        ->get(route('adm.conferences.participations', $conference));
    $participationsResponse->assertOk();

    $props = $participationsResponse->viewData('page')['props'];
    $firstUserDocuments = $props['users']['data'][0]['participation_documents']['thesises'];

    expect($firstUserDocuments)->toHaveCount(1);
    expect($firstUserDocuments[0]['is_approved'])->toBeFalse();
});

it('returns not found when toggling document from another conference', function () {
    Role::create(['id' => 1, 'name' => 'Участник']);
    Role::create(['id' => 2, 'name' => 'Администратор']);
    Role::create(['id' => 3, 'name' => 'Ответственный за конференцию']);

    $admin = User::factory()->create();
    $admin->roles()->attach(RoleEnum::ADMIN->value);

    $conference = Conference::factory()->create();
    $anotherConference = Conference::factory()->create();

    $participant = User::factory()->create();
    $anotherConference->users()->attach($participant->id, ['confirmed' => false]);
    $conferenceUser = ConferenceUser::query()
        ->where('conference_id', $anotherConference->id)
        ->where('user_id', $participant->id)
        ->firstOrFail();

    DB::table('document_types')->insert([
        'id' => 1,
        'name' => 'Доклад',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $document = Document::query()->create([
        'conference_user_id' => $conferenceUser->id,
        'type_id' => 1,
        'topic' => 'Another topic',
        'is_approved' => true,
    ]);

    $this->actingAs($admin)
        ->put(route('adm.conferences.toggle-document-approval', [$conference, $document]))
        ->assertNotFound();
});
