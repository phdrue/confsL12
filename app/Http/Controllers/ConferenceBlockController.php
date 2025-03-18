<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateConferenceBlockRequest;
use App\Http\Requests\ReorderBlocksRequest;
use App\Http\Requests\UpdateConferenceBlockRequest;
use App\Models\Conference;
use App\Models\ConferenceBlock;
use Illuminate\Http\Request;

class ConferenceBlockController extends Controller
{
    public function reorder(ReorderBlocksRequest $request, Conference $conference)
    {
        // TODO GATE
        $reorderedBlocks = collect($request->validated()['blocks']);
        $blockIds = $reorderedBlocks->pluck('id')->toArray();
        $blocks = ConferenceBlock::find($blockIds);
        $blocks->map(function (ConferenceBlock $block, $index) use ($reorderedBlocks) {
            $block->position = $reorderedBlocks->where('id', $block->id)->first()['position'];
            $block->save();
        });
        return to_route('adm.conferences.show', $conference->id);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateConferenceBlockRequest $request)
    {
        //TODO GATE draft state
        // dd($request->all());
        // dd($request->validated());
        $conference = Conference::find($request->validated()['conference_id']);
        ConferenceBlock::create([...$request->validated(), 'position' => $conference->blocks()->count() + 1]);
        return to_route('adm.conferences.show', $request->validated()['conference_id']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateConferenceBlockRequest $request, ConferenceBlock $block)
    {
        // TODO GATE
        $block->update([
            ...$request->safe()->only(['content', 'name'])
        ]);

        return to_route('adm.conferences.show', $block->conference_id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ConferenceBlock $block)
    {
        // TODO gate
        // dd($block, ConferenceBlock::find($block));
        $block->delete();
        return to_route('adm.conferences.show', $block->conference_id);
    }
}
