<?php

namespace App\Http\Controllers;

use App\Enums\ConferenceStateEnum;
use App\Http\Requests\ConferenceParticipateRequest;
use App\Http\Requests\CreateDocumentRequest;
use App\Models\Conference;
use App\Models\ConferenceType;
use App\Models\ConferenceUser;
use App\Models\Country;
use App\Models\Degree;
use App\Models\Document;
use App\Models\Image;
use App\Models\ReportType;
use App\Models\Title;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function landing()
    {
        $conferences = Conference::query()
            ->where('front_page', true)
            ->where('state_id', ConferenceStateEnum::ACTIVE)
            ->orderBy('date', 'asc')
            ->limit(4)
            ->get();
        
        // Add starred status if user is authenticated
        if (Auth::check()) {
            $starredIds = Auth::user()->starredConferences()->pluck('conferences.id')->toArray();
            $conferences->each(function ($conference) use ($starredIds) {
                $conference->is_starred = in_array($conference->id, $starredIds);
            });
        }
        
        return Inertia::render('client/landing', [
            'conferences' => $conferences
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
        $type = $request->query('type');
        
        // Only allow states 3 (ACTIVE) and 4 (ARCHIVE) for index route
        // Block any other state values
        $allowedStates = [
            (string) ConferenceStateEnum::ACTIVE->value,
            (string) ConferenceStateEnum::ARCHIVE->value
        ];
        
        if ($state && !in_array($state, $allowedStates, true)) {
            // Redirect to index without state parameter if invalid state is provided
            return redirect()->route('conferences.index');
        }
        
        // Validate type parameter - only allow 1, 2, 3, 4 or null
        $allowedTypes = ['1', '2', '3', '4'];
        if ($type && !in_array($type, $allowedTypes, true)) {
            // Redirect to index without type parameter if invalid type is provided
            return redirect()->route('conferences.index');
        }
        
        $query = Conference::query();
        
        if ($state && in_array($state, $allowedStates, true)) {
            $query->where('state_id', (int) $state);
        } else {
            // By default, show only ACTIVE conferences
            $query->where('state_id', ConferenceStateEnum::ACTIVE);
        }
        
        // Add name filter if provided
        if ($name) {
            $query->where('name', 'like', '%' . $name . '%');
        }
        
        // Add type filter if provided
        if ($type && in_array($type, $allowedTypes, true)) {
            $query->where('type_id', (int) $type);
        }
        
        $conferences = $query->orderBy('date', 'asc')->paginate(15);
        
        // Add starred status if user is authenticated
        if (Auth::check()) {
            $starredIds = Auth::user()->starredConferences()->pluck('conferences.id')->toArray();
            $conferences->getCollection()->each(function ($conference) use ($starredIds) {
                $conference->is_starred = in_array($conference->id, $starredIds);
            });
        }
        
        return Inertia::render('client/conferences/index', [
            'conferences' => $conferences,
            'currentState' => $state,
            'currentName' => $name,
            'currentType' => $type,
            'currentStateName' => $state ? 
                collect([
                    ['id' => ConferenceStateEnum::ACTIVE->value, 'name' => 'Актуальные'],
                    ['id' => ConferenceStateEnum::ARCHIVE->value, 'name' => 'Архив'],
                ])->firstWhere('id', (int) $state)['name'] ?? 'Актуальные' : 
                'Актуальные',
            'states' => [
                ['id' => ConferenceStateEnum::ACTIVE->value, 'name' => 'Актуальные'],
                ['id' => ConferenceStateEnum::ARCHIVE->value, 'name' => 'Архив'],
            ]
        ]);
    }

    public function conferencesTable(Request $request)
    {
        $sortBy = $request->query('sort_by');
        $sortOrder = $request->query('sort_order', 'asc');
        $search = $request->query('search');
        
        $query = Conference::query()
            ->whereIn('state_id', [ConferenceStateEnum::PLANNED, ConferenceStateEnum::ACTIVE])
            ->with('proposal');
        
        // Join with proposals for sorting and searching
        $query->leftJoin('proposals', 'conferences.id', '=', 'proposals.conference_id');
        
        // Apply search filter
        if ($search) {
            $searchTerm = '%' . $search . '%';
            $dbDriver = config('database.default');
            
            if ($dbDriver === 'sqlite') {
                // SQLite JSON syntax
                $query->where(function ($q) use ($searchTerm) {
                    $q->whereRaw("json_extract(proposals.payload, '$.name') LIKE ?", [$searchTerm])
                      ->orWhereRaw("json_extract(proposals.payload, '$.organization') LIKE ?", [$searchTerm])
                      ->orWhereRaw("json_extract(proposals.payload, '$.organizationOther') LIKE ?", [$searchTerm])
                      ->orWhereRaw("json_extract(proposals.payload, '$.topics') LIKE ?", [$searchTerm])
                      ->orWhereRaw("json_extract(proposals.payload, '$.department') LIKE ?", [$searchTerm]);
                });
            } elseif ($dbDriver === 'mysql') {
                // MySQL/MariaDB JSON syntax
                $query->where(function ($q) use ($searchTerm) {
                    $q->whereRaw("JSON_UNQUOTE(JSON_EXTRACT(proposals.payload, '$.name')) LIKE ?", [$searchTerm])
                      ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(proposals.payload, '$.organization')) LIKE ?", [$searchTerm])
                      ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(proposals.payload, '$.organizationOther')) LIKE ?", [$searchTerm])
                      ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(proposals.payload, '$.topics')) LIKE ?", [$searchTerm])
                      ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(proposals.payload, '$.department')) LIKE ?", [$searchTerm]);
                });
            } else {
                // PostgreSQL JSON syntax
                $query->where(function ($q) use ($searchTerm) {
                    $q->whereRaw("proposals.payload->>'name' LIKE ?", [$searchTerm])
                      ->orWhereRaw("proposals.payload->>'organization' LIKE ?", [$searchTerm])
                      ->orWhereRaw("proposals.payload->>'organizationOther' LIKE ?", [$searchTerm])
                      ->orWhereRaw("proposals.payload->>'topics' LIKE ?", [$searchTerm])
                      ->orWhereRaw("proposals.payload->>'department' LIKE ?", [$searchTerm]);
                });
            }
        }
        
        // Apply sorting
        if ($sortBy) {
            $validSortFields = ['date', 'form', 'bookType'];
            $validSortOrder = in_array(strtolower($sortOrder), ['asc', 'desc']) ? strtolower($sortOrder) : 'asc';
            $dbDriver = config('database.default');
            
            if (in_array($sortBy, $validSortFields)) {
                if ($dbDriver === 'sqlite') {
                    // SQLite JSON syntax
                    if ($sortBy === 'date') {
                        $query->orderByRaw("date(json_extract(proposals.payload, '$.date')) " . $validSortOrder);
                    } else {
                        $query->orderByRaw("json_extract(proposals.payload, '$.{$sortBy}') " . $validSortOrder);
                    }
                } elseif ($dbDriver === 'mysql') {
                    // MySQL/MariaDB JSON syntax
                    if ($sortBy === 'date') {
                        $query->orderByRaw("CAST(JSON_UNQUOTE(JSON_EXTRACT(proposals.payload, '$.date')) AS DATE) " . $validSortOrder);
                    } else {
                        $query->orderByRaw("JSON_UNQUOTE(JSON_EXTRACT(proposals.payload, '$.{$sortBy}')) " . $validSortOrder);
                    }
                } else {
                    // PostgreSQL JSON syntax
                    if ($sortBy === 'date') {
                        $query->orderByRaw("CAST(proposals.payload->>'date' AS DATE) " . $validSortOrder);
                    } else {
                        $query->orderByRaw("proposals.payload->>'{$sortBy}' " . $validSortOrder);
                    }
                }
            }
        } else {
            // Default sorting by date ascending
            $dbDriver = config('database.default');
            if ($dbDriver === 'sqlite') {
                $query->orderByRaw("date(json_extract(proposals.payload, '$.date')) ASC");
            } elseif ($dbDriver === 'mysql') {
                $query->orderByRaw("CAST(JSON_UNQUOTE(JSON_EXTRACT(proposals.payload, '$.date')) AS DATE) ASC");
            } else {
                $query->orderByRaw("CAST(proposals.payload->>'date' AS DATE) ASC");
            }
        }
        
        // Select distinct conferences to avoid duplicates from join
        $query->select('conferences.*');
        $query->distinct();
        
        $conferences = $query->paginate(15);
        
        return Inertia::render('client/conferences/table', [
            'conferences' => $conferences,
            'currentSortBy' => $sortBy,
            'currentSortOrder' => $sortOrder,
            'currentSearch' => $search,
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

        // Add starred status if user is authenticated
        if (Auth::check()) {
            $conference->is_starred = Auth::user()->starredConferences()->where('conferences.id', $conference->id)->exists();
        }
        
        return Inertia::render('client/conferences/show', [
            'conference' => $conference,
            'blocks' => $conference->blocks()->orderBy('position')->get(),
            'images' => Image::all(),
            'countries' => Country::select('id', 'name')->get(),
            'degrees' => Degree::select('id', 'name')->get(),
            'titles' => Title::select('id', 'name')->get(),
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

    public function starredConferences(Request $request)
    {
        $name = $request->query('name');
        $type = $request->query('type');
        
        // Validate type parameter - only allow 1, 2, 3, 4 or null
        $allowedTypes = ['1', '2', '3', '4'];
        if ($type && !in_array($type, $allowedTypes, true)) {
            return redirect()->route('client.conferences.starred');
        }
        
        $query = Auth::user()->starredConferences();
        
        // Add name filter if provided
        if ($name) {
            $query->where('name', 'like', '%' . $name . '%');
        }
        
        // Add type filter if provided
        if ($type && in_array($type, $allowedTypes, true)) {
            $query->where('type_id', (int) $type);
        }
        
        $conferences = $query->orderBy('date', 'asc')->get();
        
        // Mark all as starred since they're from starredConferences
        $conferences->each(function ($conference) {
            $conference->is_starred = true;
        });
        
        return Inertia::render('client/conferences/starred', [
            'conferences' => $conferences,
            'currentName' => $name,
            'currentType' => $type,
            'types' => ConferenceType::select('id', 'name')->get(),
        ]);
    }

    public function star(Conference $conference)
    {
        Auth::user()->starredConferences()->syncWithoutDetaching([$conference->id]);
        
        return back();
    }

    public function unstar(Conference $conference)
    {
        Auth::user()->starredConferences()->detach($conference->id);
        
        return back();
    }
}
