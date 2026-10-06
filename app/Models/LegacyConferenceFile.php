<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LegacyConferenceFile extends Model
{
    use HasFactory;

    protected $guarded = [];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'size' => 'integer',
        ];
    }

    public function conference(): BelongsTo
    {
        return $this->belongsTo(LegacyConference::class, 'legacy_conference_id');
    }
}
