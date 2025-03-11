<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConferenceParticipateRequest;
use App\Http\Requests\CreateDocumentRequest;
use App\Http\Requests\SubmitDocumentRequest;
use App\Models\Conference;
use App\Models\Country;
use App\Models\Document;
use App\Models\ReportType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function landing()
    {
        return Inertia::render('client/landing', [
            'conferences' => Conference::query()
                ->where('front_page', true)
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
            'conferences' => Conference::all()
        ]);
    }

    public function conference(Conference $conference)
    {
        return Inertia::render('client/conferences/show', [
            'conference' => $conference,
            'blocks' => $conference->blocks,
            'countries' => Country::select('id', 'name')->get(),
            'reportTypes' => ReportType::select('id', 'name')->get(),
        ]);
    }

    public function participate(ConferenceParticipateRequest $request, Conference $conference)
    {
        auth()->user()->conferences()->attach($conference);

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
