<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ClientController;

Route::get('/', [ClientController::class, 'landing'])
    ->name('home');

Route::get('conferences', [ClientController::class, 'conferences'])
    ->name('conferences.index');

Route::get('conferences/{conference}', [ClientController::class, 'conference'])
    ->name('conferences.show');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // client
    Route::as('client.')->group(function () {
        Route::post('participate/{conference}', [ClientController::class, 'participate'])
            ->name('conferences.participate');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
