<?php

namespace App\Providers;

use App\Enums\ConferenceStateEnum;
use App\Enums\Role;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Support\Facades\Gate;
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
            if ($conference->force_enroll) {
                return true;
            }

            $conferenceIsActive = $conference->state_id === ConferenceStateEnum::ACTIVE->value;
            $profileIsComplete = $this->userHasCompleteProfile($user);
            $conferenceInFuture = now()->lt($conference->date);

            return $conferenceIsActive && $profileIsComplete && $conferenceInFuture;
        });

        Gate::define('can-manage-documents', function ($user, $conference) {
            $participates = $user->conferences()->where('conference_id', $conference->id)->exists();

            if ($conference->force_enroll) {
                return $participates;
            }

            $conferenceIsActive = $conference->state_id === ConferenceStateEnum::ACTIVE->value;
            $moreThanMonthAway = now()->addMonth()->lt($conference->date);

            return $participates && $conferenceIsActive && $moreThanMonthAway;
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

    private function userHasCompleteProfile($user): bool
    {
        $requiredFields = [
            'first_name',
            'last_name',
            'second_name',
            'organization',
            'position',
            'city',
            'phone',
            'country_id',
            'degree_id',
            'title_id',
        ];

        foreach ($requiredFields as $field) {
            if (empty($user->$field)) {
                return false;
            }
        }

        return true;
    }
}
