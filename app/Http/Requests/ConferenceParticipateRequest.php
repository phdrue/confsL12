<?php

namespace App\Http\Requests;

use App\Services\ParticipationEligibility;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Validator;

/**
 * @method \App\Models\Conference|null route($name = null, $parameters = [])
 */
class ConferenceParticipateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $conference = $this->route('conference');

        if (! $conference) {
            return false;
        }

        $conferenceDate = Carbon::parse($conference->getRawOriginal('date'));

        /** @var \App\Models\User|null $user */
        $user = $this->user();

        if (! $user) {
            return false;
        }

        if ($conference->force_enroll) {
            return true;
        }

        $participates = $user->conferences()->where('conference_id', $conference->id)->exists();

        $hasReports = ! empty($this->input('reports', []));
        $hasThesises = ! empty($this->input('thesises', []));
        $hasDocuments = $hasReports || $hasThesises;

        if (! $participates) {
            if (! $hasDocuments) {
                return Gate::allows('can-participate', $conference);
            }

            $moreThanMonthAway = now()->addMonth()->lt($conferenceDate);

            return Gate::allows('can-participate', $conference) && $moreThanMonthAway;
        }

        return Gate::allows('can-manage-documents', $conference);
    }

    protected function failedAuthorization(): void
    {
        $user = $this->user();
        $conference = $this->route('conference');

        if (! $user || ! $conference) {
            throw ValidationException::withMessages([
                'authorization' => 'Вы не можете выполнить это действие.',
            ]);
        }

        $hasDocuments = ! empty($this->input('reports', [])) || ! empty($this->input('thesises', []));

        throw ValidationException::withMessages([
            'authorization' => app(ParticipationEligibility::class)->denialMessage(
                $user,
                $conference,
                $hasDocuments,
            ),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var \App\Models\Conference|null $conference */
        $conference = $this->route('conference');

        if (! $conference) {
            return [];
        }

        $rules = [];
        if ($conference->allow_thesis) {
            $rules['thesises'] = 'nullable|array';
            $rules['thesises.*'] = 'required|array:topic,text,literature,authors,science_guides';
            $rules['thesises.*.topic'] = 'required|string|max:2000';
            $rules['thesises.*.text'] = 'required_if:type_id,2|string|max:23000';
            $rules['thesises.*.literature'] = 'required_if:type_id,2|string|max:23000';
            $rules['thesises.*.authors'] = 'required|array';
            $rules['thesises.*.authors.*'] = 'required|array:name,organization,city,country_id';
            $rules['thesises.*.authors.*.name'] = 'required|string|max:500';
            $rules['thesises.*.authors.*.organization'] = 'required|string|max:500';
            $rules['thesises.*.authors.*.city'] = 'required|string|max:500';
            $rules['thesises.*.authors.*.country_id'] = 'required|numeric|exists:countries,id';
            $rules['thesises.*.science_guides'] = 'nullable|array';
            $rules['thesises.*.science_guides.*'] = 'required|array:name,degree,title,city,country_id,organization';
            $rules['thesises.*.science_guides.*.name'] = 'required|string|max:500';
            $rules['thesises.*.science_guides.*.degree'] = 'required|string|max:500';
            $rules['thesises.*.science_guides.*.title'] = 'required|string|max:500';
            $rules['thesises.*.science_guides.*.city'] = 'required|string|max:500';
            $rules['thesises.*.science_guides.*.country_id'] = 'required|numeric|exists:countries,id';
            $rules['thesises.*.science_guides.*.organization'] = 'required|string|max:500';
        }

        if ($conference->allow_report) {
            $rules['reports'] = 'nullable|array';
            $rules['reports.*'] = 'required|array:topic,report_type_id,authors,science_guides';
            $rules['reports.*.topic'] = 'required|string|max:2000';
            $rules['reports.*.report_type_id'] = 'required|numeric|exists:report_types,id';
            $rules['reports.*.authors'] = 'required|array';
            $rules['reports.*.authors.*'] = 'required|array:name,organization,city,country_id';
            $rules['reports.*.authors.*.name'] = 'required|string|max:500';
            $rules['reports.*.authors.*.organization'] = 'required|string|max:500';
            $rules['reports.*.authors.*.city'] = 'required|string|max:500';
            $rules['reports.*.authors.*.country_id'] = 'required|numeric|exists:countries,id';
            $rules['reports.*.science_guides'] = 'nullable|array';
            $rules['reports.*.science_guides.*'] = 'required|array:name,degree,title,city,country_id,organization';
            $rules['reports.*.science_guides.*.name'] = 'required|string|max:500';
            $rules['reports.*.science_guides.*.degree'] = 'required|string|max:500';
            $rules['reports.*.science_guides.*.title'] = 'required|string|max:500';
            $rules['reports.*.science_guides.*.city'] = 'required|string|max:500';
            $rules['reports.*.science_guides.*.country_id'] = 'required|numeric|exists:countries,id';
            $rules['reports.*.science_guides.*.organization'] = 'required|string|max:500';
        }

        return $rules;
    }

    /**
     * Reports alone are not accepted when both reports and thesises are allowed.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            /** @var \App\Models\Conference|null $conference */
            $conference = $this->route('conference');

            if (! $conference || ! $conference->allow_thesis || ! $conference->allow_report) {
                return;
            }

            $hasReports = ! empty($this->input('reports', []));
            $hasThesises = ! empty($this->input('thesises', []));

            if ($hasReports && ! $hasThesises) {
                $validator->errors()->add('reports', 'Подать только доклад нельзя: необходимо также подать тезис.');
            }
        });
    }
}
