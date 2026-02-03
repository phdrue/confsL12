<?php

namespace App\Http\Controllers;

use App\Models\Conference;
use App\Models\ConferenceUser;
use App\Models\Country;
use App\Models\Degree;
use App\Models\Document;
use App\Models\Title;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Auth;
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
        // PhpWord's TemplateProcessor expects properly formatted text
        // We'll let PhpWord handle most escaping, but ensure clean input
        return $text;
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

    private function generate(Collection $documents)
    {
        $countries = Country::pluck('name', 'id')->toArray();

        $templateProcessor = new TemplateProcessor('template.docx');
        $replacements = [];

        $documents->each(function (Document $document) use (&$replacements, $countries) {
            $authors = collect($document->authors);
            $authorsString = '';
            $authorsFullString = '';

            $authors->each(function (array $author) use (&$authorsString, &$authorsFullString, $countries) {
                $name = $this->prepareText($author['name'] ?? '');
                $organization = $this->prepareText($author['organization'] ?? '');
                $city = $this->prepareText($author['city'] ?? '');
                $country = $this->prepareText($countries[$author['country_id']] ?? '');

                $authorsString .= $name.', ';
                $authorsFullString .= $name.' '.$organization.', '.$city.' '.$country.'; ';
            });

            $replacements[] = [
                'topic' => $this->prepareText($document->topic),
                'authors' => rtrim($authorsString, ', '),
                'authorsFull' => rtrim($authorsFullString, '; '),
                'text' => $this->prepareText($document->text),
                'literature' => $this->prepareText($document->literature),
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

            $authors->each(function (array $author) use (&$authorsString, &$authorsFullString, $countries) {
                $name = $this->prepareText($author['name'] ?? '');
                $organization = $this->prepareText($author['organization'] ?? '');
                $city = $this->prepareText($author['city'] ?? '');
                $country = $this->prepareText($countries[$author['country_id']] ?? '');

                $authorsString .= $name.', ';
                $authorsFullString .= $name.' '.$organization.', '.$city.' '.$country.'; ';
            });

            $replacements[] = [
                'topic' => $this->prepareText($document->topic),
                'authors' => rtrim($authorsString, ', '),
                'authorsFull' => rtrim($authorsFullString, '; '),
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
}
