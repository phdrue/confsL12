<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConferenceBlock extends Model
{
    // protected $fillable = [
    //     'content->text'
    // ];

    protected $casts = [
        'content' => 'array'
    ];

    public function conference(): BelongsTo
    {
        return $this->belongsTo(Conference::class);
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(ConferenceBlockType::class);
    }
}
