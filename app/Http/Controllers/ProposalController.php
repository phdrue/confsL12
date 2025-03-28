<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateProposalRequest;
use App\Models\Proposal;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProposalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/proposals/index', [
            'proposals' => Proposal::all()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateProposalRequest $request)
    {
        Proposal::create([
            'payload' => [...$request->safe()]
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Proposal $proposal)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Proposal $proposal)
    {
        //
    }
}
