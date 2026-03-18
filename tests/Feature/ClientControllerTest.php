<?php

namespace Tests\Feature;

use App\Enums\ConferenceStateEnum;
use App\Models\Conference;
use App\Models\ConferenceState;
use App\Models\ConferenceType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_thesis_requirements_page_loads()
    {
        $response = $this->get('/thesis-requirements');

        $response->assertSuccessful();

        $page = $response->viewData('page');
        $this->assertEquals('client/thesis-requirements', $page['component']);
    }

    public function test_conferences_pagination_works()
    {
        // Create test data
        $state = ConferenceState::create([
            'id' => ConferenceStateEnum::ACTIVE->value,
            'name' => 'Active',
        ]);
        $type = ConferenceType::create(['name' => 'International']);

        // Create 15 conferences to test pagination
        for ($i = 1; $i <= 15; $i++) {
            Conference::create([
                'name' => "Conference {$i}",
                'description' => "Description for conference {$i}",
                'date' => now()->addDays($i),
                'state_id' => $state->id,
                'type_id' => $type->id,
                'front_page' => false,
            ]);
        }

        // Test first page
        $response = $this->get('/conferences');
        $response->assertStatus(200);

        $data = $response->viewData('page')['props'];
        $this->assertArrayHasKey('conferences', $data);
        $this->assertEquals(1, $data['conferences']['current_page']);
        $this->assertEquals(2, $data['conferences']['last_page']);
        $this->assertEquals(10, $data['conferences']['per_page']);
        $this->assertEquals(15, $data['conferences']['total']);
        $this->assertCount(10, $data['conferences']['data']);

        // Test second page
        $response = $this->get('/conferences?page=2');
        $response->assertStatus(200);

        $data = $response->viewData('page')['props'];
        $this->assertEquals(2, $data['conferences']['current_page']);
        $this->assertCount(5, $data['conferences']['data']);
    }

    public function test_conferences_pagination_with_state_filter()
    {
        // Create test data
        $activeState = ConferenceState::create([
            'id' => ConferenceStateEnum::ACTIVE->value,
            'name' => 'Active',
        ]);
        $archiveState = ConferenceState::create([
            'id' => ConferenceStateEnum::ARCHIVE->value,
            'name' => 'Archive',
        ]);
        $type = ConferenceType::create(['name' => 'International']);

        // Create conferences with different states
        for ($i = 1; $i <= 5; $i++) {
            Conference::create([
                'name' => "Active Conference {$i}",
                'description' => "Description for active conference {$i}",
                'date' => now()->addDays($i),
                'state_id' => $activeState->id,
                'type_id' => $type->id,
                'front_page' => false,
            ]);
        }

        for ($i = 1; $i <= 5; $i++) {
            Conference::create([
                'name' => "Archive Conference {$i}",
                'description' => "Description for archive conference {$i}",
                'date' => now()->subDays($i),
                'state_id' => $archiveState->id,
                'type_id' => $type->id,
                'front_page' => false,
            ]);
        }

        // Test with state filter
        $response = $this->get('/conferences?state='.$activeState->id);
        $response->assertStatus(200);

        $data = $response->viewData('page')['props'];
        $this->assertEquals(1, $data['conferences']['current_page']);
        $this->assertEquals(1, $data['conferences']['last_page']);
        $this->assertEquals(5, $data['conferences']['total']);
        $this->assertCount(5, $data['conferences']['data']);
    }
}
