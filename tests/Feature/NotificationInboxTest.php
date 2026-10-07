<?php

use App\Enums\ConferenceStateEnum;
use App\Models\Conference;
use App\Models\ConferenceState;
use App\Notifications\ParticipationConfirmed;

use function Pest\Laravel\actingAs;
use function Pest\Laravel\getJson;

test('index lists only the authenticated users notifications', function () {
    $owner = createUserWithCompleteProfile();
    $other = createUserWithCompleteProfile();

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Active',
    ]);

    /** @var Conference $conference */
    $conference = Conference::factory()->create([
        'state_id' => ConferenceStateEnum::ACTIVE->value,
    ]);

    $owner->notify(new ParticipationConfirmed($conference));
    $other->notify(new ParticipationConfirmed($conference));

    actingAs($owner)
        ->getJson(route('notifications.index'))
        ->assertOk()
        ->assertJsonPath('unread_count', 1)
        ->assertJsonCount(1, 'notifications')
        ->assertJsonPath('notifications.0.title', 'Подтверждение регистрации на конференцию')
        ->assertJsonPath('notifications.0.conference_id', $conference->id)
        ->assertJsonPath('notifications.0.read_at', null);
});

test('a user cannot mark another users notification as read', function () {
    $owner = createUserWithCompleteProfile();
    $other = createUserWithCompleteProfile();

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Active',
    ]);

    /** @var Conference $conference */
    $conference = Conference::factory()->create([
        'state_id' => ConferenceStateEnum::ACTIVE->value,
    ]);

    $owner->notify(new ParticipationConfirmed($conference));
    $notification = $owner->notifications()->first();

    actingAs($other)
        ->postJson(route('notifications.read', $notification))
        ->assertForbidden();

    expect($notification->fresh()->read_at)->toBeNull();
});

test('marking one notification as read updates read_at', function () {
    $owner = createUserWithCompleteProfile();

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Active',
    ]);

    /** @var Conference $conference */
    $conference = Conference::factory()->create([
        'state_id' => ConferenceStateEnum::ACTIVE->value,
    ]);

    $owner->notify(new ParticipationConfirmed($conference));
    $notification = $owner->notifications()->first();

    actingAs($owner)
        ->postJson(route('notifications.read', $notification))
        ->assertOk()
        ->assertJsonPath('unread_count', 0);

    expect($notification->fresh()->read_at)->not->toBeNull();
});

test('marking all notifications as read clears the unread count', function () {
    $owner = createUserWithCompleteProfile();

    ConferenceState::factory()->create([
        'id' => ConferenceStateEnum::ACTIVE->value,
        'name' => 'Active',
    ]);

    /** @var Conference $conference */
    $conference = Conference::factory()->create([
        'state_id' => ConferenceStateEnum::ACTIVE->value,
    ]);

    $owner->notify(new ParticipationConfirmed($conference));
    $owner->notify(new ParticipationConfirmed($conference));

    actingAs($owner)
        ->postJson(route('notifications.read-all'))
        ->assertOk()
        ->assertJsonPath('unread_count', 0);

    expect($owner->unreadNotifications()->count())->toBe(0);
});

test('guests cannot read the inbox', function () {
    getJson(route('notifications.index'))->assertUnauthorized();
});
