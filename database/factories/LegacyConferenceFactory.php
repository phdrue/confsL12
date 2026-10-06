<?php

namespace Database\Factories;

use App\Models\LegacyConference;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<LegacyConference>
 */
class LegacyConferenceFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(4);

        return [
            'wp_id' => fake()->unique()->numberBetween(1000, 999999),
            'slug' => Str::slug($title).'-'.fake()->unique()->numerify('###'),
            'title' => $title,
            'content_html' => '<p>'.fake()->paragraph().'</p>',
            'excerpt' => fake()->sentence(),
            'status' => 'publish',
            'published_at' => fake()->dateTimeBetween('-5 years', '-1 month'),
            'source_url' => 'https://ksmuconfs.org/?p='.fake()->numberBetween(1, 9999),
            'meta' => [],
        ];
    }
}
