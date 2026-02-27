<?php

namespace Tests\Feature;

use App\Enums\ConferenceStateEnum;
use App\Enums\Role as RoleEnum;
use App\Models\Conference;
use App\Models\ConferenceState;
use App\Models\ConferenceType;
use App\Models\Proposal;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProposalAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_deny_proposal()
    {
        // Create test data
        $user = User::factory()->create();
        $proposal = Proposal::create([
            'user_id' => $user->id,
            'payload' => [
                'name' => 'Test Conference',
                'shortName' => 'Test',
                'level' => 'Международный',
                'date' => '2024-12-01',
                'topics' => 'Test topics',
            ],
        ]);

        Role::create(['id' => 1, 'name' => 'Участник']);
        Role::create(['id' => 2, 'name' => 'Администратор']);
        Role::create(['id' => 3, 'name' => 'Ответственный за конференцию']);

        // Create admin user
        $admin = User::factory()->create();
        $admin->roles()->attach(RoleEnum::ADMIN->value);

        Role::firstOrCreate(
            ['id' => RoleEnum::RESPONSIBLE->value],
            ['name' => 'Ответственный']
        );

        $this->actingAs($admin);

        // Test deny proposal
        $response = $this->put(route('adm.proposals.deny', $proposal));

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Предложение отклонено');

        $proposal->refresh();
        $this->assertEquals(1, $proposal->denied);
    }

    public function test_admin_can_approve_proposal_and_create_conference()
    {
        // Create test data
        $user = User::factory()->create();
        $proposal = Proposal::create([
            'user_id' => $user->id,
            'payload' => [
                'name' => 'Test Conference',
                'shortName' => 'Test',
                'level' => 'Международный',
                'date' => '2024-12-01',
                'topics' => 'Test topics',
            ],
        ]);

        Role::create(['id' => 1, 'name' => 'Участник']);
        Role::create(['id' => 2, 'name' => 'Администратор']);
        Role::create(['id' => 3, 'name' => 'Ответственный за конференцию']);

        // Create admin user
        $admin = User::factory()->create();
        $admin->roles()->attach(RoleEnum::ADMIN->value);

        ConferenceState::create([
            'id' => ConferenceStateEnum::PLANNED->value,
            'name' => 'Planned',
        ]);

        ConferenceType::create(['id' => 1, 'name' => 'Региональный']);
        ConferenceType::create(['id' => 2, 'name' => 'Всероссийский']);
        ConferenceType::create(['id' => 3, 'name' => 'Международный']);
        ConferenceType::create(['id' => 4, 'name' => 'Другой']);

        $this->actingAs($admin);

        // Test approve proposal
        $response = $this->put(route('adm.proposals.approve', $proposal));

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Конференция создана из предложения');

        $proposal->refresh();
        $this->assertEquals(0, $proposal->denied);
        $this->assertNotNull($proposal->conference_id);

        // Check conference was created
        $conference = Conference::find($proposal->conference_id);
        $this->assertNotNull($conference);
        $this->assertEquals('Test Conference', $conference->name);
        $this->assertEquals(ConferenceStateEnum::PLANNED->value, $conference->state_id);
        $this->assertEquals(3, $conference->type_id); // Международный
    }

    public function test_non_admin_cannot_deny_proposal()
    {
        $user = User::factory()->create();
        $proposal = Proposal::create([
            'user_id' => $user->id,
            'payload' => ['name' => 'Test'],
        ]);

        $this->actingAs($user);

        $response = $this->put(route('adm.proposals.deny', $proposal));

        $response->assertStatus(403);
    }

    public function test_non_admin_cannot_approve_proposal()
    {
        $user = User::factory()->create();
        $proposal = Proposal::create([
            'user_id' => $user->id,
            'payload' => ['name' => 'Test'],
        ]);

        $this->actingAs($user);

        $response = $this->put(route('adm.proposals.approve', $proposal));

        $response->assertStatus(403);
    }
}
