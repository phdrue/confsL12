<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class LegacyConferenceCategory extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function conferences(): BelongsToMany
    {
        return $this->belongsToMany(
            LegacyConference::class,
            'legacy_conference_category',
            'legacy_conference_category_id',
            'legacy_conference_id',
        );
    }
}
