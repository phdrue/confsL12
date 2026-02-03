<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Подтверждение регистрации</title>
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
        .conference-link {
            color: #0066cc;
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <p>Здравствуйте!</p>

    <p>Вы успешно зарегистрировались в качестве участника (слушателя) конференции «{{ $conference->name }}». В случае явки на конференцию / онлайн-подключения к секции, Вы получите именной сертификат участника.</p>

    @php
        $reports = $participation->documents->where('type_id', 1);
        $thesises = $participation->documents->where('type_id', 2);
    @endphp

    @if($reports->count() > 0 || $thesises->count() > 0)
        <p>А также приложили следующие файлы (документы):</p>
        <p>В случае выявления ошибки поданную заявку можно отредактировать на информационной странице конференции.</p>

        @if($reports->count() > 0)
            <h3>Доклады:</h3>
            <table>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Тема</th>
                        <th>Вид доклада</th>
                        <th>Авторы</th>
                        <th>Научные руководители</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($reports as $index => $report)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>{{ $report->topic }}</td>
                            <td>{{ $report->reportType->name ?? 'Не указано' }}</td>
                            <td>
                                @if(is_array($report->authors) && count($report->authors) > 0)
                                    @foreach($report->authors as $author)
                                        {{ $author['name'] ?? '' }}@if(!$loop->last), @endif
                                    @endforeach
                                @else
                                    Не указано
                                @endif
                            </td>
                            <td>
                                @if(is_array($report->science_guides) && count($report->science_guides) > 0)
                                    @foreach($report->science_guides as $guide)
                                        {{ $guide['name'] ?? '' }}@if(!$loop->last), @endif
                                    @endforeach
                                @else
                                    Не указано
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif

        @if($thesises->count() > 0)
            <h3>Тезисы:</h3>
            <table>
                <thead>
                    <tr>
                        <th>№</th>
                        <th>Тема</th>
                        <th>Тип</th>
                        <th>Авторы</th>
                        <th>Научные руководители</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($thesises as $index => $thesis)
                        <tr>
                            <td>{{ $index + 1 }}</td>
                            <td>{{ $thesis->topic }}</td>
                            <td>Тезисы</td>
                            <td>
                                @if(is_array($thesis->authors) && count($thesis->authors) > 0)
                                    @foreach($thesis->authors as $author)
                                        {{ $author['name'] ?? '' }}@if(!$loop->last), @endif
                                    @endforeach
                                @else
                                    Не указано
                                @endif
                            </td>
                            <td>
                                @if(is_array($thesis->science_guides) && count($thesis->science_guides) > 0)
                                    @foreach($thesis->science_guides as $guide)
                                        {{ $guide['name'] ?? '' }}@if(!$loop->last), @endif
                                    @endforeach
                                @else
                                    Не указано
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    @endif

    <p>Программа конференции, сборник материалов и именные сертификаты будут доступны на информационной странице конференции <a href="{{ route('conferences.show', $conference, absolute: true) }}" class="conference-link">{{ route('conferences.show', $conference, absolute: true) }}</a>.</p>

    <p>С уважением,<br>Конференции КГМУ</p>
</body>
</html>
