<?php

namespace App\Exports;

use App\Exports\PhpWord\LandscapeDomPdfWriter;
use App\Models\Conference;
use App\Queries\PlannedConferencesQuery;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use PhpOffice\PhpWord\IOFactory;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Settings;

class PlannedConferencesExporter
{
    /**
     * @return array<int, array{
     *     name: string,
     *     start_date: string,
     *     end_date: string,
     *     organization: string,
     *     form: string,
     *     book_type: string
     * }>
     */
    public function rows(): array
    {
        return PlannedConferencesQuery::getForExport()
            ->map(fn (Conference $conference): array => $this->rowFromConference($conference))
            ->values()
            ->all();
    }

    /**
     * @return array{
     *     name: string,
     *     start_date: string,
     *     end_date: string,
     *     organization: string,
     *     form: string,
     *     book_type: string
     * }
     */
    public function rowFromConference(Conference $conference): array
    {
        $payload = $conference->proposal?->payload ?? [];

        $organizations = array_values(array_filter([
            trim((string) ($payload['organization'] ?? '')),
            ...array_filter(array_map(
                trim(...),
                explode(';', (string) ($payload['organizationOther'] ?? ''))
            )),
        ]));

        return [
            'name' => (string) ($payload['name'] ?? $conference->name ?? '—'),
            'start_date' => $this->formatDate($payload['date'] ?? $conference->date),
            'end_date' => $this->formatDate($payload['endDate'] ?? null),
            'organization' => $organizations !== [] ? implode("\n", $organizations) : '—',
            'form' => (string) ($payload['form'] ?? '—'),
            'book_type' => (string) ($payload['bookType'] ?? '—'),
        ];
    }

    public function buildDocument(): PhpWord
    {
        $rows = $this->rows();
        $phpWord = new PhpWord;
        $section = $phpWord->addSection([
            'orientation' => 'landscape',
        ]);

        $section->addText('План мероприятий', ['bold' => true, 'size' => 14]);
        $section->addTextBreak();

        $table = $section->addTable([
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 80,
        ]);

        $headers = [
            'Название',
            'Дата начала',
            'Дата окончания',
            'Организатор',
            'Форма проведения',
            'Тип сборника',
        ];

        $table->addRow();
        foreach ($headers as $header) {
            $table->addCell(1800)->addText($header, ['bold' => true]);
        }

        foreach ($rows as $row) {
            $table->addRow();
            $table->addCell(2800)->addText($row['name']);
            $table->addCell(1400)->addText($row['start_date']);
            $table->addCell(1400)->addText($row['end_date']);
            $table->addCell(2200)->addText($row['organization']);
            $table->addCell(1800)->addText($row['form']);
            $table->addCell(1800)->addText($row['book_type']);
        }

        return $phpWord;
    }

    public function toDocxFile(): string
    {
        $file = storage_path('app/planned-conferences-'.Str::uuid().'.docx');
        IOFactory::createWriter($this->buildDocument(), 'Word2007')->save($file);

        return $file;
    }

    public function toPdfBinary(): string
    {
        $this->configurePdfRenderer();

        $file = storage_path('app/planned-conferences-'.Str::uuid().'.pdf');
        (new LandscapeDomPdfWriter($this->buildDocument()))->save($file);

        $binary = file_get_contents($file);
        unlink($file);

        return $binary === false ? '' : $binary;
    }

    private function configurePdfRenderer(): void
    {
        Settings::setPdfRenderer(
            Settings::PDF_RENDERER_DOMPDF,
            base_path('vendor/dompdf/dompdf')
        );

        Settings::setPdfRendererOptions([
            'font' => 'DejaVu Sans',
        ]);
    }

    private function formatDate(mixed $date): string
    {
        if ($date === null || $date === '') {
            return '—';
        }

        return Carbon::parse($date)->format('d.m.Y');
    }
}
