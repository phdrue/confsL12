<?php

namespace App\Http\Requests;

use App\Helpers\BlockValidators;
use Illuminate\Foundation\Http\FormRequest;

class UpdateConferenceBlockRequest extends FormRequest
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
        $rules = [
            'type_id' => 'required|numeric|exists:conference_block_types,id',
            'name' => 'required|string|max:255',
        ];

        match ($this->request->get('type_id')) {
            1 => BlockValidators::getRegularTextBlockValidation($rules),
            2 => BlockValidators::getListBlockValidation($rules),
            3 => BlockValidators::getLinksBlockValidation($rules),
            4 => BlockValidators::getKeyValueBlockValidation($rules),
            5 => BlockValidators::getHeadingTextBlockValidation($rules),
            6 => BlockValidators::getDisclaimerTextBlockValidation($rules),
            7 => BlockValidators::getSeparatorBlockValidation($rules),
            9 => BlockValidators::getImagesBlockValidation($rules),
            10 => BlockValidators::getSubheaderTextBlockValidation($rules),
            default => $rules['content'] = 'required',
        };

        return $rules;
    }
}
