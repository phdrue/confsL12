<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Conference extends Model
{
    public function state(): BelongsTo
    {
        return $this->belongsTo(ConferenceState::class);
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(ConferenceType::class);
    }

    public function blocks(): HasMany
    {
        return $this->hasMany(ConferenceBlock::class);
    }
}
