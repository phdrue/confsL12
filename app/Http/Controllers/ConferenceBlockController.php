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
                    // Store file to FTP disk
                    $path = $file->store($conferenceDir, 'ftp');
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
                    // Store file to FTP disk
                    $path = $file->store($conferenceDir, 'ftp');
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
                $this->deleteFileFromStorage($removedPath);
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
                $this->deleteFileFromStorage($file['path']);
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
        $path = $file['path'];

        // Try FTP first, then fall back to public disk
        $disks = ['ftp', 'public'];
        $foundDisk = null;

        foreach ($disks as $disk) {
            if (Storage::disk($disk)->exists($path)) {
                $foundDisk = $disk;
                break;
            }
        }

        if (! $foundDisk) {
            abort(404, 'File not found');
        }

        // For FTP, we need to get the file content and stream it
        // For local storage, we can use the file path directly
        if ($foundDisk === 'ftp') {
            try {
                $fileContent = Storage::disk('ftp')->get($path);
                $mimeType = $this->getMimeTypeFromPath($path);
                
                return response($fileContent, 200)
                    ->header('Content-Type', $mimeType)
                    ->header('Content-Disposition', 'attachment; filename="' . $file['name'] . '"');
            } catch (\Exception $e) {
                abort(500, 'Error downloading file from FTP');
            }
        }

        // For local storage, use the path directly
        return response()->download(
            Storage::disk('public')->path($path),
            $file['name']
        );
    }

    /**
     * Delete a file from storage (checks FTP and public disks).
     */
    private function deleteFileFromStorage(string $path): void
    {
        $disks = ['ftp', 'public'];
        
        foreach ($disks as $disk) {
            if (Storage::disk($disk)->exists($path)) {
                try {
                    Storage::disk($disk)->delete($path);
                    break; // File found and deleted, no need to check other disks
                } catch (\Exception $e) {
                    // Continue to next disk if deletion fails
                    continue;
                }
            }
        }
    }

    /**
     * Get MIME type from file path extension.
     */
    private function getMimeTypeFromPath(string $path): string
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        
        return match ($extension) {
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'zip' => 'application/zip',
            'rar' => 'application/x-rar-compressed',
            'txt' => 'text/plain',
            'rtf' => 'application/rtf',
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            default => 'application/octet-stream',
        };
    }
}
