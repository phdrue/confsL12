<?php

namespace App\Services;

use App\Http\Requests\ConferenceParticipateRequest;
use App\Mail\ParticipationConfirmationMail;
use App\Models\Conference;
use App\Models\ConferenceUser;
use App\Models\Document;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class ConferenceParticipationService
{
    public function save(ConferenceParticipateRequest $request, Conference $conference): void
    {
        $participationId = null;

        DB::transaction(function () use ($request, $conference, &$participationId): void {
            $participation = ConferenceUser::query()
                ->where('conference_id', $conference->id)
                ->where('user_id', Auth::id())
                ->first();

            if (! $participation) {
                $participation = ConferenceUser::create([
                    'conference_id' => $conference->id,
                    'user_id' => Auth::id(),
                ]);
            }

            $participationId = $participation->id;

            if ($conference->allow_report) {
                Document::query()
                    ->where('conference_user_id', $participationId)
                    ->where('type_id', 1)
                    ->delete();

                $reports = $request->validated('reports');
                if ($reports && ! empty($reports)) {
                    collect($reports)->each(function ($report) use ($participationId): void {
                        Document::create([
                            'conference_user_id' => $participationId,
                            'type_id' => 1,
                            'report_type_id' => $report['report_type_id'],
                            'topic' => $report['topic'],
                            'authors' => $report['authors'],
                            'science_guides' => $report['science_guides'] ?? [],
                        ]);
                    });
                }
            }

            if ($conference->allow_thesis) {
                Document::query()
                    ->where('conference_user_id', $participationId)
                    ->where('type_id', 2)
                    ->delete();

                $thesises = $request->validated('thesises');
                if ($thesises && ! empty($thesises)) {
                    collect($thesises)->each(function ($thesis) use ($participationId): void {
                        Document::create([
                            'conference_user_id' => $participationId,
                            'type_id' => 2,
                            'topic' => $thesis['topic'],
                            'text' => $thesis['text'],
                            'literature' => $thesis['literature'],
                            'authors' => $thesis['authors'],
                            'science_guides' => $thesis['science_guides'] ?? [],
                        ]);
                    });
                }
            }
        });

        if ($participationId) {
            $participation = ConferenceUser::with(['documents.reportType'])->findOrFail($participationId);

            Mail::to(Auth::user())->send(new ParticipationConfirmationMail(
                Auth::user(),
                $conference,
                $participation,
            ));
        }
    }
}
