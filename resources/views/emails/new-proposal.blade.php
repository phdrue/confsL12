<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Новое предложение конференции</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #333;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
            border: 1px solid #333;
        }
        td {
            border: 1px solid #333;
        }
    </style>
</head>
<body>
    <p>Здравствуйте!</p>

    <p>Поступило новое предложение по проведению конференции от пользователя
        @if($proposal->user)
            {{ $proposal->user->last_name }} {{ $proposal->user->first_name }} {{ $proposal->user->second_name }}
            ({{ $proposal->user->email }})
        @else
            (пользователь не найден)
        @endif
    </p>

    @php
        $payload = $proposal->payload ?? [];
    @endphp

    <h3>Основные данные предложения</h3>
    <table>
        <tbody>
            <tr>
                <th>Название</th>
                <td>{{ $payload['name'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Краткое название</th>
                <td>{{ $payload['shortName'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Уровень</th>
                <td>{{ $payload['level'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Форма проведения</th>
                <td>{{ $payload['form'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Тип</th>
                <td>{{ $payload['type'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Язык</th>
                <td>{{ $payload['lang'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Дата начала</th>
                <td>{{ $payload['date'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Дата окончания</th>
                <td>{{ $payload['endDate'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Место проведения</th>
                <td>{{ $payload['place'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Подразделение</th>
                <td>{{ $payload['department'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Организация</th>
                <td>{{ $payload['organization'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Другая организация</th>
                <td>{{ $payload['organizationOther'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Ожидаемое количество участников</th>
                <td>{{ $payload['participationsTotal'] ?? '' }}</td>
            </tr>
            <tr>
                <th>В том числе зарубежных участников</th>
                <td>{{ $payload['participationsForeign'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Целевая аудитория</th>
                <td>
                    @if(!empty($payload['audiences']) && is_array($payload['audiences']))
                        {{ implode(', ', $payload['audiences']) }}
                    @endif
                </td>
            </tr>
            <tr>
                <th>Тематика</th>
                <td>{{ $payload['topics'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Бюджет</th>
                <td>{{ $payload['budget'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Источник финансирования</th>
                <td>{{ $payload['budgetSource'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Охват очно</th>
                <td>{{ $payload['coverageInPerson'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Охват онлайн</th>
                <td>{{ $payload['coverageOnline'] ?? '' }}</td>
            </tr>
            <tr>
                <th>Охват по профилю</th>
                <td>{{ $payload['coverageProfession'] ?? '' }}</td>
            </tr>
        </tbody>
    </table>

    <p>Просмотреть и обработать предложение можно в административном интерфейсе системы.</p>

    <p>С уважением,<br>Конференции КГМУ</p>
</body>
</html>

