<?php

namespace App\Services;

use App\Models\Conference;
use Carbon\Carbon;
use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class YandexCalendarService
{
    /**
     * Create or update the conference event and store its UID.
     */
    public function push(Conference $conference): void
    {
        $conference->loadMissing(['type', 'proposal']);

        $uid = $this->buildUid($conference);
        $response = $this->client()
            ->withBody($this->buildIcs($conference, $uid), 'text/calendar; charset=utf-8')
            ->put($this->eventUrl($uid));

        if (! in_array($response->status(), [200, 201, 204], true)) {
            throw new RuntimeException("Yandex Calendar push failed: HTTP {$response->status()}");
        }

        $conference->update(['yandex_calendar_uid' => $uid]);
    }

    /**
     * Delete the conference event and clear its UID.
     */
    public function delete(Conference $conference): void
    {
        $uid = $conference->yandex_calendar_uid;

        if ($uid) {
            $response = $this->client()->delete($this->eventUrl($uid));

            if (! in_array($response->status(), [200, 204, 404], true)) {
                throw new RuntimeException("Yandex Calendar delete failed: HTTP {$response->status()}");
            }
        }

        $conference->update(['yandex_calendar_uid' => null]);
    }

    public function buildUid(Conference $conference): string
    {
        $host = parse_url((string) config('app.url'), PHP_URL_HOST) ?: 'localhost';

        return "conf-{$conference->id}@{$host}";
    }

    public function buildIcs(Conference $conference, string $uid): string
    {
        $payload = $conference->proposal?->payload ?? [];

        $start = Carbon::parse($payload['date'] ?? $conference->date);
        $lastDay = Carbon::parse($payload['endDate'] ?? $payload['date'] ?? $conference->date);
        $end = $lastDay->copy()->addDay();

        $link = route('conferences.show', $conference);
        $description = trim((string) $conference->description);
        $description .= ($description === '' ? '' : "\n\n").'Ссылка на сайт Конференций КГМУ: '.$link;

        $lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//'.config('app.name').'//Conferences//EN',
            'BEGIN:VEVENT',
            'UID:'.$uid,
            'DTSTAMP:'.now()->utc()->format('Ymd\THis\Z'),
            'DTSTART;VALUE=DATE:'.$start->format('Ymd'),
            'DTEND;VALUE=DATE:'.$end->format('Ymd'),
            'SUMMARY:'.$this->escape((string) $conference->name),
            'DESCRIPTION:'.$this->escape($description),
        ];

        if (! empty($payload['organization'])) {
            $lines[] = 'LOCATION:'.$this->escape((string) $payload['organization']);
        }

        if ($conference->type) {
            $lines[] = 'CATEGORIES:'.$this->escape($conference->type->name);
        }

        $lines[] = 'URL:'.$link;
        $lines[] = 'END:VEVENT';
        $lines[] = 'END:VCALENDAR';

        return implode("\r\n", $lines)."\r\n";
    }

    private function escape(string $value): string
    {
        return str_replace(
            ['\\', ';', ',', "\r\n", "\n", "\r"],
            ['\\\\', '\;', '\,', '\n', '\n', '\n'],
            $value
        );
    }

    private function eventUrl(string $uid): string
    {
        $base = rtrim((string) config('services.yandex_calendar.caldav_url'), '/');
        $email = rawurlencode((string) config('services.yandex_calendar.email'));
        $path = config('services.yandex_calendar.calendar_path');

        return "{$base}/calendars/{$email}/{$path}/{$uid}.ics";
    }

    private function client(): PendingRequest
    {
        return Http::withBasicAuth(
            (string) config('services.yandex_calendar.email'),
            (string) config('services.yandex_calendar.app_password'),
        );
    }
}
