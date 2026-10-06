<?php

namespace Database\Factories;

use App\Models\LegacyConference;
use App\Models\LegacyConferenceFile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LegacyConferenceFile>
 */
class LegacyConferenceFileFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->word().'.pdf';

        return [
            'legacy_conference_id' => LegacyConference::factory(),
            'wp_attachment_id' => fake()->unique()->numberBetween(1, 999999),
            'original_name' => $name,
            'mime' => 'application/pdf',
            'size' => 1024,
            'path' => 'legacy/2021/08/'.$name,
            'kind' => 'document',
            'is_featured' => false,
        ];
    }
}
