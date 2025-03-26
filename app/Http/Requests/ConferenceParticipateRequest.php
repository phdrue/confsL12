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
        return [
            'reports' => 'required|array',
            'thesises' => 'required|array',
            'reports.*' => 'required|array:topic,report_type_id,authors',
            'reports.*.topic' => 'required|string|max:2000',
            'reports.*.report_type_id' => 'required|numeric|exists:report_types,id',
            'reports.*.authors' => 'required|array',
            'reports.*.authors.*' => 'required|array:name,organization,city,country_id',
            'reports.*.authors.*.name' => 'required|string|max:500',
            'reports.*.authors.*.organization' => 'required|string|max:500',
            'reports.*.authors.*.city' => 'required|string|max:500',
            'reports.*.authors.*.country_id' => 'required|numeric|exists:countries,id',
            'thesises.*' => 'required|array:topic,text,literature,authors',
            'thesises.*.topic' => 'required|string|max:2000',
            'thesises.*.text' => 'required_if:type_id,2|string|max:23000',
            'thesises.*.literature' => 'required_if:type_id,2|string|max:23000',
            'thesises.*.authors' => 'required|array',
            'thesises.*.authors.*' => 'required|array:name,organization,city,country_id',
            'thesises.*.authors.*.name' => 'required|string|max:500',
            'thesises.*.authors.*.organization' => 'required|string|max:500',
            'thesises.*.authors.*.city' => 'required|string|max:500',
            'thesises.*.authors.*.country_id' => 'required|numeric|exists:countries,id',
        ];
    }
}
