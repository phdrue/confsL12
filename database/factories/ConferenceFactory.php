<?php

namespace Database\Factories;

use App\Models\Conference;
use App\Models\ConferenceState;
use App\Models\ConferenceType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Conference>
 */
class ConferenceFactory extends Factory
{
    protected $model = Conference::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type_id' => ConferenceType::factory(),
            'state_id' => ConferenceState::factory(),
            'front_page' => false,
            'name' => $this->faker->sentence(3),
            'description' => $this->faker->paragraph(),
            'date' => now()->addMonth(),
            'allow_thesis' => false,
            'allow_report' => false,
            'img_path' => 'img/placeholders/image.png',
            'primary_color' => '#548FC7',
            'force_enroll' => false,
        ];
    }
}
