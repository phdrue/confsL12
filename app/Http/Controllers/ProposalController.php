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
use Illuminate\Support\Facades\Storage;
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
        $data = [
            'user_id' => Auth::id(),
            'payload' => [...$request->safe()->except('img')],
        ];

        if ($request->hasFile('img')) {
            $path = 'img/proposals';
            // Store image to FTP disk
            $data['img_path'] = $request->file('img')->store($path, 'ftp');
        }

        Proposal::create($data);

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

        $data = [
            'payload' => [...$request->safe()->except('img')],
        ];

        if ($request->hasFile('img')) {
            // Delete old image if exists (checks both FTP and public)
            if ($proposal->img_path) {
                $this->deleteImageFromStorage($proposal->img_path);
            }
            $path = 'img/proposals';
            // Store new image to FTP disk
            $data['img_path'] = $request->file('img')->store($path, 'ftp');
        }

        $proposal->update($data);

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

            // Handle image: copy from proposal if exists, otherwise use default
            $imgPath = 'img/placeholders/image.png';
            if ($proposal->img_path) {
                // Find which disk contains the proposal image
                $sourceDisk = null;
                $disks = ['ftp', 'public'];
                foreach ($disks as $disk) {
                    if (Storage::disk($disk)->exists($proposal->img_path)) {
                        $sourceDisk = $disk;
                        break;
                    }
                }
                
                if ($sourceDisk) {
                    // Copy the image to conferences directory on FTP
                    $newPath = 'img/conferences/' . basename($proposal->img_path);
                    $fileContent = Storage::disk($sourceDisk)->get($proposal->img_path);
                    Storage::disk('ftp')->put($newPath, $fileContent);
                    $imgPath = $newPath;
                }
            }

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
                'img_path' => $imgPath,
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

    /**
     * Delete an image from storage (checks FTP and public disks).
     */
    private function deleteImageFromStorage(string $path): void
    {
        $disks = ['ftp', 'public'];
        
        foreach ($disks as $disk) {
            if (Storage::disk($disk)->exists($path)) {
                try {
                    Storage::disk($disk)->delete($path);
                    break; // Image found and deleted, no need to check other disks
                } catch (\Exception $e) {
                    // Continue to next disk if deletion fails
                    continue;
                }
            }
        }
    }
}
