<?php

namespace App\Http\Controllers;

use App\Http\Requests\ConferenceParticipateRequest;
use App\Models\Conference;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function landing()
    {
        return Inertia::render('client/landing');
    }

    public function conferences() {}

    public function conference(Conference $conference)
    {
        return Inertia::render(
            'client/conferences/show',
            [
                'conference' => $conference
            ]
        );
    }

    public function participate(ConferenceParticipateRequest $request, Conference $conference)
    {
        auth()->user()->conferences()->attach($conference);

        return to_route('conferences.show', $conference);
    }
}
