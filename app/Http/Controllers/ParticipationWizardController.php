<?php

namespace App\Http\Controllers;

use App\Http\Requests\FinishParticipationRequest;
use App\Models\Conference;
use App\Models\ConferenceUser;
use App\Models\Country;
use App\Models\Degree;
use App\Models\ReportType;
use App\Models\Title;
use App\Services\ConferenceParticipationService;
use App\Services\ParticipationDraft;
use App\Services\ParticipationEligibility;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ParticipationWizardController extends Controller
{
    public function __construct(
        private ParticipationDraft $draft,
        private ParticipationEligibility $eligibility,
        private ConferenceParticipationService $participations,
    ) {}

    public function show(Conference $conference): Response|RedirectResponse
    {
        if (! $this->eligibility->conferenceIsVisible($conference)) {
            abort(404, 'Мероприятие не найдено или только в планах');
        }

        $user = Auth::user();

        if (! $this->eligibility->canAccessWizard($user, $conference)) {
            return to_route('conferences.show', $conference)
                ->with('error', $this->eligibility->denialMessage($user, $conference));
        }

        return Inertia::render('client/conferences/participate/index', $this->pageProps($conference));
    }

    public function storeFinish(FinishParticipationRequest $request, Conference $conference): RedirectResponse
    {
        $this->participations->save($request, $conference);

        return to_route('conferences.show', $conference);
    }

    /**
     * @return array<string, mixed>
     */
    private function pageProps(Conference $conference): array
    {
        $user = Auth::user();
        $participation = ConferenceUser::query()
            ->where('conference_id', $conference->id)
            ->where('user_id', $user->id)
            ->first();

        return [
            'conference' => $conference,
            'documents' => $this->draft->fromSavedDocuments($user, $conference),
            'countries' => Country::query()->select('id', 'name')->get(),
            'degrees' => Degree::query()->select('id', 'name')->get(),
            'titles' => Title::query()->select('id', 'name')->get(),
            'reportTypes' => ReportType::query()->select('id', 'name')->get(),
            'participation' => $participation ? [
                'id' => $participation->id,
                'confirmed' => $participation->confirmed,
            ] : null,
            'canEditDocuments' => $this->eligibility->canEditDocuments($user, $conference),
            'canFinish' => $this->eligibility->canFinish($user, $conference),
            'canAddThesis' => (bool) $conference->allow_thesis && $this->eligibility->canEditDocuments($user, $conference),
            'canAddReport' => (bool) $conference->allow_report && $this->eligibility->canEditDocuments($user, $conference),
        ];
    }
}
