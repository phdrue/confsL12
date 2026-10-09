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
     * Build a read-only UI prefill from saved participation documents.
     *
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
     * @param  array<string, mixed>  $item
     * @return array<string, mixed>
     */
    private function withKey(array $item): array
    {
        $item['key'] = $item['key'] ?? (string) Str::uuid();

        return $item;
    }
}
