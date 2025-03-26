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

        // $participationTypes = collect([
        //     1 => 'Участие',
        //     2 => 'Доклад',
        //     3 => 'Тезизы'
        // ])->each(fn($name, $id) => ParticipationType::create([
        //     'id' => $id,
        //     'name' => $name
        // ]));

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

        $imageCategories = collect([
            'Информационные партнеры',
            'Официальные партнеры',
            'Стратегические партнеры',
            'Другие парнерты',
            'Люди',
            'Другое'
        ])->each(fn($category) => ImageCategory::create(['name' => $category]));

        $images = collect([
            ["img/partners/info/1.png", 'yellmed', 1, 'https://yellmed.ru/'],
            ["img/partners/info/2.png", 'Врачи вместе', 1, 'https://vrachivmeste.ru/'],
            ["img/partners/info/3.png", 'Аэтэрна', 1, 'https://aeterna-ufa.ru/'],
            ["img/partners/info/4.png", 'Научные конференции.рф', 1, 'https://na-konferencii.ru/'],
            ["img/partners/info/5.png", 'ivrach', 1, 'https://www.ivrach.com/'],
            ["img/partners/info/6.png", 'Нацпроект Наука и Университеты', 1, 'https://xn--80aapampemcchfmo7a3c9ehj.xn--p1ai/projects/nauka-i-universitety/'],
            ["img/partners/off/1.png", 'Sun Pharma', 2, 'https://sunpharma.com/russia/'],
            ["img/partners/off/2.jpg", 'Medtronic', 2, 'https://www.medtronic.com/en-us/index.html'],
            ["img/partners/off/3.jpg", 'Abbott', 2, 'https://www.ru.abbott/'],
            ["img/partners/off/4.jpg", 'Европа', 2, 'https://europa-ts.ru/'],
            ["img/partners/off/5.png", 'Мираторг', 2, 'https://miratorg.ru/'],
            ["img/partners/off/6.jpg", 'Фармстандарт', 2, 'https://pharmstd.ru/'],
            ["img/partners/off/7.png", 'Фармтек', 2, 'https://pharmtec.ru/'],
            ["img/partners/strat/1.png", 'Российский союз молодых ученых', 3, 'https://rosmu.ru/'],
            ["img/partners/strat/2.png", 'Администрация Курской Области', 3, 'https://adm2.rkursk.ru/'],
            ["img/partners/strat/3.png", 'Администрация Города Курска', 3, 'https://kursk-r38.gosweb.gosuslugi.ru/'],
            ["img/partners/strat/4.png", 'Союз Курская торгово-промышленная палата', 3, 'https://kursk.tpprf.ru/ru/'],
        ])->each(fn($img) => Image::create([
            'default' => true,
            'path' => $img[0],
            'name' => $img[1],
            'category_id' => $img[2],
            'url' => $img[3]
        ]));


        $user = User::factory()->create([
            // 'name' => 'Test User',
            'email' => 'a@a.com',
            'password' => '111111'
        ]);

        $user->roles()->attach(RoleEnum::ADMIN->value);

        $user1 = User::factory()->create([
            // 'name' => 'Test User',
            'email' => 'b@b.com',
            'password' => '111111'
        ]);
        $user->roles()->attach(RoleEnum::USER->value);
    }
}
