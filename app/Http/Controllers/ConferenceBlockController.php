<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateConferenceBlockRequest;
use App\Http\Requests\ReorderBlocksRequest;
use App\Http\Requests\UpdateConferenceBlockRequest;
use App\Models\Conference;
use App\Models\ConferenceBlock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ConferenceBlockController extends Controller
{
    public function reorder(ReorderBlocksRequest $request, Conference $conference)
    {
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
        $conference = Conference::find($request->validated()['conference_id']);
        $data = $request->validated();

        // Handle file uploads for files block (type_id = 11)
        if ((int) $data['type_id'] === 11) {
            $files = [];

            if ($request->hasFile('files')) {
                $conferenceDir = "conferences/{$conference->id}/files";

                foreach ($request->file('files') as $file) {
                    $path = $file->store($conferenceDir);
                    $files[] = [
                        'path' => $path,
                        'name' => $file->getClientOriginalName(),
                    ];
                }
            }

            $data['content'] = ['files' => $files];
        }

        // Remove 'files' from data as it's not a database column
        unset($data['files']);

        ConferenceBlock::create([...$data, 'position' => $conference->blocks()->count() + 1]);

        return to_route('adm.conferences.show', $request->validated()['conference_id']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateConferenceBlockRequest $request, ConferenceBlock $block)
    {
        $data = $request->safe()->only(['content', 'name']);

        // Handle file uploads for files block (type_id = 11)
        if ((int) $block->type_id === 11) {
            $oldFiles = $block->content['files'] ?? [];
            $newFiles = [];

            // If content is provided in request, use it (files may have been removed)
            if ($request->has('content') && isset($request->input('content')['files'])) {
                $newFiles = $request->input('content')['files'];
            }

            // Add new files if any are uploaded
            if ($request->hasFile('files')) {
                $conferenceDir = "conferences/{$block->conference_id}/files";

                foreach ($request->file('files') as $file) {
                    $path = $file->store($conferenceDir);
                    $newFiles[] = [
                        'path' => $path,
                        'name' => $file->getClientOriginalName(),
                    ];
                }
            }

            // Find and delete files that were removed
            $oldFilePaths = collect($oldFiles)->pluck('path')->toArray();
            $newFilePaths = collect($newFiles)->pluck('path')->toArray();
            $removedFilePaths = array_diff($oldFilePaths, $newFilePaths);

            foreach ($removedFilePaths as $removedPath) {
                if (Storage::exists($removedPath)) {
                    Storage::delete($removedPath);
                }
            }

            $data['content'] = ['files' => $newFiles];
        }

        // Remove 'files' from data as it's not a database column
        if (isset($data['files'])) {
            unset($data['files']);
        }

        $block->update($data);

        return to_route('adm.conferences.show', $block->conference_id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ConferenceBlock $block)
    {
        // Delete associated files if it's a files block
        if ((int) $block->type_id === 11 && isset($block->content['files'])) {
            foreach ($block->content['files'] as $file) {
                if (Storage::exists($file['path'])) {
                    Storage::delete($file['path']);
                }
            }
        }

        $block->delete();

        return to_route('adm.conferences.show', $block->conference_id);
    }

    /**
     * Download a file from a files block
     */
    public function downloadFile(ConferenceBlock $block, int $fileIndex)
    {
        if ((int) $block->type_id !== 11 || ! isset($block->content['files'][$fileIndex])) {
            abort(404);
        }

        $file = $block->content['files'][$fileIndex];

        if (! Storage::exists($file['path'])) {
            abort(404);
        }

        return response()->download(
            Storage::path($file['path']),
            $file['name']
        );
    }
}
