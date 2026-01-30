<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateImageRequest;
use App\Http\Requests\UpdateImageRequest;
use Inertia\Inertia;
use App\Models\Image;
use App\Models\ImageCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('admin/images/index', [
            'images' => Image::with('category')->get(),
            'imageCategories' => ImageCategory::select('id', 'name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CreateImageRequest $request)
    {
        $path = 'img/images';
        // Store to FTP by default, can be changed via env
        $disk = env('IMAGE_STORAGE_DISK', 'ftp');
        $imgPath = $request->file('img')->store($path, $disk);
        Image::create([...$request->safe()->except('img'), 'path' =>  $imgPath]);

        return to_route('adm.images.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Image $image)
    {
        return Inertia::render('admin/images/edit', [
            'image' => $image->load('category'),
            'imageCategories' => ImageCategory::select('id', 'name')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateImageRequest $request, Image $image)
    {
        $data = $request->safe()->except('img');

        // If a new image is uploaded, store it and update the path
        if ($request->hasFile('img')) {
            $path = 'img/images';
            $disk = env('IMAGE_STORAGE_DISK', 'ftp');
            $imgPath = $request->file('img')->store($path, $disk);
            $data['path'] = $imgPath;
        }

        $image->update($data);

        return to_route('adm.images.index');
    }

    /**
     * Serve an image from storage (supports FTP and local storage).
     */
    public function serve(string $path)
    {
        // Decode URL-encoded path
        $path = urldecode($path);
        
        // Log for debugging
        Log::info('Serving file from storage', ['path' => $path]);
        
        // Try FTP first, then fall back to public disk
        $disks = ['ftp', 'public'];
        
        foreach ($disks as $disk) {
            if (Storage::disk($disk)->exists($path)) {
                try {
                    $file = Storage::disk($disk)->get($path);
                    
                    // Determine mime type from file extension
                    $mimeType = $this->getMimeTypeFromPath($path);
                    
                    Log::info('File served successfully', ['path' => $path, 'disk' => $disk]);
                    
                    return response($file, 200)
                        ->header('Content-Type', $mimeType)
                        ->header('Cache-Control', 'public, max-age=31536000');
                } catch (\Exception $e) {
                    Log::error('Error serving file from disk', [
                        'path' => $path, 
                        'disk' => $disk, 
                        'error' => $e->getMessage()
                    ]);
                    continue;
                }
            }
        }
        
        Log::error('File not found in any disk', ['path' => $path, 'disks_checked' => $disks]);
        abort(404, 'Image not found');
    }

    /**
     * Get MIME type from file path extension.
     */
    private function getMimeTypeFromPath(string $path): string
    {
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        
        return match ($extension) {
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'bmp' => 'image/bmp',
            'ico' => 'image/x-icon',
            default => 'image/jpeg',
        };
    }
}
