<?php

namespace App\Providers;

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

        Gate::define('can-participate', function ($user, $conference) {
            return ! $user->conferences()->where('conference_id', $conference->id)->exists();
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
