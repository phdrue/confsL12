<?php

namespace App\Providers;

use App\Enums\Role;
use App\Enums\ConferenceStateEnum;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

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

        $this->rolesGates();
        $this->participationGates();

        ResetPassword::toMailUsing(function (object $notifiable, string $token) {
            return (new MailMessage)
                ->subject('Сброс пароля')
                ->greeting('Здравствуйте!')
                ->line('Вы получили это письмо, потому что мы получили запрос на сброс пароля для вашего аккаунта.')
                ->salutation('С уважением, Конференции КГМУ')
                ->action('Сброс', url(route('password.reset', [
                    'token' => $token,
                    'email' => $notifiable->getEmailForPasswordReset(),
                ], false)));
        });

        VerifyEmail::toMailUsing(function (object $notifiable, string $url) {
            return (new MailMessage)
                ->subject('Подтверждение электронной почты')
                ->greeting('Здравствуйте!')
                ->subject('Подтверждение электронной почты')
                ->line('Нажмите кнопку ниже, чтобы подтвердить свой адрес электронной почты. Если вы делаете это с другого устройства, предварительно вам будет необходимо снова войти в свой аккаунт.')
                ->salutation('С уважением, Конференции КГМУ')
                ->action('Подтвердить', $url);
        });
    }

    private function participationGates(): void
    {
        Gate::define('can-participate', function ($user, $conference) {
            // Allow participation if conference is active
            // User can participate once, but can manage documents after participation
            $conferenceIsActive = $conference->state_id === ConferenceStateEnum::ACTIVE->value;
            return $conferenceIsActive;
        });

        Gate::define('can-manage-documents', function ($user, $conference) {
            // User can manage documents if they participate and conference is active
            $participates = $user->conferences()->where('conference_id', $conference->id)->exists();
            $conferenceIsActive = $conference->state_id === ConferenceStateEnum::ACTIVE->value;
            return $participates && $conferenceIsActive;
        });
    }

    private function rolesGates()
    {
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

    public function old()
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
    }
}
