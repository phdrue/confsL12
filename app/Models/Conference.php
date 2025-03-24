<?php

namespace App\Models;

use App\Enums\ParticipationTypeEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Conference extends Model
{
    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date:d.m.Y',
        ];
    }

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

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)
            ->using(ConferenceUser::class)
            ->withPivot('type_id', 'confirmed', 'document_id');
    }

    public function regularParticipants(): BelongsToMany
    {
        return $this->users()->wherePivot('type_id', ParticipationTypeEnum::REGULAR->value);
    }

    public function reportParticipants(): BelongsToMany
    {
        return $this->users()->wherePivot('type_id', ParticipationTypeEnum::REPORT->value);
    }

    public function thesisParticipants(): BelongsToMany
    {
        return $this->users()->wherePivot('type_id', ParticipationTypeEnum::THESIS->value);
    }

    public function responsible(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'responsibilities', 'conference_id', 'user_id');
    }

    public function getAvailableToBeResponsible(): Collection
    {
        return User::whereDoesntHave('responsibilities', function (Builder $query) {
            $query->where('conference_id', $this->id);
        })->get();
    }
}
