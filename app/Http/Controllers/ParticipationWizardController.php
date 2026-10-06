<?php

namespace App\Http\Controllers;

use App\Http\Requests\AddReportToDraftRequest;
use App\Http\Requests\AddThesisToDraftRequest;
use App\Http\Requests\FinishParticipationRequest;
use App\Http\Requests\ModifyParticipationDraftRequest;
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

    public function choice(Conference $conference): Response
    {
        $this->ensureWizardAccessible($conference);

        return Inertia::render('client/conferences/participate/choice', $this->pageProps($conference));
    }

    public function thesis(Conference $conference): Response
    {
        $this->ensureCanEditKind($conference, 'thesis');

        return Inertia::render('client/conferences/participate/thesis', $this->pageProps($conference));
    }

    public function storeThesis(AddThesisToDraftRequest $request, Conference $conference): RedirectResponse
    {
        $this->ensureCanEditKind($conference, 'thesis');

        $this->draft->addThesis(Auth::user(), $conference, $request->validated());

        return back();
    }

    public function destroyThesis(ModifyParticipationDraftRequest $request, Conference $conference, string $item): RedirectResponse
    {
        $this->ensureCanEditKind($conference, 'thesis');

        if (! $this->draft->remove(Auth::user(), $conference, 'thesises', $item)) {
            abort(404);
        }

        return back();
    }

    public function report(Conference $conference): Response
    {
        $this->ensureCanEditKind($conference, 'report');

        return Inertia::render('client/conferences/participate/report', $this->pageProps($conference));
    }

    public function storeReport(AddReportToDraftRequest $request, Conference $conference): RedirectResponse
    {
        $this->ensureCanEditKind($conference, 'report');

        $this->draft->addReport(Auth::user(), $conference, $request->validated());

        return back();
    }

    public function destroyReport(ModifyParticipationDraftRequest $request, Conference $conference, string $item): RedirectResponse
    {
        $this->ensureCanEditKind($conference, 'report');

        if (! $this->draft->remove(Auth::user(), $conference, 'reports', $item)) {
            abort(404);
        }

        return back();
    }

    public function finish(Conference $conference): Response
    {
        $this->ensureCanFinish($conference);

        return Inertia::render('client/conferences/participate/finish', $this->pageProps($conference));
    }

    public function storeFinish(FinishParticipationRequest $request, Conference $conference): RedirectResponse
    {
        $this->participations->save($request, $conference);
        $this->draft->clear(Auth::user(), $conference);

        return to_route('conferences.show', $conference);
    }

    public function reset(ModifyParticipationDraftRequest $request, Conference $conference): RedirectResponse
    {
        $this->ensureWizardAccessible($conference);
        $this->draft->reset(Auth::user(), $conference);

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
            'draft' => $this->draft->get($user, $conference),
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

    private function ensureWizardAccessible(Conference $conference): void
    {
        if (! $this->eligibility->conferenceIsVisible($conference)) {
            abort(404, 'Мероприятие не найдено или только в планах');
        }

        if (! $this->eligibility->canAccessWizard(Auth::user(), $conference)) {
            abort(403);
        }
    }

    private function ensureCanEditKind(Conference $conference, string $kind): void
    {
        $this->ensureWizardAccessible($conference);

        $allowed = $kind === 'thesis' ? $conference->allow_thesis : $conference->allow_report;

        if (! $allowed || ! $this->eligibility->canEditDocuments(Auth::user(), $conference)) {
            abort(403);
        }
    }

    private function ensureCanFinish(Conference $conference): void
    {
        $this->ensureWizardAccessible($conference);

        if (! $this->eligibility->canFinish(Auth::user(), $conference)) {
            abort(403);
        }
    }
}
