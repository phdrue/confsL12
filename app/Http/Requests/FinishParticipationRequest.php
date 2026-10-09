<?php

namespace App\Http\Requests;

class FinishParticipationRequest extends ConferenceParticipateRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'reports' => $this->stripDocumentMeta($this->input('reports')),
            'thesises' => $this->stripDocumentMeta($this->input('thesises')),
        ]);
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function stripDocumentMeta(mixed $items): array
    {
        if (! is_array($items)) {
            return [];
        }

        return array_values(array_map(function (mixed $item): array {
            if (! is_array($item)) {
                return [];
            }

            unset($item['key'], $item['id']);

            return $item;
        }, $items));
    }
}
