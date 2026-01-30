<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

/**
 * @method \App\Models\Conference|null route($name = null, $parameters = [])
 * @method mixed input(string $key = null, $default = null)
 */
class CreateDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $conference = $this->route('conference');
        $typeId = (int) $this->input('type_id');

        if (! $conference) {
            return false;
        }

        return Gate::allows('can-submit-document', [$conference, $typeId]);
    }

    protected function failedAuthorization()
    {
        throw ValidationException::withMessages([
            'authorization' => 'Вы не авторизованы для отправки документа.'
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
            'type_id' => 'required|numeric|exists:document_types,id',
            'topic' => 'required|string|max:2000',
            // 'full_name' => 'required|string|max:500',
            'text' => 'required_if:type_id,2|string|max:23000',
            'literature' => 'required_if:type_id,2|string|max:23000',
            'report_type_id' => 'required_if:type_id,1|numeric|exists:report_types,id',
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
}
