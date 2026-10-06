<?php

namespace App\Http\Requests;

use App\Services\ParticipationEligibility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class ModifyParticipationDraftRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var \App\Models\Conference|null $conference */
        $conference = $this->route('conference');
        $user = $this->user();

        if (! $conference || ! $user) {
            return false;
        }

        return app(ParticipationEligibility::class)->canEditDocuments($user, $conference);
    }

    protected function failedAuthorization(): void
    {
        throw ValidationException::withMessages([
            'authorization' => 'Вы не можете изменять черновик этой заявки.',
        ]);
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [];
    }
}
