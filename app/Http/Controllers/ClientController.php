<?php

namespace App\Http\Controllers;

use App\Enums\ConferenceStateEnum;
use App\Http\Requests\ConferenceParticipateRequest;
use App\Http\Requests\CreateDocumentRequest;
use App\Http\Requests\SubmitDocumentRequest;
use App\Models\Conference;
use App\Models\ConferenceUser;
use App\Models\Country;
use App\Models\Document;
use App\Models\ReportType;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function landing()
    {
        return Inertia::render('client/landing', [
            'conferences' => Conference::query()
                ->where('front_page', true)
                ->where('state_id', ConferenceStateEnum::ACTIVE)
                ->orderBy('date', 'asc')
                ->limit(4)
                ->get()
        ]);
    }

    public function contacts()
    {
        return Inertia::render('client/contacts');
    }

    public function subscribe()
    {
        return Inertia::render('client/subscribe');
    }

    public function conferences()
    {
        return Inertia::render('client/conferences/index', [
            'conferences' => Conference::query()
                ->whereIn('state_id', [ConferenceStateEnum::ACTIVE, ConferenceStateEnum::ARCHIVE])
                ->orderBy('date', 'asc')
                ->get()
        ]);
    }

    public function conference(Conference $conference)
    {
        if ($conference->state_id === ConferenceStateEnum::DRAFT->value) {
            abort(404, 'Мероприятие не найдено');
        }

        return Inertia::render('client/conferences/show', [
            'conference' => $conference,
            'blocks' => $conference->blocks()->orderBy('position')->get(),
            'countries' => Country::select('id', 'name')->get(),
            'reportTypes' => ReportType::select('id', 'name')->get(),
        ]);
    }

    public function participate(ConferenceParticipateRequest $request, Conference $conference)
    {
        // dd($request->validated());
        DB::transaction(function () use ($request, $conference) {
            $id = ConferenceUser::create([
                'conference_id' => $conference->id,
                'user_id' => auth()->id(),
            ])->id;

            // dd($request->validated('reports'));

            if ($request->validated('reports')) {
                collect($request->validated('reports'))->each(function ($report) use ($id) {
                    Document::create([
                        'conference_user_id' => $id,
                        'type_id' => 1,
                        'report_type_id' => $report['report_type_id'],
                        'topic' => $report['topic'],
                        'authors' => $report['authors'],
                    ]);
                });
            }
            if ($request->validated('thesises')) {
                collect($request->validated('thesises'))->each(function ($thesis) use ($id) {
                    Document::create([
                        'conference_user_id' => $id,
                        'type_id' => 2,
                        'topic' => $thesis['topic'],
                        'text' => $thesis['text'],
                        'literature' => $thesis['literature'],
                        'authors' => $thesis['authors'],
                    ]);
                });
            }
        });

        return to_route('conferences.show', $conference);
    }

    public function submitDocument(CreateDocumentRequest $request, Conference $conference)
    {
        DB::transaction(function () use ($request, $conference) {
            $document = Document::create([
                ...$request->safe()->only([
                    'type_id',
                    'report_type_id',
                    'topic',
                    'text',
                    'literature',
                    'authors'
                ]),
            ]);

            auth()->user()->conferences()->attach($conference, [
                'document_id' => $document->id,
                'type_id' => $request->validated('type_id') + 1
            ]);
        });

        return to_route('conferences.show', $conference);
    }
}
