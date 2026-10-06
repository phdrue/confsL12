<?php

namespace App\Services;

use App\Enums\ConferenceStateEnum;
use App\Models\Conference;
use App\Models\ConferenceUser;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;

class ParticipationEligibility
{
    public function conferenceIsVisible(Conference $conference): bool
    {
        return ! in_array($conference->state_id, [
            ConferenceStateEnum::DRAFT->value,
            ConferenceStateEnum::PLANNED->value,
        ], true);
    }

    public function documentsAreAccepted(Conference $conference): bool
    {
        if ($conference->force_enroll) {
            return true;
        }

        $conferenceDate = Carbon::parse($conference->getRawOriginal('date'));

        return now()->addMonth()->lt($conferenceDate);
    }

    public function participates(User $user, Conference $conference): bool
    {
        return ConferenceUser::query()
            ->where('conference_id', $conference->id)
            ->where('user_id', $user->id)
            ->exists();
    }

    public function canAccessWizard(User $user, Conference $conference): bool
    {
        return Gate::forUser($user)->allows('can-participate', $conference)
            || $this->participates($user, $conference);
    }

    public function canEditDocuments(User $user, Conference $conference): bool
    {
        if (! $this->documentsAreAccepted($conference)) {
            return false;
        }

        if ($this->participates($user, $conference)) {
            return Gate::forUser($user)->allows('can-manage-documents', $conference);
        }

        return Gate::forUser($user)->allows('can-participate', $conference);
    }

    public function canFinish(User $user, Conference $conference): bool
    {
        if ($this->participates($user, $conference)) {
            return Gate::forUser($user)->allows('can-manage-documents', $conference);
        }

        return Gate::forUser($user)->allows('can-participate', $conference);
    }
}
