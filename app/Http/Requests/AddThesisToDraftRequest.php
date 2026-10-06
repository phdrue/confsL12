<?php

namespace App\Http\Requests;

use App\Services\ParticipationEligibility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class AddThesisToDraftRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var \App\Models\Conference|null $conference */
        $conference = $this->route('conference');
        $user = $this->user();

        if (! $conference || ! $user || ! $conference->allow_thesis) {
            return false;
        }

        return app(ParticipationEligibility::class)->canEditDocuments($user, $conference);
    }

    protected function failedAuthorization(): void
    {
        throw ValidationException::withMessages([
            'authorization' => 'Вы не можете добавлять тезисы в эту заявку.',
        ]);
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'topic' => 'required|string|max:2000',
            'text' => 'required|string|max:23000',
            'literature' => 'required|string|max:23000',
            'authors' => 'required|array',
            'authors.*' => 'required|array:name,organization,city,country_id',
            'authors.*.name' => 'required|string|max:500',
            'authors.*.organization' => 'required|string|max:500',
            'authors.*.city' => 'required|string|max:500',
            'authors.*.country_id' => 'required|numeric|exists:countries,id',
            'science_guides' => 'nullable|array',
            'science_guides.*' => 'required|array:name,degree,title,city,country_id,organization',
            'science_guides.*.name' => 'required|string|max:500',
            'science_guides.*.degree' => 'required|string|max:500',
            'science_guides.*.title' => 'required|string|max:500',
            'science_guides.*.city' => 'required|string|max:500',
            'science_guides.*.country_id' => 'required|numeric|exists:countries,id',
            'science_guides.*.organization' => 'required|string|max:500',
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'topic.required' => 'Укажите тему тезисов.',
            'text.required' => 'Укажите полный текст тезисов.',
            'literature.required' => 'Укажите библиографический список.',
            'authors.required' => 'Добавьте хотя бы одного автора.',
        ];
    }
}
