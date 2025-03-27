<?php

namespace App\Http\Controllers;

use App\Models\Conference;
use App\Models\ConferenceUser;
use App\Models\Country;
use App\Models\Document;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use PhpOffice\PhpWord\TemplateProcessor;

class DocumentController extends Controller
{
    public function myThesis(Conference $conference)
    {
        $participated = ConferenceUser::query()
            ->where('user_id', auth()->id())
            ->where('conference_id', $conference->id)
            ->first();

        if ($participated) {
            $documents = $participated->documents()->where('type_id', 2)->get();
            if (!$documents->isEmpty()) {
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

        if (!$documents->isEmpty()) {
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

    public function getReportsBook(Conference $conference)
    {
        $documents = Document::query()
            ->whereRelation('participation', 'conference_id', $conference->id)
            ->where('type_id', 1)
            ->with('reportType')
            ->get();

        if (!$documents->isEmpty()) {
            $file = $this->generateReports($documents);
            try {
                return response()->download($file)
                    ->deleteFileAfterSend(true);
            } catch (\Exception $e) {
                dd('error while downloading');
            }
        }
        abort(403, 'Невозможно осуществить действие');
    }

    private function generate(Collection $documents)
    {
        $countries = Country::pluck('name', 'id')->toArray();

        $templateProcessor = new TemplateProcessor('template.docx');
        $replacements = [];

        $documents->each(function (Document $document) use (&$replacements, $countries) {
            $authors = collect($document->authors);
            $authorsString = '';

            $authors->each(function (array $author) use (&$authorsString, $countries) {
                $authorsString .= $author['name'] . ' ' . $author['organization'] . ', ' . $author['city'] . ' ' . $countries[$author['country_id']] . '; ';
            });

            $replacements[] = [
                'topic' => $document->topic,
                'authors' => $authorsString,
                'text' => $document->text,
                'literature' => $document->literature,
            ];
        });

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

            $authors->each(function (array $author) use (&$authorsString, $countries) {
                $authorsString .= $author['name'] . ' ' . $author['organization'] . ', ' . $author['city'] . ' ' . $countries[$author['country_id']] . '; ';
            });

            $replacements[] = [
                'topic' => $document->topic,
                'authors' => $authorsString,
                'type' => $document->reportType->name
            ];
        });

        $templateProcessor->cloneBlock('reportBlock', 0, true, false, $replacements);

        $file = 'reports.docx';

        $fileName = $templateProcessor->saveAs($file);
        return $file;
    }
}
