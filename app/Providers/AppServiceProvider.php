<?php

namespace App\Providers;

use App\Enums\ConferenceStateEnum;
use App\Enums\Role;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Model::shouldBeStrict();
        Model::unguard();

        $this->gates();
    }

    private function gates()
    {
        Gate::define('can-participate', function ($user, $conference) {
            $doesNotParticipate = ! $user->conferences()->where('conference_id', $conference->id)->exists();
            $conferenceIsActive = $conference->state_id === ConferenceStateEnum::ACTIVE->value;
            return $doesNotParticipate && $conferenceIsActive;
        });

        Gate::define('can-submit-document', function ($user, $conference, $documentTypeId) {
            $participation = $user->conferences()->where('conference_id', $conference->id)->first();

            $participates = !is_null($participation);
            $conferenceIsActive = $conference->state_id === ConferenceStateEnum::ACTIVE->value;
            $didntSubmitYet = is_null($participation->document_id);

            $thisDocumentIsAllowed = false;
            if ($documentTypeId === 1 && $conference->allow_report) {
                $thisDocumentIsAllowed = true;
            } elseif ($documentTypeId === 2 && $conference->allow_thesis) {
                $thisDocumentIsAllowed = true;
            }
            return $participates && $conferenceIsActive && $thisDocumentIsAllowed && $didntSubmitYet;
        });

        Gate::define('is-admin', function ($user) {
            return $user->hasRole(Role::ADMIN);
        });

        Gate::define('is-user', function ($user) {
            return $user->hasRole(Role::USER);
        });

        Gate::define('is-responsible', function ($user) {
            return $user->hasRole(Role::RESPONSIBLE);
        });
    }
}
