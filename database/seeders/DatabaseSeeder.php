<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Conference;
use App\Models\ConferenceBlockType;
use App\Models\ConferenceType;
use App\Models\ConferenceState;
use App\Models\Image;
use App\Models\ParticipationType;
use App\Models\Role;
use App\Enums\Role as RoleEnum;
use App\Models\Country;
use App\Models\Degree;
use App\Models\DocumentType;
use App\Models\ReportType;
use App\Models\Title;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $conferenceTypes = collect([
            1 => 'Региональный',
            2 => 'Всероссийский',
            3 => 'Международный',
            4 => 'Другой',
        ])->each(function ($name, $id) {
            ConferenceType::create([
                'id' => $id,
                'name' => $name
            ]);
        });

        $conferenceStates = collect([
            1 => 'Черновик',
            2 => 'Актуальная',
            3 => 'Архив',
        ])->each(function ($name, $id) {
            ConferenceState::create([
                'id' => $id,
                'name' => $name
            ]);
        });

        $participationTypes = collect([
            1 => 'Участие',
            2 => 'Доклад',
            3 => 'Тезизы'
        ])->each(fn($name, $id) => ParticipationType::create([
            'id' => $id,
            'name' => $name
        ]));

        $documentTypes = collect([
            1 => 'Доклад',
            2 => 'Тезисы',
        ])->each(fn($name, $id) => DocumentType::create([
            'id' => $id,
            'name' => $name
        ]));

        $reportTypes = collect([
            1 => 'Очная презентация / Offline presentation',
            2 => 'Онлайн презентация / Online presentation',
            3 => 'Онлайн постер / Online poster'
        ])->each(fn($name, $id) => ReportType::create([
            'id' => $id,
            'name' => $name
        ]));

        $roles = collect([
            1 => 'Участник',
            2 => 'Администратор',
            3 => 'Ответственный за конференцию'
        ])->each(fn($name, $id) => Role::create([
            'id' => $id,
            'name' => $name
        ]));

        $blockTypes = collect([
            1 => 'Текст',
            2 => 'Список',
            3 => 'Ссылки',
            4 => 'Ключ-значение',
            5 => 'Заголовок',
            6 => 'Дисклеймер',
            7 => 'Разделитель',
            8 => 'Кнопки',
            9 => 'Картинки'
        ])->each(function ($name, $id) {
            ConferenceBlockType::create([
                'id' => $id,
                'name' => $name
            ]);
        });

        $countries = collect([
            1 => 'Россия',
            2 => 'Не россия',
            3 => 'США',
        ])->each(function ($name, $id) {
            Country::create([
                'id' => $id,
                'name' => $name
            ]);
        });

        $degrees = collect([
            1 => 'Не имею / I do not have',
            2 => 'Кандидат наук / PhD',
            3 => 'Доктор наук / Doctor of Sciences',
        ])->each(function ($name, $id) {
            Degree::create([
                'id' => $id,
                'name' => $name
            ]);
        });

        $titles = collect([
            1 => 'Не имею / I do not have',
            2 => 'Доцент / Associate Professor',
            3 => 'Профессор / Professor',
        ])->each(function ($name, $id) {
            Title::create([
                'id' => $id,
                'name' => $name
            ]);
        });

        $conferences = collect([
            [
                'name' => "Педагогика современности: профессиональное образование и развитие",
                'front_page' => true,
                'description' => 'Всероссийская научно-практическая конференция с международным участием, посвящённая 90-летию КГМУ, 70-летию кафедры лучевой диагностики и терапии, 40-летию службы ультразвуковой диагностики Курской области',
                'state_id' => 2,
                'type_id' => 3,
                'date' => '2025-03-23',
                'allow_report' => true,
                'allow_thesis' => true
            ],
            [
                'name' => "Моделирование и прогнозирование развития отраслей социально-экономической сферы",
                'front_page' => true,
                'description' => 'Стимулирование научно-исследовательской деятельности школьников и студентов; обмен идеями, полученными результатами исследований, выводами и предложениями; развитие коммуникативных навыков в профессиональной сфере; мотивация студентов и школьников к углублению химических знаний.',
                'state_id' => 1,
                'type_id' => 2,
                'date' => '2025-06-23'
            ],
            [
                'name' => "Развитие науки и образования в сестринском деле.",
                'front_page' => true,
                'description' => 'Всероссийская научно-практическая конференция с международным участием, посвящённая 90-летию КГМУ, 70-летию кафедры лучевой диагностики и терапии, 40-летию службы ультразвуковой диагностики Курской области',
                'state_id' => 3,
                'type_id' => 1,
                'date' => '2025-04-3'
            ],
            [
                'name' => "Всероссийский офтальмологический форум с международным участием “Курский соловей”, посвященный 85-летию кафедры офтальмологии КГМУ.",
                'front_page' => true,
                'description' => 'Стимулирование научно-исследовательской деятельности школьников и студентов; обмен идеями, полученными результатами исследований, выводами и предложениями; развитие коммуникативных навыков в профессиональной сфере; мотивация студентов и школьников к углублению химических знаний.',
                'state_id' => 2,
                'type_id' => 4,
                'date' => '2025-03-2'
            ]
        ])->each(function ($conference) {
            Conference::create($conference);
        });

        $images = collect([
            ["storage/img/partners/info/1.png", 'Картинка 1'],
            ["storage/img/partners/info/2.png", 'Картинка 2'],
            ["storage/img/partners/info/3.png", 'Картинка 3'],
            ["storage/img/partners/info/4.png", 'Картинка 4'],
            ["storage/img/partners/info/5.png", 'Картинка 5'],
            ["storage/img/partners/info/6.png", 'Картинка 6'],
            ["storage/img/partners/off/1.png", 'Картинка 7'],
            ["storage/img/partners/off/2.jpg", 'Картинка 8'],
            ["storage/img/partners/off/3.jpg", 'Картинка 9'],
            ["storage/img/partners/off/4.jpg", 'Картинка 10'],
            ["storage/img/partners/off/5.png", 'Картинка 11'],
            ["storage/img/partners/off/6.jpg", 'Картинка 12'],
            ["storage/img/partners/off/7.png", 'Картинка 13'],
            ["storage/img/partners/strat/1.png", 'Картинка 14'],
            ["storage/img/partners/strat/2.png", 'Картинка 15'],
            ["storage/img/partners/strat/3.png", 'Картинка 16'],
            ["storage/img/partners/strat/4.png", 'Картинка 17'],
        ])->each(fn($img) => Image::create([
            'default' => true,
            'path' => $img[0],
            'name' => $img[1]
        ]));


        $user = User::factory()->create([
            // 'name' => 'Test User',
            'email' => 'a@a.com',
            'password' => '111111'
        ]);

        $user->roles()->attach(RoleEnum::ADMIN->value);
    }
}
