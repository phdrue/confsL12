<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateConferenceRequest extends FormRequest
{
    public const VK_VIDEO_URL_PATTERN = '#^https://(vk\.com|vk\.ru|vkvideo\.ru)/video_ext\.php\?#';

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
            'name' => 'required|string|max:1000',
            'description' => 'required|string|max:1500',
            'img' => 'required|file|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'video_url' => ['nullable', 'url', 'max:500', 'regex:'.self::VK_VIDEO_URL_PATTERN],
            'primary_color' => 'required|string|max:7',
            'type_id' => 'required|exists:conference_types,id',
            'date' => 'required|date',
            'allow_thesis' => 'required|boolean',
            'allow_report' => 'required|boolean',
        ];
    }
}
