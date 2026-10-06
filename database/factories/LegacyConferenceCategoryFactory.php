<?php

namespace Database\Factories;

use App\Models\LegacyConferenceCategory;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<LegacyConferenceCategory>
 */
class LegacyConferenceCategoryFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'wp_term_id' => fake()->unique()->numberBetween(1, 99999),
            'name' => $name,
            'slug' => Str::slug($name).'-'.fake()->unique()->numerify('##'),
        ];
    }
}
