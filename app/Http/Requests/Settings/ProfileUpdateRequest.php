<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'second_name' => 'required|string|max:255',
            'organization' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'country_id' => 'required|numeric|exists:countries,id',
            'degree_id' => 'required|numeric|exists:degrees,id',
            'title_id' => 'required|numeric|exists:titles,id',
        ];
    }
}
