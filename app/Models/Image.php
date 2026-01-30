<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Image extends Model
{
    protected $guarded = [];

    public function category()
    {
        return $this->belongsTo(ImageCategory::class);
    }

    /**
     * Get the full URL for this image (served via FTP/local storage)
     */
    // protected function url(): Attribute
    // {
    //     return Attribute::make(
    //         get: fn () => "/files/{$this->path}",
    //     );
    // }
}
