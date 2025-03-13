<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReorderBlocksRequest extends FormRequest
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
        // dd($this->request->all());
        // dd($this->request->get('blocks'));
        return [
            'blocks' => 'required|array',
            'blocks.*' => 'required|array:id,position',
            'blocks.*.id' => 'required|numeric|exists:conference_blocks,id',
            'blocks.*.position' => 'required|numeric',
        ];
    }
}
