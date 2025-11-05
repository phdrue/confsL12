<?php

namespace Database\Seeders;

use App\Models\User;
use App\Enums\Role as RoleEnum;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // $user->roles()->attach(RoleEnum::RESPONSIBLE->value);
        $users = [
            [
                'first_name' => 'Артём',
                'second_name' => 'Валерьевич',
                'last_name' => 'Борщев',
                'email' => 'borshchevav@kursksmu.net',
            ],
            [
                'first_name' => 'Бинти',
                'second_name' => 'Жамал ПО',
                'last_name' => 'Омашарифа',
                'email' => 'omasharifabj@kursksmu.net',
            ],
            [            
                'first_name' => 'Владимир',
                'second_name' => 'Васильевич',
                'last_name' => 'Харченко',
                'email' => 'kharchenkovv@kursksmu.net',
            ],
            [
                'first_name' => 'Полина',
                'second_name' => 'Денисовна',
                'last_name' => 'Кондакова',
                'email' => 'kondakovapd@kursksmu.net',
            ],
            [
                'first_name' => 'Павел',
                'second_name' => 'Адольфович',
                'last_name' => 'Ерёмин',
                'email' => 'ereminpa@kursksmu.net',
            ],
            [
                'first_name' => 'Мария',
                'second_name' => 'Андреевна',
                'last_name' => 'Солодилова',
                'email' => 'solodilovama@kursksmu.net',
            ],
            [
                'first_name' => 'Людмила',
                'second_name' => 'Александровна',
                'last_name' => 'Бабкина',
                'email' => 'babkinala@kursksmu.net',
            ],
            [
                'first_name' => 'Ксения',
                'second_name' => 'Викторовна',
                'last_name' => 'Завидовская',
                'email' => 'zavidovskajakv@kursksmu.net',
            ],
            [
                'first_name' => 'Ирина',
                'second_name' => 'Юрьевна',
                'last_name' => 'Леонидова',
                'email' => 'leonidovaiy@kursksmu.net',
            ],
            [
                'first_name' => 'Светлана',
                'second_name' => 'Анатольевна',
                'last_name' => 'Долгарева',
                'email' => 'dolgarevasa@kursksmu.net',
            ],
            [
                'first_name' => 'Ольга',
                'second_name' => 'Николаевна',
                'last_name' => 'Бушмина',
                'email' => 'bushminaon@kursksmu.net',
            ],
            [
                'first_name' => 'Анна',
                'second_name' => 'Александровна',
                'last_name' => 'Чуланова',
                'email' => 'chulanovaaa@kursksmu.net',
            ],
            [
                'first_name' => 'Вячеслав',
                'second_name' => 'Игоревич',
                'last_name' => 'Понкратов',
                'email' => 'ponkratovvi@kursksmu.net',
            ],
            [
                'first_name' => 'Александр',
                'second_name' => 'Владимирович',
                'last_name' => 'Харченко',
                'email' => 'kharchenkoav@kursksmu.net',
            ],
            [
                'first_name' => 'Юлия',
                'second_name' => 'Александровна',
                'last_name' => 'Жиляева',
                'email' => 'zhilyaevayua@kursksmu.net',
            ],
            [
                'first_name' => 'Александр',
                'second_name' => 'Александрович',
                'last_name' => 'Степченко',
                'email' => 'stepchenkoaa@kursksmu.net',
            ],
            [
                'first_name' => 'Андрей',
                'second_name' => 'Александрович',
                'last_name' => 'Калугин',
                'email' => 'kaluginaa@kursksmu.net',
            ],
            [
                'first_name' => 'Александр',
                'second_name' => 'Юрьевич',
                'last_name' => 'Черников',
                'email' => 'chernikovay@kursksmu.net',
            ],
            [
                'first_name' => 'Сергей',
                'second_name' => 'Юрьевич',
                'last_name' => 'Миронов',
                'email' => 'mironovsyu@kursksmu.net',
            ],
            [
                'first_name' => 'Лариса',
                'second_name' => 'Вячеславовна',
                'last_name' => 'Силина',
                'email' => 'silinalv@kursksmu.net',
            ],
            [
                'first_name' => 'Татьяна',
                'second_name' => 'Павловна',
                'last_name' => 'Исаенко',
                'email' => 'isaenkotp@kursksmu.net',
            ],
            [
                'first_name' => 'Дмитрий',
                'second_name' => 'Андреевич',
                'last_name' => 'Северинов',
                'email' => 'severinovda@kursksmu.net',
            ],
            [
                'first_name' => 'Ольга',
                'second_name' => 'Геннадьевна',
                'last_name' => 'Лисеенко',
                'email' => 'liseenkoog@kursksmu.net',
            ],
            [
                'first_name' => 'Мария',
                'second_name' => 'Игоревна',
                'last_name' => 'Статина',
                'email' => 'statinamv@kursksmu.net',
            ],
            [
                'first_name' => 'Олеся',
                'second_name' => 'Владимировна',
                'last_name' => 'Раздорская',
                'email' => 'razdorskajaov@kursksmu.net',
            ],
            [
                'first_name' => 'Виктория',
                'second_name' => 'Андреевна',
                'last_name' => 'Евдокимова',
                'email' => 'evdokimovava@kursksmu.net',
            ],
            [
                'first_name' => 'Виктория',
                'second_name' => 'Валентиновна',
                'last_name' => 'Киселева',
                'email' => 'kiselevavv@kursksmu.net',
            ],
            [
                'first_name' => 'Людмила',
                'second_name' => 'Викторовна',
                'last_name' => 'Титарева',
                'email' => 'titarevalv@kursksmu.net',
            ],
            [
                'first_name' => 'Светлана',
                'second_name' => 'Михайловна',
                'last_name' => 'Юдина',
                'email' => 'udinasm@kursksmu.net',
            ],
            [
                'first_name' => 'Инна',
                'second_name' => 'Анатольевна',
                'last_name' => 'Иванова',
                'email' => 'ivanovaia@kursksmu.net',
            ],
            [
                'first_name' => 'Арсен',
                'second_name' => 'Александрович',
                'last_name' => 'Корнилов',
                'email' => 'kornilovaa@kursksmu.net',
            ],
            [
                'first_name' => 'Инна',
                'second_name' => 'Леонидовна',
                'last_name' => 'Польшакова',
                'email' => 'polshakovail@kursksmu.net',
            ],
            [
                'first_name' => 'Ольга',
                'second_name' => 'Михайловна',
                'last_name' => 'Новикова',
                'email' => 'novikovaom@kursksmu.net',
            ],
            [
                'first_name' => 'Наталья',
                'second_name' => 'Сергеевна',
                'last_name' => 'Воротынцева',
                'email' => 'vorotyncevans@kursksmu.net',
            ],
            [
                'first_name' => 'Елена',
                'second_name' => 'Анатольевна',
                'last_name' => 'Подольская',
                'email' => 'podolskayaea@kursksmu.net',
            ],
            [
                'first_name' => 'Максим',
                'second_name' => 'Юрьевич',
                'last_name' => 'Зозуля',
                'email' => 'zozulamy@kursksmu.net',
            ],
            [
                'first_name' => 'Юрий',
                'second_name' => 'Михайлович',
                'last_name' => 'Мясоедов',
                'email' => 'myasoedovym@kursksmu.net',
            ],
            [
                'first_name' => 'Екатерина',
                'second_name' => 'Сергеевна',
                'last_name' => 'Ворсина',
                'email' => 'vorsinaes@kursksmu.net',
            ],
            [
                'first_name' => 'Наталия',
                'second_name' => 'Юрьевна',
                'last_name' => 'Медведенко',
                'email' => 'medvedenkony@kursksmu.net',
            ],
            [
                'first_name' => 'Сергей',
                'second_name' => 'Дмитриевич',
                'last_name' => 'Кононенко',
                'email' => 'kononenkosd@kursksmu.net',
            ],
            [
                'first_name' => 'Элина',
                'second_name' => 'Тимуровна',
                'last_name' => 'Дюканова',
                'email' => 'kobilovaet@kursksmu.net',
            ],
            [
                'first_name' => 'Елена',
                'second_name' => 'Вячеславовна',
                'last_name' => 'Будко',
                'email' => 'budkoev@kursksmu.net',
            ],
            [
                'first_name' => 'Алексей',
                'second_name' => 'Юрьевич',
                'last_name' => 'Малыхин',
                'email' => 'malykhinau@kursksmu.net',
            ],
            [
                'first_name' => 'Ирина',
                'second_name' => 'Александровна',
                'last_name' => 'Сафонова',
                'email' => 'safonovaia@kursksmu.net',
            ],
            [
                'first_name' => 'Николай',
                'second_name' => 'Валерьевич',
                'last_name' => 'Смирнов',
                'email' => 'smirnovnv@kursksmu.net',
            ],
            [
                'first_name' => 'Наталья',
                'second_name' => 'Юрьевна',
                'last_name' => 'Есенкова',
                'email' => 'esenkovanu@kursksmu.net',
            ],
            [
                'first_name' => 'Анжелика',
                'second_name' => 'Юрьевна',
                'last_name' => 'Орлова',
                'email' => 'orlovaau@kursksmu.net',
            ],
            [
                'first_name' => 'Тамара',
                'second_name' => 'Викторовна',
                'last_name' => 'Мутова',
                'email' => 'mutovatv@kursksmu.net',
            ],
            [
                'first_name' => 'Михаил',
                'second_name' => 'Борисович',
                'last_name' => 'Суковатых',
                'email' => 'sukovatykhmb@kursksmu.net',
            ],
            [
                'first_name' => 'Олег',
                'second_name' => 'Евгеньевич',
                'last_name' => 'Чуйков',
                'email' => 'chuikovoe@kursksmu.net',
            ],
            [
                'first_name' => 'Рада',
                'second_name' => 'Олеговна',
                'last_name' => 'Грачева',
                'email' => 'kopcevapo@kursksmu.net',
            ],
            [
                'first_name' => 'Виктория',
                'second_name' => 'Александровна',
                'last_name' => 'Лопухова',
                'email' => 'lopukhovava@kursksmu.net',
            ],
            [
                'first_name' => 'Дина',
                'second_name' => 'Павловна',
                'last_name' => 'Солодухина',
                'email' => 'solodukhinadp@kursksmu.net',
            ],
            [
                'first_name' => 'Елена',
                'second_name' => 'Николаевна',
                'last_name' => 'Колесникова',
                'email' => 'lenasideleva@yandex.ru',
            ],
            [
                'first_name' => 'Арсен',
                'second_name' => 'Юрьевич',
                'last_name' => 'Григорьян',
                'email' => 'grigorjanau@kursksmu.net',
            ],
            [
                'first_name' => 'Артем',
                'second_name' => 'Александрович',
                'last_name' => 'Денисов',
                'email' => 'denisovaa@kursksmu.net',
            ],
            [
                'first_name' => 'Светлана',
                'second_name' => 'Валерьевна',
                'last_name' => 'Быстрова',
                'email' => 'bystrovasv@kursksmu.net',
            ],
            [
                'first_name' => 'Оксана',
                'second_name' => 'Юрьевна',
                'last_name' => 'Мезенцева',
                'email' => 'mezentsevaou@kursksmu.net',
            ],
            [
                'first_name' => 'Александр',
                'second_name' => 'Игоревич',
                'last_name' => 'Березников',
                'email' => 'bereznikovai@kursksmu.net',
            ],
            [
                'first_name' => 'Евгения',
                'second_name' => 'Александровна',
                'last_name' => 'Есипова',
                'email' => 'esipovaea@kursksmu.net',
            ],
            [
                'first_name' => 'Игорь',
                'second_name' => 'Иванович',
                'last_name' => 'Бобынцев',
                'email' => 'bobyncevii@kursksmu.net',
            ],
            [
                'first_name' => 'Антон',
                'second_name' => 'Олегович',
                'last_name' => 'Ворвуль',
                'email' => 'vorvulao@kursksmu.net',
            ],
            [
                'first_name' => 'Виктория',
                'second_name' => 'Николаевна',
                'last_name' => 'Коробова',
                'email' => 'korobovavn@kursksmu.net',
            ],
            [
                'first_name' => 'Алина',
                'second_name' => 'Геннадьевна',
                'last_name' => 'Архипова',
                'email' => 'arkhipovaag@kursksmu.net',
            ],
            [
                'first_name' => 'Дмитрий',
                'second_name' => 'Игоревич',
                'last_name' => 'Фомин',
                'email' => 'fomindi@kursksmu.net',
            ],
            [
                'first_name' => 'Светлана',
                'second_name' => 'Григорьевна',
                'last_name' => 'Дорофеева',
                'email' => 'dorofeevasg@kursksmu.net',
            ],
            [
                'first_name' => 'Анна',
                'second_name' => 'Ильинична',
                'last_name' => 'Зданович',
                'email' => 'zdanovichau@kursksmu.net',
            ],
            [
                'first_name' => 'Юлия',
                'second_name' => 'Владимировна',
                'last_name' => 'Богушевская',
                'email' => 'bogushevskajauv@kursksmu.net',
            ],
            [
                'first_name' => 'Елена',
                'second_name' => 'Викторовна',
                'last_name' => 'Феоктистова',
                'email' => 'feoctistovaev@kursksmu.net',
            ],
            [
                'first_name' => 'Алеся',
                'second_name' => 'Анатольевна',
                'last_name' => 'Кузнецова',
                'email' => 'kuznecovaaa@kursksmu.net',
            ],
            [
                'first_name' => 'Олеся',
                'second_name' => 'Сергеевна',
                'last_name' => 'Колчина',
                'email' => 'kolchinaos@kursksmu.net',
            ],
            [
                'first_name' => 'Нилуфер',
                'second_name' => 'Мажид Кизи',
                'last_name' => 'Хахутадзе',
                'email' => 'hahutadzenm@kursksmu.net',
            ],
            [
                'first_name' => 'Екатерина',
                'second_name' => 'Юрьевна',
                'last_name' => 'Фетисова',
                'email' => 'fetisovaey@kursksmu.net',
            ],
            [
                'first_name' => 'Наталья',
                'second_name' => 'Николаевна',
                'last_name' => 'Самчик',
                'email' => 'samchiknn@kursksmu.net',
            ],
            [
                'first_name' => 'Екатерина',
                'second_name' => 'Владимировна',
                'last_name' => 'Черных',
                'email' => 'chernyhev@kursksmu.net',
            ],
            [
                'first_name' => 'Людмила',
                'second_name' => 'Николаевна',
                'last_name' => 'Шульгина',
                'email' => 'shulginaln@kursksmu.net',
            ],
            [
                'first_name' => 'Екатерина',
                'second_name' => 'Владимировна',
                'last_name' => 'Ерофеева',
                'email' => 'erofeevaev@kursksmu.net',
            ],
            [
                'first_name' => 'Вячеслав',
                'second_name' => 'Петрович',
                'last_name' => 'Кузьмин',
                'email' => 'kuzminvp@kursksmu.net',
            ],
            [
                'first_name' => 'Роман',
                'second_name' => 'Владимирович',
                'last_name' => 'Ананьев',
                'email' => 'ananevrv@kursksmu.net',
            ],
            [
                'first_name' => 'Вадим',
                'second_name' => 'Сергеевич',
                'last_name' => 'Сериков',
                'email' => 'sericovvs@kursksmu.net',
            ],
            [
                'first_name' => 'Сергей',
                'second_name' => 'Сергеевич',
                'last_name' => 'Быховцев',
                'email' => 'bykhovtsevss@kursksmu.net',
            ],
            [
                'first_name' => 'Александр',
                'second_name' => 'Станиславович',
                'last_name' => 'Рапута',
                'email' => 'raputaas@kursksmu.net',
            ],
            [
                'first_name' => 'Александр',
                'second_name' => 'Афанасьевич',
                'last_name' => 'Теньков',
                'email' => 'tenkovaa@kursksmu.net',
            ],
            [
                'first_name' => 'Зоя',
                'second_name' => 'Михайловна',
                'last_name' => 'Лунева',
                'email' => 'lunevazm@kursksmu.net',
            ],
            [
                'first_name' => 'Антон',
                'second_name' => 'Александрович',
                'last_name' => 'Кривохатько',
                'email' => 'krivaxatikoaa@kursksmu.net',
            ],
            [
                'first_name' => 'Сергей',
                'second_name' => 'Сергеевич',
                'last_name' => 'Гречихин',
                'email' => 'grechihinss@kursksmu.net',
            ],
            [
                'first_name' => 'Александр',
                'second_name' => 'Юрьевич',
                'last_name' => 'Лебедев',
                'email' => 'lebedevau@kursksmu.net',
            ],
            [
                'first_name' => 'Сергей',
                'second_name' => 'Николаевич',
                'last_name' => 'Тихоненков',
                'email' => 'tikhonenkovsn@kursksmu.net',
            ],
            [
                'first_name' => 'Денсинг',
                'second_name' => 'Самуэл Радж',
                'last_name' => 'Раджкумар',
                'email' => 'rajkumardsr@kursksmu.net',
            ],
            [
                'first_name' => 'Олег',
                'second_name' => 'Иванович',
                'last_name' => 'Братчиков',
                'email' => 'bratchikovoi@kursksmu.net',
            ],
            [
                'first_name' => 'Максим',
                'second_name' => 'Михайлович',
                'last_name' => 'Кондрашов',
                'email' => 'kondrashovmm@kursksmu.net',
            ],
            [
                'first_name' => 'Юрий',
                'second_name' => 'Анатольевич',
                'last_name' => 'Сухомлинов',
                'email' => 'sukhomlinovua@kursksmu.net',
            ],
            [
                'first_name' => 'Николай',
                'second_name' => 'Васильевич',
                'last_name' => 'Костебелов',
                'email' => 'kostebelovnv@kursksmu.net',
            ],
            [
                'first_name' => 'Оксана',
                'second_name' => 'Олеговна',
                'last_name' => 'Курилова',
                'email' => 'kurilovaoo@kursksmu.net',
            ],
            [
                'first_name' => 'Василий',
                'second_name' => 'Юрьевич',
                'last_name' => 'Цепелев',
                'email' => 'cepelevvyu@kursksmu.net',
            ],
            [
                'first_name' => 'Ирина',
                'second_name' => 'Александровна',
                'last_name' => 'Татаренкова',
                'email' => 'tatarenkovaia@kursksmu.net',
            ],
            [
                'first_name' => 'Владимир',
                'second_name' => 'Камбулатович',
                'last_name' => 'Шорманов',
                'email' => 'shormanovvk@kursksmu.net',
            ],
            [
                'first_name' => 'Александр',
                'second_name' => 'Владимирович',
                'last_name' => 'Кукурека',
                'email' => 'kukurekaav@kursksmu.net',
            ],
            [
                'first_name' => 'Анна',
                'second_name' => 'Викторовна',
                'last_name' => 'Рышкова',
                'email' => 'ryshkovaav@kursksmu.net',
            ],
            [
                'first_name' => 'Татьяна',
                'second_name' => 'Валерьевна',
                'last_name' => 'Недуруева',
                'email' => 'neduruevatv@kursksmu.net',
            ],
            [
                'first_name' => 'Инга',
                'second_name' => 'Анатольевна',
                'last_name' => 'Авилова',
                'email' => 'avilovaia@kursksmu.net',
            ],
            [
                'first_name' => 'Жанна',
                'second_name' => 'Геннадьевна',
                'last_name' => 'Симонова',
                'email' => 'simonovajg@kursksmu.net',
            ],
            [
                'first_name' => 'Евгений',
                'second_name' => 'Николаевич',
                'last_name' => 'Немеров',
                'email' => 'nemeroven@kursksmu.net',
            ],
            [
                'first_name' => 'Алексей',
                'second_name' => 'Геннадьевич',
                'last_name' => 'Терехов',
                'email' => 'terekhovag@kursksmu.net',
            ],
            [
                'first_name' => 'Александр',
                'second_name' => 'Викторович',
                'last_name' => 'Горбулич',
                'email' => 'gorbulichav@kursksmu.net',
            ],
            [
                'first_name' => 'Леван',
                'second_name' => 'Лорикович',
                'last_name' => 'Квачахия',
                'email' => 'cvachaxiall2@kursksmu.net',
            ],
            [
                'first_name' => 'Елена',
                'second_name' => 'Анатольевна',
                'last_name' => 'Бобровская',
                'email' => 'bobrovskajaea@kursksmu.net',
            ],
            [
                'first_name' => 'Елена',
                'second_name' => 'Геннадьевна',
                'last_name' => 'Шишкова',
                'email' => 'shishkovaeg@kursksmu.net',
            ],
            [
                'first_name' => 'Елена',
                'second_name' => 'Викторовна',
                'last_name' => 'Фелькер',
                'email' => 'felkerev@kursksmu.net',
            ],
            [
                'first_name' => 'Андрей',
                'second_name' => 'Валентинович',
                'last_name' => 'Щенин',
                'email' => 'shcheninav@kursksmu.net',
            ],
            [
                'first_name' => 'Ольга',
                'second_name' => 'Владимировна',
                'last_name' => 'Власова',
                'email' => 'vlasovaov@kursksmu.net',
            ],
            [
                'first_name' => 'Надежда',
                'second_name' => 'Сергеевна',
                'last_name' => 'Бушина',
                'email' => 'bushinans@kursksmu.net',
            ],
            [
                'first_name' => 'Наталья',
                'second_name' => 'Станиславовна',
                'last_name' => 'Андреева',
                'email' => 'andreevans@kursksmu.net',
            ],
            [
                'first_name' => 'Жанна',
                'second_name' => 'Владимировна',
                'last_name' => 'Савельева',
                'email' => 'savelevazhv@kursksmu.net',
            ],
            [
                'first_name' => 'Лилия',
                'second_name' => 'Валерьевна',
                'last_name' => 'Сапунова',
                'email' => 'sapunovalv@kursksmu.net',
            ],
            [
                'first_name' => 'Вера',
                'second_name' => 'Васильевна',
                'last_name' => 'Рындина',
                'email' => 'ryndinavv@kursksmu.net',
            ],
            [
                'first_name' => 'Любовь',
                'second_name' => 'Михайловна',
                'last_name' => 'Напреенко',
                'email' => 'napreenkolm2@kursksmu.net',
            ],
            [
                'first_name' => 'Виктория',
                'second_name' => 'Александровна',
                'last_name' => 'Солянина',
                'email' => 'soljaninava@kursksmu.net',
            ],
            [
                'first_name' => 'Алексей',
                'second_name' => 'Иванович',
                'last_name' => 'Рассказенков',
                'email' => 'rasskazenkovai@kursksmu.net',
            ],
            [
                'first_name' => 'Вадим',
                'second_name' => 'Вадимович',
                'last_name' => 'Цымбалюк',
                'email' => 'tsymbalyukvv@kursksmu.net',
            ],
            [
                'first_name' => 'Елизавета',
                'second_name' => 'Андреевна',
                'last_name' => 'Ильина',
                'email' => 'ilyinaea@kursksmu.net',
            ],
            [
                'first_name' => 'Екатерина',
                'second_name' => 'Сергеевна',
                'last_name' => 'Мишина',
                'email' => 'mishinaes@kursksmu.net',
            ],
            [
                'first_name' => 'Ольга',
                'second_name' => 'Вадимовна',
                'last_name' => 'Чигир',
                'email' => 'pravednikovaov@kursksmu.net',
            ],
        ];

        // Deduplicate by email
        $uniqueUsers = [];
        $seenEmails = [];
        
        foreach ($users as $user) {
            $email = strtolower(trim($user['email']));
            if (!in_array($email, $seenEmails)) {
                $seenEmails[] = $email;
                $uniqueUsers[] = $user;
            }
        }

        // Prepare users for bulk insert with required fields
        $now = now();
        $usersToInsert = array_map(function ($userData) use ($now) {
            return array_merge($userData, [
                'password' => '111111',
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }, $uniqueUsers);

        // Bulk insert all users in a single query
        User::insert($usersToInsert);

        // Get all inserted user IDs by email for role attachment
        $emails = array_column($uniqueUsers, 'email');
        $insertedUsers = User::whereIn('email', $emails)->get(['id', 'email']);

        // Prepare role_user pivot table data for bulk insert
        $roleUserData = [];
        $roleId = RoleEnum::RESPONSIBLE->value;
        $roleNow = now();

        foreach ($insertedUsers as $user) {
            $roleUserData[] = [
                'user_id' => $user->id,
                'role_id' => $roleId,
                'created_at' => $roleNow,
                'updated_at' => $roleNow,
            ];
        }

        // Bulk insert role assignments in a single query
        if (!empty($roleUserData)) {
            DB::table('role_user')->insert($roleUserData);
        }

        // Create the special admin user
        // $user = User::factory()->create([
        //     'email' => 'goncharovas@kursksmu.net',
        //     'first_name' => 'Алексей',
        //     'last_name' => 'Гончаров',
        //     'second_name' => 'Сергеевич',
        //     'password' => '111111',
        // ]);
    }
}
