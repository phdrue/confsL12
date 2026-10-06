<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ArchiveConferenceIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'year' => ['nullable', 'integer', 'min:1990', 'max:2100'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.string' => 'Поиск должен быть строкой.',
            'name.max' => 'Поисковый запрос слишком длинный.',
            'year.integer' => 'Год должен быть числом.',
            'year.min' => 'Год слишком маленький.',
            'year.max' => 'Год слишком большой.',
        ];
    }
}
