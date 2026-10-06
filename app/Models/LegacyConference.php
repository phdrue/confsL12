<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class LegacyConference extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
            'meta' => 'array',
        ];
    }

    public function files(): HasMany
    {
        return $this->hasMany(LegacyConferenceFile::class);
    }

    public function featuredFile(): HasOne
    {
        return $this->hasOne(LegacyConferenceFile::class)->where('is_featured', true);
    }
}
