<?php

namespace App\Services;

use App\Models\Conference;
use App\Models\ConferenceUser;
use App\Models\Document;
use App\Models\User;
use Illuminate\Support\Str;

class ParticipationDraft
{
    /**
     * @return array{reports: array<int, array<string, mixed>>, thesises: array<int, array<string, mixed>>}
     */
    public function get(User $user, Conference $conference): array
    {
        $key = $this->sessionKey($user, $conference);

        if (! session()->has($key)) {
            session()->put($key, $this->fromSavedDocuments($user, $conference));
        }

        /** @var array{reports?: mixed, thesises?: mixed} $draft */
        $draft = session($key, ['reports' => [], 'thesises' => []]);

        return [
            'reports' => is_array($draft['reports'] ?? null) ? array_values($draft['reports']) : [],
            'thesises' => is_array($draft['thesises'] ?? null) ? array_values($draft['thesises']) : [],
        ];
    }

    /**
     * @param  array<string, mixed>  $thesis
     */
    public function addThesis(User $user, Conference $conference, array $thesis): void
    {
        $draft = $this->get($user, $conference);
        $draft['thesises'][] = $this->withKey($thesis);
        $this->store($user, $conference, $draft);
    }

    /**
     * @param  array<string, mixed>  $report
     */
    public function addReport(User $user, Conference $conference, array $report): void
    {
        $draft = $this->get($user, $conference);
        $draft['reports'][] = $this->withKey($report);
        $this->store($user, $conference, $draft);
    }

    public function remove(User $user, Conference $conference, string $collection, string $itemKey): bool
    {
        if (! in_array($collection, ['reports', 'thesises'], true)) {
            return false;
        }

        $draft = $this->get($user, $conference);
        $originalCount = count($draft[$collection]);
        $draft[$collection] = array_values(array_filter(
            $draft[$collection],
            fn (array $item): bool => ($item['key'] ?? null) !== $itemKey
        ));

        if (count($draft[$collection]) === $originalCount) {
            return false;
        }

        $this->store($user, $conference, $draft);

        return true;
    }

    public function reset(User $user, Conference $conference): void
    {
        $this->store($user, $conference, $this->fromSavedDocuments($user, $conference));
    }

    public function clear(User $user, Conference $conference): void
    {
        session()->forget($this->sessionKey($user, $conference));
    }

    /**
     * @return array{reports: array<int, array<string, mixed>>, thesises: array<int, array<string, mixed>>}
     */
    public function submissionPayload(User $user, Conference $conference): array
    {
        $draft = $this->get($user, $conference);

        return [
            'reports' => $this->withoutMeta($draft['reports']),
            'thesises' => $this->withoutMeta($draft['thesises']),
        ];
    }

    public function sessionKey(User $user, Conference $conference): string
    {
        return "participation_draft.{$user->id}.{$conference->id}";
    }

    /**
     * @return array{reports: array<int, array<string, mixed>>, thesises: array<int, array<string, mixed>>}
     */
    public function fromSavedDocuments(User $user, Conference $conference): array
    {
        $participation = ConferenceUser::query()
            ->where('conference_id', $conference->id)
            ->where('user_id', $user->id)
            ->first();

        if (! $participation) {
            return [
                'reports' => [],
                'thesises' => [],
            ];
        }

        return [
            'reports' => $participation->documents()
                ->where('type_id', 1)
                ->get()
                ->map(fn (Document $doc): array => $this->withKey([
                    'id' => $doc->id,
                    'topic' => $doc->topic,
                    'report_type_id' => $doc->report_type_id,
                    'authors' => $doc->authors,
                    'science_guides' => $doc->science_guides ?? [],
                ]))
                ->values()
                ->all(),
            'thesises' => $participation->documents()
                ->where('type_id', 2)
                ->get()
                ->map(fn (Document $doc): array => $this->withKey([
                    'id' => $doc->id,
                    'topic' => $doc->topic,
                    'text' => $doc->text,
                    'literature' => $doc->literature,
                    'authors' => $doc->authors,
                    'science_guides' => $doc->science_guides ?? [],
                ]))
                ->values()
                ->all(),
        ];
    }

    /**
     * @param  array{reports: array<int, array<string, mixed>>, thesises: array<int, array<string, mixed>>}  $draft
     */
    private function store(User $user, Conference $conference, array $draft): void
    {
        session()->put($this->sessionKey($user, $conference), $draft);
    }

    /**
     * @param  array<string, mixed>  $item
     * @return array<string, mixed>
     */
    private function withKey(array $item): array
    {
        $item['key'] = $item['key'] ?? (string) Str::uuid();

        return $item;
    }

    /**
     * @param  array<int, array<string, mixed>>  $items
     * @return array<int, array<string, mixed>>
     */
    private function withoutMeta(array $items): array
    {
        return array_values(array_map(function (array $item): array {
            unset($item['key'], $item['id']);

            return $item;
        }, $items));
    }
}
