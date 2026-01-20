<?php

namespace App\Http\Controllers;

use App\Enums\Role;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Image;
use Inertia\Response;
use App\Models\Conference;
use Illuminate\Http\Request;
use App\Models\ImageCategory;
use App\Models\ConferenceType;
use App\Models\ConferenceState;
use App\Models\ConferenceBlockType;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\CreateConferenceRequest;
use App\Http\Requests\UpdateConferenceRequest;
use App\Http\Requests\ChangeConferenceStateRequest;
use App\Models\ConferenceUser;
use App\Models\Document;
use App\Models\ConferenceBlock;
use App\Models\Proposal;
use Illuminate\Support\Facades\DB;

class ConferenceController extends Controller
{
    public function participations(Conference $conference)
    {
        return Inertia::render('admin/conferences/participations', [
            'conference' => $conference,
            'users' => $conference->users()->get()
        ]);
    }

    public function responsible(Conference $conference)
    {
        return Inertia::render('admin/conferences/responsible', [
            'conference' => $conference,
            'responsible' => $conference->responsible,
            'availableToBeResponsible' => $conference->getAvailableToBeResponsible()
        ]);
    }

    public function toggleResponsible(Conference $conference, User $user)
    {
        Gate::authorize('is-admin');

        if (! $user->hasRole(Role::RESPONSIBLE)) {
            abort(403, 'У пользователя недостаточно полномочий');
        }

        $conference->responsible()->toggle($user->id);
        return to_route('adm.conferences.responsible', $conference);
    }

    public function toggleConfirmed(Conference $conference, User $user)
    {
        $pivot = ConferenceUser::query()
            ->where('user_id', $user->id)
            ->where('conference_id', $conference->id)
            ->firstOrFail();

        $pivot->update(['confirmed' => !$pivot->confirmed]);

        return to_route('adm.conferences.participations', $conference);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('admin/conferences/index', [
            'conferences' => Conference::with('proposal.user')->get(),
            'types' => ConferenceType::select('id', 'name')->get(),
            'states' => ConferenceState::select('id', 'name')->get(),
        ]);
    }

    /**
     * Display statistics page.
     */
    public function statistics(): Response
    {
        return Inertia::render('admin/statistics/index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Conference $conference)
    {
        return Inertia::render('admin/conferences/show', [
            'conference' => $conference,
            'defaultBlocks' => $conference->blocks()->select([
                'id',
                'position',
                'name',
                'type_id',
                'content'
            ])->orderBy('position')->get(),
            'blockTypes' => ConferenceBlockType::select('id', 'name')->get(),
            'imagesBlockData' => [
                'images' => Image::all(),
                'imageCategories' => ImageCategory::select('id', 'name')->get()
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateConferenceRequest $request)
    {
        $path = 'img/conferences';
        // dd($request->validated());
        $imgPath = $request->file('img')->store($path);
        Conference::create([
            ...$request->safe()->except('img'),
            'img_path' =>  $imgPath
        ]);

        return to_route('adm.conferences.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Conference $conference)
    {
        return Inertia::render('admin/conferences/edit', [
            'conference' => $conference->load('proposal.user'),
            'types' => ConferenceType::select('id', 'name')->get(),
            'states' => ConferenceState::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateConferenceRequest $request, Conference $conference)
    {
        $imgPath = $conference->img_path;

        if ($request->hasFile('img')) {
            $path = 'img/conferences';
            $imgPath = $request->file('img')->store($path);
            Storage::delete($conference->img_path);
        }

        $conference->update([
            ...$request->safe()->except('img'),
            'img_path' =>  $imgPath
        ]);

        return to_route('adm.conferences.edit', $conference);
    }

    public function toggleFrontPage(Conference $conference)
    {
        // $conference->toggle('front_page');
        $conference->update([
            'front_page' => $conference->front_page ? false : true
        ]);

        return to_route('adm.conferences.edit', $conference);
    }

    public function changeState(ChangeConferenceStateRequest $request, Conference $conference)
    {
        $conference->update([
            'state_id' => $request->validated('state_id')
        ]);

        return to_route('adm.conferences.edit', $conference);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Conference $conference)
    {
        Gate::authorize('is-admin');

        DB::transaction(function () use ($conference) {
            // Delete all documents associated with conference users
            $conferenceUserIds = ConferenceUser::where('conference_id', $conference->id)
                ->pluck('id');
            
            Document::whereIn('conference_user_id', $conferenceUserIds)->delete();

            // Delete all conference user pivot records
            ConferenceUser::where('conference_id', $conference->id)->delete();

            // Delete all responsibilities (pivot table)
            $conference->responsible()->detach();

            // Delete all conference blocks
            ConferenceBlock::where('conference_id', $conference->id)->delete();

            // Delete proposal if exists
            Proposal::where('conference_id', $conference->id)->update([
                'conference_id' => null,
            ]);

            // Delete conference image file from storage
            if ($conference->img_path && Storage::exists($conference->img_path)) {
                Storage::delete($conference->img_path);
            }

            // Delete the conference itself
            $conference->delete();
        });

        return to_route('adm.conferences.index');
    }
}
