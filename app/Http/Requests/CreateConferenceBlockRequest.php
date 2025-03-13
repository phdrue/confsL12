<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateConferenceBlockRequest extends FormRequest
{
    /**
     * Indicates if the validator should stop on the first rule failure.
     *
     * @var bool
     */
    protected $stopOnFirstFailure = false;

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
        // dd($this->request->all());
        $rules = [
            'type_id' => 'required|numeric|exists:conference_block_types,id',
            'name' => 'required|string|max:255',
            'conference_id' => 'required|numeric|exists:conferences,id',
            // 'content' => 'required|array',
        ];

        match ($this->request->get('type_id')) {
            "1" => $this->getRegularTextBlockValidation($rules),
            "2" => $this->getListBlockValidation($rules),
            "3" => $this->getLinksBlockValidation($rules),
            "4" => $this->getKeyValueBlockValidation($rules),
            "5" => $this->getHeadingTextBlockValidation($rules),
            "6" => $this->getDisclaimerTextBlockValidation($rules),
            "7" => $this->getSeparatorBlockValidation($rules),
            default => $rules['content'] = 'required',
        };

        return $rules;
    }

    /**
     * getRegularTextBlockValidation
     * id - 1
     * id - 1
     *
     * @param array $rules
     * @param array $rules
     * @return void
     */
    private function getRegularTextBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array:text';
        $rules['content.text'] = 'required|string|max:1000';
    }

    /**
     * getListBlockValidation
     * id -2
     * id -2
     *
     * @param array $rules
     * @param array $rules
     * @return void
     */
    private function getListBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array';
        $rules['content.*'] = 'required|array:header,items';
        $rules['content.*.header'] = 'required|string|max:255';
        $rules['content.*.items'] = 'nullable|array';
        $rules['content.*.items.*'] = 'nullable|string|max:255';
    }

    /**
     * getLinksBlockValidation
     * id - 3
     *
     * @param array $rules
     * @return void
     */
    private function getLinksBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array';
        $rules['content.*'] = 'required|array:text,url';
        $rules['content.*.text'] = 'required|string|max:255';
        $rules['content.*.url'] = 'required|string|max:255';
    }

    /**
     * getKeyValueBlockValidation
     * id - 4
     *
     * @param array $rules
     * @return void
     */
    private function getKeyValueBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array:colorDisplay,tableDisplay,items';
        $rules['content.tableDisplay'] = 'required|boolean';
        $rules['content.colorDisplay'] = 'required|boolean';
        $rules['content.items'] = 'required|array';
        $rules['content.items.*'] = 'required|array:key,value';
        $rules['content.items.*.key'] = 'required|string|max:255';
        $rules['content.items.*.value'] = 'required|string|max:255';
    }

    /**
     * getHeadingTextBlockValidation
     * id - 5
     *
     * @param array $rules
     * @return void
     */
    private function getHeadingTextBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array:text,colorDisplay';
        $rules['content.text'] = 'required|string|max:255';
        $rules['content.colorDisplay'] = 'required|boolean';
    }

    /**
     * getDisclaimerTextBlockValidation
     * id - 6
     *
     * @param array $rules
     * @return void
     */
    private function getDisclaimerTextBlockValidation(array &$rules): void
    {
        $rules['content'] = 'required|array:text';
        $rules['content.text'] = 'required|string|max:1000';
    }

    /**
     * getSeparatorBlockValidation
     * id - 7
     *
     * @param array $rules
     * @return void
     */
    private function getSeparatorBlockValidation(array &$rules): void
    {
        $rules['content'] = 'nullable';
    }
}
