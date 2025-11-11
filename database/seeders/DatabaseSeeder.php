<?php

namespace Database\Seeders;

use App\Models\Role;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use App\Models\Image;
use App\Models\Title;
use App\Models\Degree;
use App\Models\Country;
use App\Models\Conference;
use App\Models\ReportType;
use App\Models\DocumentType;
use App\Models\ImageCategory;
use App\Models\ConferenceType;
use App\Enums\Role as RoleEnum;
use App\Models\ConferenceState;
use Illuminate\Database\Seeder;
use App\Models\ParticipationType;
use App\Models\ConferenceBlockType;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            BaseSeeder::class,
            UsersSeeder::class,
        ]);
    }
}
