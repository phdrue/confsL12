<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class EnsureCanAccessConference
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $isAdmin = Gate::allows('is-admin');
        $isResponsible = Gate::allows('is-responsible') && auth()->user()->responsibilities()->where('conference_id', $request->route('conference')->id)->exists();

        if (! ($isAdmin || $isResponsible)) {
            abort(403, 'Недостаточно полномочий');
        }

        return $next($request);
    }
}
