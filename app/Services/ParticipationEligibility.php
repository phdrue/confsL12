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

    public function denialMessage(User $user, Conference $conference, bool $hasDocuments = false): string
    {
        $conferenceDate = Carbon::parse($conference->getRawOriginal('date'));
        $participates = $this->participates($user, $conference);
        $conferenceIsActive = $conference->state_id === ConferenceStateEnum::ACTIVE->value;
        $conferenceInFuture = now()->lt($conferenceDate);
        $moreThanMonthAway = now()->addMonth()->lt($conferenceDate);

        if (! $participates) {
            if (! $this->userHasCompleteProfile($user)) {
                return 'Для участия в конференции необходимо заполнить все данные профиля.';
            }

            if (! $conferenceIsActive || ! $conferenceInFuture) {
                return 'Приём заявок на данную конференцию полностью закрыт. Участвовать в конференции больше нельзя.';
            }

            if ($hasDocuments && ! $moreThanMonthAway) {
                return 'Вы можете зарегистрироваться на конференцию, но приём докладов и тезисов уже закрыт (до начала конференции осталось менее месяца).';
            }

            return 'Вы не можете участвовать в этой конференции.';
        }

        if (! $conferenceIsActive || ! $conferenceInFuture) {
            return 'Вы уже участвуете в конференции, но приём изменений документов закрыт, так как конференция завершилась или деактивирована.';
        }

        if (! $moreThanMonthAway) {
            return 'Вы уже участвуете в конференции, но приём новых докладов и тезисов закрыт (до начала конференции осталось менее месяца).';
        }

        return 'Вы не можете изменять документы участия в этой конференции.';
    }

    private function userHasCompleteProfile(User $user): bool
    {
        $requiredFields = [
            'first_name',
            'last_name',
            'second_name',
            'organization',
            'position',
            'city',
            'phone',
            'country_id',
            'degree_id',
            'title_id',
        ];

        foreach ($requiredFields as $field) {
            if (empty($user->$field)) {
                return false;
            }
        }

        return true;
    }
}
