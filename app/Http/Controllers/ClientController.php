<?php

namespace App\Http\Controllers;

use App\Enums\ConferenceStateEnum;
use App\Http\Requests\ConferenceParticipateRequest;
use App\Http\Requests\CreateDocumentRequest;
use App\Models\Conference;
use App\Models\ConferenceUser;
use App\Models\Country;
use App\Models\Document;
use App\Models\ReportType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function conferences(Request $request)
    {
        $state = $request->query('state');
        $name = $request->query('name');
        
        $query = Conference::query();
        
        if ($state && $state !== '1') {
            $query->where('state_id', $state);
        } else {
            $query->whereIn('state_id', [ConferenceStateEnum::ACTIVE, ConferenceStateEnum::ARCHIVE]);
        }
        
        // Add name filter if provided
        if ($name) {
            $query->where('name', 'like', '%' . $name . '%');
        }
        
        $conferences = $query->orderBy('date', 'asc')->paginate(1);
        
        return Inertia::render('client/conferences/index', [
            'conferences' => $conferences,
            'currentState' => $state,
            'currentName' => $name,
            'currentStateName' => $state ? 
                collect([
                    ['id' => ConferenceStateEnum::ACTIVE->value, 'name' => 'Актуальные'],
                    ['id' => ConferenceStateEnum::ARCHIVE->value, 'name' => 'Архив'],
                    ['id' => ConferenceStateEnum::PLANNED->value, 'name' => 'В плане'],
                ])->firstWhere('id', $state)['name'] ?? 'Актуальные' : 
                'Актуальные',
            'states' => [
                ['id' => ConferenceStateEnum::ACTIVE->value, 'name' => 'Актуальные'],
                ['id' => ConferenceStateEnum::ARCHIVE->value, 'name' => 'Архив'],
                ['id' => ConferenceStateEnum::PLANNED->value, 'name' => 'В плане'],
            ]
        ]);
    }

    public function conference(Conference $conference)
    {
        if ($conference->state_id === ConferenceStateEnum::DRAFT->value) {
            abort(404, 'Мероприятие не найдено');
        }

        // Get existing participation if user is authenticated
        $participation = null;
        $existingDocuments = [
            'reports' => [],
            'thesises' => []
        ];

        if (Auth::check()) {
            $participation = ConferenceUser::where('conference_id', $conference->id)
                ->where('user_id', Auth::id())
                ->with(['documents' => function ($query) {
                    $query->with('reportType');
                }])
                ->first();

            if ($participation) {
                $existingDocuments['reports'] = $participation->documents()
                    ->where('type_id', 1)
                    ->get()
                    ->map(function ($doc) {
                        return [
                            'id' => $doc->id,
                            'topic' => $doc->topic,
                            'report_type_id' => $doc->report_type_id,
                            'authors' => $doc->authors,
                            'science_guides' => $doc->science_guides ?? [],
                        ];
                    })
                    ->toArray();

                $existingDocuments['thesises'] = $participation->documents()
                    ->where('type_id', 2)
                    ->get()
                    ->map(function ($doc) {
                        return [
                            'id' => $doc->id,
                            'topic' => $doc->topic,
                            'text' => $doc->text,
                            'literature' => $doc->literature,
                            'authors' => $doc->authors,
                            'science_guides' => $doc->science_guides ?? [],
                        ];
                    })
                    ->toArray();
            }
        }

        return Inertia::render('client/conferences/show', [
            'conference' => $conference,
            'blocks' => $conference->blocks()->orderBy('position')->get(),
            'countries' => Country::select('id', 'name')->get(),
            'reportTypes' => ReportType::select('id', 'name')->get(),
            'participation' => $participation ? [
                'id' => $participation->id,
                'confirmed' => $participation->confirmed,
            ] : null,
            'existingDocuments' => $existingDocuments,
        ]);
    }

    public function participate(ConferenceParticipateRequest $request, Conference $conference)
    {
        DB::transaction(function () use ($request, $conference) {
            // Check if user already participates
            $participation = ConferenceUser::where('conference_id', $conference->id)
                ->where('user_id', Auth::id())
                ->first();

            // If no participation exists, create one
            if (!$participation) {
                $participation = ConferenceUser::create([
                    'conference_id' => $conference->id,
                    'user_id' => Auth::id(),
                ]);
            }

            $participationId = $participation->id;

            // Handle reports - replace all existing reports with new ones
            // Only process if reports are allowed
            if ($conference->allow_report) {
                // Delete existing reports
                Document::where('conference_user_id', $participationId)
                    ->where('type_id', 1)
                    ->delete();

                // Create new reports if any are provided
                $reports = $request->validated('reports');
                if ($reports && !empty($reports)) {
                    collect($reports)->each(function ($report) use ($participationId) {
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

            // Handle thesises - replace all existing thesises with new ones
            // Only process if thesises are allowed
            if ($conference->allow_thesis) {
                // Delete existing thesises
                Document::where('conference_user_id', $participationId)
                    ->where('type_id', 2)
                    ->delete();

                // Create new thesises if any are provided
                $thesises = $request->validated('thesises');
                if ($thesises && !empty($thesises)) {
                    collect($thesises)->each(function ($thesis) use ($participationId) {
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
                    'authors',
                    'science_guides',
                ]),
            ]);

            Auth::user()->conferences()->attach($conference, [
                'document_id' => $document->id,
                'type_id' => $request->validated('type_id') + 1
            ]);
        });

        return to_route('conferences.show', $conference);
    }
}
