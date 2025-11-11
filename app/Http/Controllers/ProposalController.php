<?php

namespace App\Http\Controllers;

use App\Enums\ConferenceStateEnum;
use App\Http\Requests\CreateProposalRequest;
use App\Http\Requests\UpdateProposalRequest;
use App\Models\Conference;
use App\Models\Proposal;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProposalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/proposals/index', [
            'proposals' => Proposal::with('user')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateProposalRequest $request)
    {
        Proposal::create([
            'user_id' => Auth::id(),
            'payload' => [...$request->safe()],
        ]);

        return to_route('adm.proposals.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Proposal $proposal)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Proposal $proposal)
    {
        Gate::authorize('is-admin');
        
        // Prevent editing if proposal has been converted to a conference
        if ($proposal->conference_id) {
            return redirect()->back()->with('error', 'Нельзя редактировать предложение, из которого уже создана конференция');
        }

        return Inertia::render('admin/proposals/edit', [
            'proposal' => $proposal,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProposalRequest $request, Proposal $proposal)
    {
        Gate::authorize('is-admin');
        
        // Prevent updating if proposal has been converted to a conference
        if ($proposal->conference_id) {
            return redirect()->back()->with('error', 'Нельзя редактировать предложение, из которого уже создана конференция');
        }

        $proposal->update([
            'payload' => [...$request->safe()],
        ]);

        return to_route('adm.proposals.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Proposal $proposal)
    {
        //
    }

    /**
     * Deny a proposal (admin only)
     */
    public function deny(Proposal $proposal)
    {
        Gate::authorize('is-admin');

        $proposal->update([
            'denied' => true,
        ]);

        return redirect()->back()->with('success', 'Предложение отклонено');
    }

    /**
     * Create conference from proposal (admin only)
     */
    public function approve(Proposal $proposal)
    {
        Gate::authorize('is-admin');

        DB::transaction(function () use ($proposal) {
            // Map proposal fields to conference fields
            $payload = $proposal->payload;

            // Determine conference type based on proposal level
            $typeId = $this->mapLevelToTypeId($payload['level'] ?? '');

            // Create conference
            $conference = Conference::create([
                'type_id' => $typeId,
                'state_id' => ConferenceStateEnum::PLANNED->value,
                'front_page' => false,
                'name' => $payload['name'] ?? $payload['shortName'] ?? 'Новая конференция',
                'description' => $payload['topics'] ?? 'Описание конференции',
                'date' => $payload['date'] ?? now()->addMonth(),
                'allow_thesis' => true,
                'allow_report' => true,
                'img_path' => 'img/placeholders/image.png',
                'primary_color' => '#548FC7',
            ]);

            // Update proposal with conference_id
            $proposal->update([
                'conference_id' => $conference->id,
                'denied' => false,
            ]);

            // Assign proposal author as responsible for the conference
            $proposalAuthor = $proposal->user;
            
            // Ensure the author has the RESPONSIBLE role
            if (!$proposalAuthor->hasRole(\App\Enums\Role::RESPONSIBLE)) {
                $proposalAuthor->roles()->attach(\App\Enums\Role::RESPONSIBLE->value);
            }
            
            // Assign the author as responsible for the conference
            $conference->responsible()->attach($proposalAuthor->id);
        });

        return redirect()->back()->with('success', 'Конференция создана из предложения');
    }

    /**
     * Map proposal level to conference type ID
     */
    private function mapLevelToTypeId(string $level): int
    {
        return match ($level) {
            'Региональный' => 1,
            'Всероссийский' => 2,
            'Международный' => 3,
            'Другой' => 4,
            default => 4, // Default to "Другие"
        };
    }
}
