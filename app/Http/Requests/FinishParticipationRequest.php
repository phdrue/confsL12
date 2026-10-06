<?php

namespace App\Http\Requests;

use App\Services\ParticipationDraft;

class FinishParticipationRequest extends ConferenceParticipateRequest
{
    protected function prepareForValidation(): void
    {
        $conference = $this->route('conference');
        $user = $this->user();

        if (! $conference || ! $user) {
            return;
        }

        $payload = app(ParticipationDraft::class)->submissionPayload($user, $conference);

        $this->merge([
            'reports' => $payload['reports'],
            'thesises' => $payload['thesises'],
        ]);
    }
}
