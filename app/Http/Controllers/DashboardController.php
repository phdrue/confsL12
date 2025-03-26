<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Conference;
use Illuminate\Http\Request;
use App\Models\ConferenceType;
use App\Models\ConferenceState;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class DashboardController extends Controller
{
    public function __invoke()
    {
        if (Gate::allows('is-admin')) {
            // return Inertia::render('dashboards/admin');
            return to_route('adm.conferences.index');
        }

        if (Gate::allows('is-user')) {
            return Inertia::render('dashboards/client', [
                'conferences' => auth()->user()->conferences
            ]);
        }

        if (Gate::allows('is-responsible')) {
            return Inertia::render('dashboards/responsible', [
                'conferences' => auth()->user()->responsibilities,
                'types' => ConferenceType::select('id', 'name')->get(),
                'states' => ConferenceState::select('id', 'name')->get(),
            ]);
        }

        Auth::logout();
        return abort(403, 'Доступ отключен');
    }
}
