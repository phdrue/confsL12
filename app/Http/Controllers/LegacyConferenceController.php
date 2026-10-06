<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArchiveConferenceIndexRequest;
use App\Models\LegacyConference;
use App\Models\LegacyConferenceFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LegacyConferenceController extends Controller
{
    public function index(ArchiveConferenceIndexRequest $request): Response
    {
        $name = $request->validated('name');
        $year = $request->validated('year');

        $query = LegacyConference::query()
            ->with(['featuredFile', 'categories'])
            ->orderByDesc('published_at');

        if (is_string($name) && $name !== '') {
            $query->where('title', 'like', '%'.$name.'%');
        }

        if ($year !== null && $year !== '') {
            $query->whereYear('published_at', (int) $year);
        }

        $years = LegacyConference::query()
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->pluck('published_at')
            ->map(fn ($date): int => (int) $date->year)
            ->unique()
            ->values();

        return Inertia::render('archive/conferences/index', [
            'conferences' => $query->paginate(12)->withQueryString(),
            'currentName' => $name,
            'currentYear' => $year !== null && $year !== '' ? (int) $year : null,
            'years' => $years,
        ]);
    }

    public function show(LegacyConference $legacyConference): Response
    {
        $legacyConference->load(['files', 'categories', 'featuredFile']);

        return Inertia::render('archive/conferences/show', [
            'conference' => $legacyConference,
        ]);
    }

    public function downloadFile(LegacyConferenceFile $file): StreamedResponse
    {
        if (! Storage::disk('public')->exists($file->path)) {
            abort(404);
        }

        return Storage::disk('public')->download($file->path, $file->original_name);
    }

    public function serveFile(string $path): \Symfony\Component\HttpFoundation\Response
    {
        $normalized = str_replace('\\', '/', rawurldecode($path));
        $normalized = ltrim($normalized, '/');

        if ($normalized === '' || in_array('..', explode('/', $normalized), true)) {
            abort(404);
        }

        $storagePath = 'legacy/'.$normalized;

        if (! Storage::disk('public')->exists($storagePath)) {
            abort(404);
        }

        $mime = Storage::disk('public')->mimeType($storagePath) ?: 'application/octet-stream';

        return Storage::disk('public')->response($storagePath, basename($normalized), [
            'Content-Type' => $mime,
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
}
