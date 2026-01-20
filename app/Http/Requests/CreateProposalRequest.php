<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateProposalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required|string|max:1000",
            "shortName" => "required|string|max:1000",
            "engShortName" => "required|string|max:1000",
            "engName" => "required|string|max:1000",
            "level" => "required|string|max:1000",
            "form" => "required|string|max:1000",
            "type" => "required|string|max:1000",
            "lang" => "required|string|max:1000",
            "date" => "required|string|max:1000",
            "endDate" => "required|string|max:1000",
            "place" => "required|string|max:1000",
            "department" => "required|string|max:1000",
            "organization" => "required|string|max:1000",
            "organizationOther" => "required|string|max:1000",
            "participationsTotal" => "required|string|max:1000",
            "participationsForeign" => "required|string|max:1000",
            "audiences" => "required|array",
            "audiences.*" => "required|string|max:1000",
            "bookType" => "required|string|max:1000",
            "topics" => "required|string|max:1000",
            "budget" => "required|string|max:1000",
            "budgetSource" => "required|string|max:1000",
            "coverageInPerson" => "required|string|max:1000",
            "coverageOnline" => "required|string|max:1000",
            "coverageProfession" => "required|string|max:1000",
            "img" => "nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048",
        ];
    }
}
