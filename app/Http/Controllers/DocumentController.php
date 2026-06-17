<?php

namespace App\Http\Controllers;

use App\Models\Conference;
use App\Models\ConferenceUser;
use App\Models\Country;
use App\Models\Degree;
use App\Models\Document;
use App\Models\Title;
use App\Support\DocxText;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpWord\TemplateProcessor;

class DocumentController extends Controller
{
    /**
     * Sanitize text for DOCX generation
     * Removes non-printable characters and properly escapes XML entities
     */
    private function sanitizeForDocx(?string $text): string
    {
        if (empty($text)) {
            return '';
        }

        // Remove null bytes and other control characters (except newlines, tabs, carriage returns)
        $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text);

        // Normalize line endings
        $text = str_replace(["\r\n", "\r"], "\n", $text);

        // Remove zero-width characters
        $text = preg_replace('/[\x{200B}-\x{200D}\x{FEFF}]/u', '', $text);

        // Replace non-breaking spaces with regular spaces
        $text = str_replace("\xC2\xA0", ' ', $text);

        // Trim whitespace
        $text = trim($text);

        return $text;
    }

    /**
     * Escape XML entities for PhpWord TemplateProcessor
     * PhpWord handles some escaping, but we need to ensure proper XML structure
     */
    private function escapeForXml(string $text): string
    {
        if ($text === '') {
            return '';
        }

        // Keep only XML 1.0 valid characters.
        $text = preg_replace('/[^\x{9}\x{A}\x{D}\x{20}-\x{D7FF}\x{E000}-\x{FFFD}\x{10000}-\x{10FFFF}]/u', '', $text) ?? '';

        // Escape XML entities explicitly to avoid malformed DOCX XML.
        return htmlspecialchars($text, ENT_QUOTES | ENT_XML1 | ENT_SUBSTITUTE, 'UTF-8');
    }

    /**
     * Prepare text for DOCX insertion
     * Combines sanitization and preparation
     */
    private function prepareText(?string $text): string
    {
        $text = $this->sanitizeForDocx($text);

        return $this->escapeForXml($text);
    }

    public function myThesis(Conference $conference)
    {
        $participated = ConferenceUser::query()
            ->where('user_id', Auth::id())
            ->where('conference_id', $conference->id)
            ->first();

        if ($participated) {
            $documents = $participated->documents()->where('type_id', 2)->get();
            if (! $documents->isEmpty()) {
                $file = $this->generate($documents);
                try {
                    return response()->download($file)
                        ->deleteFileAfterSend(true);
                } catch (\Exception $e) {
                    dd('error while downloading');
                }
            }
            abort(403, 'Невозможно осуществить действие');
        }
        abort(403, 'Невозможно осуществить действие');
    }

    public function getBook(Conference $conference)
    {
        $documents = Document::query()
            ->whereRelation('participation', 'conference_id', $conference->id)
            ->where('type_id', 2)
            ->where('is_approved', true)
            ->get();

        if (! $documents->isEmpty()) {
            try {
                $file = $this->generate($documents);

                return response()->download($file)
                    ->deleteFileAfterSend(true);
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Ошибка при генерации файла: '.$e->getMessage(),
                ], 500);
            }
        }

        return response()->json([
            'error' => 'Нет документов для генерации сборника тезисов',
        ], 404);
    }

    public function getReportsBook(Conference $conference)
    {
        $documents = Document::query()
            ->whereRelation('participation', 'conference_id', $conference->id)
            ->where('type_id', 1)
            ->where('is_approved', true)
            ->with('reportType')
            ->get();

        if (! $documents->isEmpty()) {
            try {
                $file = $this->generateReports($documents);

                return response()->download($file)
                    ->deleteFileAfterSend(true);
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Ошибка при генерации файла: '.$e->getMessage(),
                ], 500);
            }
        }

        return response()->json([
            'error' => 'Нет документов для генерации сборника докладов',
        ], 404);
    }

    public function getAttendanceList(Conference $conference)
    {
        $users = $conference->users()->get();

        if (! $users->isEmpty()) {
            try {
                $file = $this->generateAttendanceList($conference, $users);

                return response()->download($file)
                    ->deleteFileAfterSend(true);
            } catch (\Exception $e) {
                return response()->json([
                    'error' => 'Ошибка при генерации файла: '.$e->getMessage(),
                ], 500);
            }
        }

        return response()->json([
            'error' => 'Нет участников для генерации списка присутствующих',
        ], 404);
    }

    public function getParticipantsExcel(Conference $conference)
    {
        $users = $conference->users()->get();

        if ($users->isEmpty()) {
            return response()->json([
                'error' => 'Нет участников для экспорта',
            ], 404);
        }

        $spreadsheet = $this->generateParticipantsExcel($users);
        $writer = new Xlsx($spreadsheet);
        $fileName = 'participants-'.$conference->id.'.xlsx';

        return response()->streamDownload(function () use ($writer): void {
            $writer->save('php://output');
        }, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);
    }

    public function getCertificatesBook(Request $request, Conference $conference)
    {
        $users = $conference->users()
            ->wherePivot('confirmed', true)
            ->get();

        if ($users->isEmpty()) {
            return response()->json([
                'error' => 'Нет участников для генерации сборника сертификатов',
            ], 404);
        }

        $templatePath = public_path('certificate.docx');
        if (! file_exists($templatePath)) {
            return response()->json([
                'error' => 'Не найден шаблон сертификатов: certificate.docx',
            ], 404);
        }

        $validated = $request->validate([
            'conference_name' => ['nullable', 'string', 'max:255'],
            'data' => ['nullable', 'string', 'max:255'],
            'date' => ['nullable', 'date'],
        ]);

        $conferenceName = trim((string) ($validated['conference_name'] ?? ''));
        if ($conferenceName === '') {
            $conferenceName = $conference->name;
        }

        $conferenceDate = $conference->date;
        if (! empty($validated['date'])) {
            $conferenceDate = Carbon::parse($validated['date']);
        }

        $dateText = trim((string) ($validated['data'] ?? ''));

        try {
            $file = $this->generateCertificatesBook(
                $users,
                $templatePath,
                $conferenceName,
                $conferenceDate,
                $dateText,
            );

            return response()->download($file)
                ->deleteFileAfterSend(true);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Ошибка при генерации файла: '.$e->getMessage(),
            ], 500);
        }
    }

    private function generateCertificatesBook(
        \Illuminate\Support\Collection $users,
        string $templatePath,
        string $conferenceNameValue,
        ?Carbon $conferenceDateValue,
        string $dateText,
    ): string {
        $templateProcessor = new TemplateProcessor($templatePath);

        $conferenceName = $this->prepareText($conferenceNameValue);
        $translatedDate = $conferenceDateValue instanceof Carbon
            ? $conferenceDateValue->copy()->locale('ru')->translatedFormat('j F Y').' года'
            : '';
        $conferenceDateLong = $this->prepareText($dateText !== '' ? $dateText : $translatedDate);

        $values = [];
        $index = 1;

        foreach ($users as $user) {
            $lastName = $this->prepareText($user->last_name ?? '');
            $firstName = $this->prepareText($user->first_name ?? '');
            $secondName = $this->prepareText($user->second_name ?? '');

            $fullName = trim(implode(' ', array_filter([$lastName, $firstName, $secondName])));

            $values[] = [
                'index' => $index,
                'lastName' => $lastName,
                'firstName' => $firstName,
                'secondName' => $secondName,
                'fullName' => $fullName,
                'conferenceName' => $conferenceName,
                'conferenceDate' => $this->prepareText($conferenceDateValue?->format('d.m.Y') ?? ''),
                'conference' => $conferenceName,
                'participant' => $fullName,
                'date' => $conferenceDateLong,
                'data' => $conferenceDateLong,
            ];

            $index++;
        }

        // Clone the Word content control block named "block" once per participant.
        // Template placeholders inside the block can use: ${index}, ${lastName}, ${firstName}, ${secondName}, ${fullName}, ${conferenceName}, ${conferenceDate}
        $templateProcessor->cloneBlock('block', 0, true, false, $values);

        $file = storage_path('app/certificates-'.Str::uuid().'.docx');
        $templateProcessor->saveAs($file);

        return $file;
    }

    private function generate(Collection $documents)
    {
        $countries = Country::pluck('name', 'id')->toArray();

        $templateProcessor = new TemplateProcessor('template.docx');
        $replacements = [];

        $documents->each(function (Document $document) use (&$replacements, $countries) {
            $authors = collect($document->authors);
            $authorsString = '';
            $authorsFullString = '';
            $scienceGuides = collect($document->science_guides ?? []);
            $scienceGuidesFullString = '';

            $authors->each(function (array $author) use (&$authorsString, &$authorsFullString, $countries) {
                $name = $this->prepareText($author['name'] ?? '');
                $organization = $this->prepareText($author['organization'] ?? '');
                $city = $this->prepareText($author['city'] ?? '');
                $country = $this->prepareText($countries[$author['country_id']] ?? '');

                $authorsString .= $name.', ';
                $authorsFullString .= $name.' '.$organization.', '.$city.' '.$country.'; ';
            });

            $scienceGuides->each(function (mixed $guide) use (&$scienceGuidesFullString, $countries) {
                if (! is_array($guide)) {
                    $guide = ['name' => (string) $guide];
                }

                $name = $this->prepareText($guide['name'] ?? '');
                $degree = $this->prepareText($guide['degree'] ?? '');
                $title = $this->prepareText($guide['title'] ?? '');
                $organization = $this->prepareText($guide['organization'] ?? '');
                $city = $this->prepareText($guide['city'] ?? '');
                $countryId = $guide['country_id'] ?? null;
                $countryName = $countryId !== null && isset($countries[$countryId])
                    ? $this->prepareText($countries[$countryId])
                    : '';

                $parts = array_filter([
                    $name,
                    $degree,
                    $title,
                    $organization,
                    $city,
                    $countryName,
                ]);

                if (! empty($parts)) {
                    $scienceGuidesFullString .= implode(', ', $parts).'; ';
                }
            });

            $replacements[] = [
                'topic' => $this->prepareText($document->topic),
                'authors' => rtrim($authorsString, ', '),
                'authorsFull' => rtrim($authorsFullString, '; '),
                'scienceGuidesFull' => rtrim($scienceGuidesFullString, '; '),
                'text' => DocxText::prepareForTemplate($document->text),
                'literature' => DocxText::prepareForTemplate($document->literature),
            ];
        });

        $replacements = collect($replacements)->sortBy('authors')->toArray();

        $templateProcessor->cloneBlock('thesisBlock', 0, true, false, $replacements);

        $file = 'thesises.docx';

        $fileName = $templateProcessor->saveAs($file);

        return $file;
    }

    private function generateReports(Collection $documents)
    {
        $countries = Country::pluck('name', 'id')->toArray();

        $templateProcessor = new TemplateProcessor('reportsTemplate.docx');
        $replacements = [];

        $documents->each(function (Document $document) use (&$replacements, $countries) {
            $authors = collect($document->authors);
            $authorsString = '';
            $authorsFullString = '';
            $scienceGuides = collect($document->science_guides ?? []);
            $scienceGuidesFullString = '';

            $authors->each(function (array $author) use (&$authorsString, &$authorsFullString, $countries) {
                $name = $this->prepareText($author['name'] ?? '');
                $organization = $this->prepareText($author['organization'] ?? '');
                $city = $this->prepareText($author['city'] ?? '');
                $country = $this->prepareText($countries[$author['country_id']] ?? '');

                $authorsString .= $name.', ';
                $authorsFullString .= $name.' '.$organization.', '.$city.' '.$country.'; ';
            });

            $scienceGuides->each(function (mixed $guide) use (&$scienceGuidesFullString, $countries) {
                if (! is_array($guide)) {
                    $guide = ['name' => (string) $guide];
                }

                $name = $this->prepareText($guide['name'] ?? '');
                $degree = $this->prepareText($guide['degree'] ?? '');
                $title = $this->prepareText($guide['title'] ?? '');
                $organization = $this->prepareText($guide['organization'] ?? '');
                $city = $this->prepareText($guide['city'] ?? '');
                $countryId = $guide['country_id'] ?? null;
                $countryName = $countryId !== null && isset($countries[$countryId])
                    ? $this->prepareText($countries[$countryId])
                    : '';

                $parts = array_filter([
                    $name,
                    $degree,
                    $title,
                    $organization,
                    $city,
                    $countryName,
                ]);

                if (! empty($parts)) {
                    $scienceGuidesFullString .= implode(', ', $parts).'; ';
                }
            });

            $replacements[] = [
                'topic' => $this->prepareText($document->topic),
                'authors' => rtrim($authorsString, ', '),
                'authorsFull' => rtrim($authorsFullString, '; '),
                'scienceGuidesFull' => rtrim($scienceGuidesFullString, '; '),
                'type' => $this->prepareText($document->reportType->name ?? ''),
            ];
        });

        $replacements = collect($replacements)->sortBy('authors')->toArray();

        $templateProcessor->cloneBlock('reportBlock', 0, true, false, $replacements);

        $file = 'reports.docx';

        $fileName = $templateProcessor->saveAs($file);

        return $file;
    }

    private function generateAttendanceList(Conference $conference, Collection $users)
    {
        $degrees = Degree::pluck('name', 'id')->toArray();
        $titles = Title::pluck('name', 'id')->toArray();

        $templateProcessor = new TemplateProcessor('attendance.docx');

        // Replace conference name and date
        $templateProcessor->setValue('conferenceName', $this->prepareText($conference->name));
        $templateProcessor->setValue('conferenceDate', $this->prepareText($conference->date->format('d.m.Y')));

        // Prepare values for cloning rows (starting from index 1)
        $values = [];
        $index = 1;
        foreach ($users as $user) {
            $values[] = [
                'index' => $index,
                'lastName' => $this->prepareText($user->last_name ?? ''),
                'firstName' => $this->prepareText($user->first_name ?? ''),
                'secondName' => $this->prepareText($user->second_name ?? ''),
                'degree' => $this->prepareText($degrees[$user->degree_id] ?? ''),
                'title' => $this->prepareText($titles[$user->title_id] ?? ''),
                'phone' => $this->prepareText($user->phone ?? ''),
            ];
            $index++;
        }

        if (! empty($values)) {
            $templateProcessor->cloneRowAndSetValues('index', $values);
        }

        $file = 'attendanceGen.docx';

        $fileName = $templateProcessor->saveAs($file);

        return $file;
    }

    private function generateParticipantsExcel(Collection $users): Spreadsheet
    {
        $degrees = Degree::pluck('name', 'id')->toArray();
        $titles = Title::pluck('name', 'id')->toArray();

        $spreadsheet = new Spreadsheet;
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Участники');

        $headers = [
            '#',
            'Фамилия',
            'Имя',
            'Отчество',
            'Адрес электронной почты',
            'Ученая степень',
            'Ученое звание',
            'Телефон',
        ];

        foreach ($headers as $columnIndex => $header) {
            $sheet->setCellValueByColumnAndRow($columnIndex + 1, 1, $header);
        }

        $rowNumber = 2;
        $index = 1;

        foreach ($users as $user) {
            $sheet->setCellValueByColumnAndRow(1, $rowNumber, $index);
            $sheet->setCellValueByColumnAndRow(2, $rowNumber, $user->last_name ?? '');
            $sheet->setCellValueByColumnAndRow(3, $rowNumber, $user->first_name ?? '');
            $sheet->setCellValueByColumnAndRow(4, $rowNumber, $user->second_name ?? '');
            $sheet->setCellValueByColumnAndRow(5, $rowNumber, $user->email ?? '');
            $sheet->setCellValueByColumnAndRow(6, $rowNumber, $degrees[$user->degree_id] ?? '');
            $sheet->setCellValueByColumnAndRow(7, $rowNumber, $titles[$user->title_id] ?? '');
            $sheet->setCellValueByColumnAndRow(8, $rowNumber, $user->phone ?? '');

            $rowNumber++;
            $index++;
        }

        foreach (range(1, count($headers)) as $column) {
            $sheet->getColumnDimensionByColumn($column)->setAutoSize(true);
        }

        return $spreadsheet;
    }
}
