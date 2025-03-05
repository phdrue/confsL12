<?php

use App\Enums\Role;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ConferenceController;
use App\Http\Controllers\DashboardController;
use App\Http\Middleware\EnsureUserIsAdmin;

Route::get('/', [ClientController::class, 'landing'])
    ->name('home');

Route::get('conferences', [ClientController::class, 'conferences'])
    ->name('conferences.index');

Route::get('conferences/{conference}', [ClientController::class, 'conference'])
    ->name('conferences.show');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // конференции
    Route::middleware([EnsureUserIsAdmin::class])->as('adm.')->prefix('adm')->group(function () {
        Route::resource('conferences', ConferenceController::class)
            ->only('index', 'show', 'store', 'edit', 'update');

        Route::get('conferences/{conference}/participations', [ConferenceController::class, 'participations'])
            ->name('conferences.participations');

        Route::put('toggle-front-page/{conference}', [ConferenceController::class, 'toggleFrontPage'])
            ->name('conferences.toggle-front-page');

        Route::put('change-state/{conference}', [ConferenceController::class, 'changeState'])
            ->name('conferences.change-state');
    });

    // client
    Route::as('client.')->group(function () {
        // участвовать
        Route::post('participate/{conference}', [ClientController::class, 'participate'])
            ->name('conferences.participate');
        // заявить доклад / тезисы
        Route::post('submit-document/{conference}', [ClientController::class, 'submitDocument'])
            ->name('conferences.submit-document');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
