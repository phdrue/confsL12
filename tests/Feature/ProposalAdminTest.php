<?php

namespace Tests\Feature;

use App\Models\Proposal;
use App\Models\Conference;
use App\Models\User;
use App\Models\ConferenceType;
use App\Models\ConferenceState;
use App\Enums\ConferenceStateEnum;
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
                'topics' => 'Test topics'
            ]
        ]);

        // Create admin user
        $admin = User::factory()->create();
        $admin->roles()->create(['name' => 'Администратор']);

        $this->actingAs($admin);

        // Test deny proposal
        $response = $this->put(route('adm.proposals.deny', $proposal));
        
        $response->assertRedirect();
        $response->assertSessionHas('success', 'Предложение отклонено');
        
        $proposal->refresh();
        $this->assertTrue($proposal->denied);
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
                'topics' => 'Test topics'
            ]
        ]);

        // Create admin user
        $admin = User::factory()->create();
        $admin->roles()->create(['name' => 'Администратор']);

        $this->actingAs($admin);

        // Test approve proposal
        $response = $this->put(route('adm.proposals.approve', $proposal));
        
        $response->assertRedirect();
        $response->assertSessionHas('success', 'Конференция создана из предложения');
        
        $proposal->refresh();
        $this->assertFalse($proposal->denied);
        $this->assertNotNull($proposal->conference_id);
        
        // Check conference was created
        $conference = Conference::find($proposal->conference_id);
        $this->assertNotNull($conference);
        $this->assertEquals('Test Conference', $conference->name);
        $this->assertEquals(ConferenceStateEnum::DRAFT->value, $conference->state_id);
        $this->assertEquals(1, $conference->type_id); // International
    }

    public function test_non_admin_cannot_deny_proposal()
    {
        $user = User::factory()->create();
        $proposal = Proposal::create([
            'user_id' => $user->id,
            'payload' => ['name' => 'Test']
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
            'payload' => ['name' => 'Test']
        ]);

        $this->actingAs($user);

        $response = $this->put(route('adm.proposals.approve', $proposal));
        
        $response->assertStatus(403);
    }
}
