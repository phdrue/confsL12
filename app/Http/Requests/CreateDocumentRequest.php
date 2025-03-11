<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class CreateDocumentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return Gate::allows('can-submit-document', [$this->route('conference'), $this->type_id]);
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
        ];
        // полное имя заявителя
        // тема

        //--доклад 1
        // формат выступления с докладом

        //--тезисы 2
        // полный текст 23к символов
        // список лит 23к символов

        //--докладчик
        // фамилия и инициалы
        // учреждение или организация
        // город
        // страна
    }
}
