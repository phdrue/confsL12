<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Support\Facades\Gate;

class ConferenceParticipateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('can-participate', $this->route('conference'));
    }

    protected function failedAuthorization()
    {
        throw ValidationException::withMessages([
            'authorization' => 'You are not authorized to update this post.'
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $conference = $this->route('conference');

        $rules = [];
        if ($conference->allow_thesis) {
            $rules['thesises'] = 'nullable|array';
            $rules['thesises.*'] = 'required|array:topic,text,literature,authors';
            $rules['thesises.*.topic'] = 'required|string|max:2000';
            $rules['thesises.*.text'] = 'required_if:type_id,2|string|max:23000';
            $rules['thesises.*.literature'] = 'required_if:type_id,2|string|max:23000';
            $rules['thesises.*.authors'] = 'required|array';
            $rules['thesises.*.authors.*'] = 'required|array:name,organization,city,country_id';
            $rules['thesises.*.authors.*.name'] = 'required|string|max:500';
            $rules['thesises.*.authors.*.organization'] = 'required|string|max:500';
            $rules['thesises.*.authors.*.city'] = 'required|string|max:500';
            $rules['thesises.*.authors.*.country_id'] = 'required|numeric|exists:countries,id';
        }

        if ($conference->allow_report) {
            $rules['reports'] = 'nullable|array';
            $rules['reports.*'] = 'required|array:topic,report_type_id,authors';
            $rules['reports.*.topic'] = 'required|string|max:2000';
            $rules['reports.*.report_type_id'] = 'required|numeric|exists:report_types,id';
            $rules['reports.*.authors'] = 'required|array';
            $rules['reports.*.authors.*'] = 'required|array:name,organization,city,country_id';
            $rules['reports.*.authors.*.name'] = 'required|string|max:500';
            $rules['reports.*.authors.*.organization'] = 'required|string|max:500';
            $rules['reports.*.authors.*.city'] = 'required|string|max:500';
            $rules['reports.*.authors.*.country_id'] = 'required|numeric|exists:countries,id';
        }

        return $rules;
    }

    // [
    //     'reports' => 'required|array',
    //     'thesises' => 'required|array',
    //     'reports.*' => 'required|array:topic,report_type_id,authors',
    //     'reports.*.topic' => 'required|string|max:2000',
    //     'reports.*.report_type_id' => 'required|numeric|exists:report_types,id',
    //     'reports.*.authors' => 'required|array',
    //     'reports.*.authors.*' => 'required|array:name,organization,city,country_id',
    //     'reports.*.authors.*.name' => 'required|string|max:500',
    //     'reports.*.authors.*.organization' => 'required|string|max:500',
    //     'reports.*.authors.*.city' => 'required|string|max:500',
    //     'reports.*.authors.*.country_id' => 'required|numeric|exists:countries,id',
    //     'thesises.*' => 'required|array:topic,text,literature,authors',
    //     'thesises.*.topic' => 'required|string|max:2000',
    //     'thesises.*.text' => 'required_if:type_id,2|string|max:23000',
    //     'thesises.*.literature' => 'required_if:type_id,2|string|max:23000',
    //     'thesises.*.authors' => 'required|array',
    //     'thesises.*.authors.*' => 'required|array:name,organization,city,country_id',
    //     'thesises.*.authors.*.name' => 'required|string|max:500',
    //     'thesises.*.authors.*.organization' => 'required|string|max:500',
    //     'thesises.*.authors.*.city' => 'required|string|max:500',
    //     'thesises.*.authors.*.country_id' => 'required|numeric|exists:countries,id',
    // ];
}
