<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ConferenceController;
use App\Http\Controllers\DashboardController;

Route::get('/', [ClientController::class, 'landing'])
    ->name('home');

Route::get('conferences', [ClientController::class, 'conferences'])
    ->name('conferences.index');

Route::get('conferences/{conference}', [ClientController::class, 'conference'])
    ->name('conferences.show');



// конференции
Route::as('adm.')->prefix('adm')->group(function () {
    Route::resource('conferences', ConferenceController::class)
        ->only('index', 'show', 'store', 'edit', 'update');

    Route::put('toggle-front-page/{conference}', [ConferenceController::class, 'toggleFrontPage'])
        ->name('conferences.toggle-front-page');

    Route::put('change-state/{conference}', [ConferenceController::class, 'changeState'])
        ->name('conferences.change-state');
});


Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // client
    Route::as('client.')->group(function () {
        Route::post('participate/{conference}', [ClientController::class, 'participate'])
            ->name('conferences.participate');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
