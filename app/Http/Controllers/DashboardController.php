<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

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
            return Inertia::render('dashboards/responsible');
        }
    }
}
