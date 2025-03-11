<?php

namespace App\Http\Requests;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\ValidationException;

class SubmitDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        // dd($this->all());
        // return Gate::allows('can-submit-document', [$this->route('conference'), $this->route('type_id')]);
        return true;
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
            //
        ];
    }
}
