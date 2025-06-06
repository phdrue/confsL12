<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateImageRequest;
use Inertia\Inertia;
use App\Models\Image;
use App\Models\ImageCategory;
use Illuminate\Http\Request;

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
        $imgPath = $request->file('img')->store($path);
        Image::create([...$request->safe()->except('img'), 'path' =>  $imgPath]);

        return to_route('adm.images.index');
    }
}
