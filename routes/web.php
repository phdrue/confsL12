<?php

use App\Enums\Role;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Conference;
use App\Models\Responsibility;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ImageController;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Controllers\ClientController;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ConferenceController;
use App\Http\Controllers\ConferenceBlockController;
use App\Http\Controllers\DocumentController;
use App\Http\Middleware\EnsureCanAccessConference;
use App\Http\Middleware\EnsureUserIsResponsible;
use Illuminate\Support\Facades\Storage;

Route::get('/', [ClientController::class, 'landing'])
    ->name('home');

Route::get('conferences', [ClientController::class, 'conferences'])
    ->name('conferences.index');

Route::get('conferences/{conference}', [ClientController::class, 'conference'])
    ->name('conferences.show');

Route::get('contacts', [ClientController::class, 'contacts'])
    ->name('contacts');

Route::get('subscribe', [ClientController::class, 'subscribe'])
    ->name('subscribe');

Route::get('policy', fn() => Storage::download('policy.pdf'))
    ->name('download.policy');

// Route::get('test', function () {
//     $users = User::whereDoesntHave('responsibilities', function (Builder $query) {
//         $query->where('conference_id', 1);
//     })->get();

//     $user = User::find(1);
//     $conference = Conference::find(1);
//     dd(
//         $users,
//         $user->responsibilities()->get(),
//         $conference->responsible()->get(),
//         $conference->availableToBeResponsible()->get()
//     );
//     dd($user->responsibilities()->get());
//     dd(Responsibility::all());
// });

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    // admin
    Route::middleware([EnsureUserIsAdmin::class])->as('adm.')->prefix('adm')->group(function () {
        // пользователи
        Route::resource('users', UserController::class)
            ->except('create', 'destroy', 'update', 'edit');

        Route::put('toggle-responsible/{user}', [UserController::class, 'toggleResponsible'])
            ->name('users.toggle-responsible');

        // конференции
        Route::resource('conferences', ConferenceController::class)
            ->only('store');
    });

    // responsible general
    Route::middleware([EnsureUserIsResponsible::class])->as('adm.')->prefix('adm')->group(function () {
        // конференции
        Route::resource('conferences', ConferenceController::class)
            ->only('index');

        // предложения
        Route::resource('proposals', ProposalController::class)
            ->only('index', 'show', 'store');

        // банк изображений
        Route::resource('images', ImageController::class)
            ->only('index', 'store');

        // блоки
        Route::resource('blocks', ConferenceBlockController::class)
            ->only('store', 'update', 'destroy');
    });

    // responsible access conference
    Route::middleware([EnsureCanAccessConference::class])->as('adm.')->prefix('adm')->group(function () {
        // конференции
        Route::resource('conferences', ConferenceController::class)
            ->only('show', 'edit', 'update');

        Route::get('conferences/{conference}/participations', [ConferenceController::class, 'participations'])
            ->name('conferences.participations');

        Route::get('conferences/{conference}/responsible', [ConferenceController::class, 'responsible'])
            ->name('conferences.responsible');

        Route::put('toggle-responsible/{conference}/{user}', [ConferenceController::class, 'toggleResponsible'])
            ->name('conferences.toggle-responsible');

        Route::put('toggle-front-page/{conference}', [ConferenceController::class, 'toggleFrontPage'])
            ->name('conferences.toggle-front-page');

        Route::put('change-state/{conference}', [ConferenceController::class, 'changeState'])
            ->name('conferences.change-state');

        Route::put('toggle-confirmed/{conference}/{user}', [ConferenceController::class, 'toggleConfirmed'])
            ->name('conferences.toggle-confirmed');

        //сборник тезисов
        Route::get('get-book/{conference}', [DocumentController::class, 'getBook'])
            ->name('conferences.get-book');

        //сборник докладов
        Route::get('get-reports-book/{conference}', [DocumentController::class, 'getReportsBook'])
            ->name('conferences.get-reports-book');

        // блоки
        Route::put('blocks/reorder/{conference}', [ConferenceBlockController::class, 'reorder'])
            ->name('blocks.reorder');
    });

    // client
    Route::as('client.')->group(function () {
        // участвовать
        Route::post('participate/{conference}', [ClientController::class, 'participate'])
            ->name('conferences.participate');

        Route::get('my-thesis/{conference}', [DocumentController::class, 'myThesis'])
            ->name('conferences.my-thesis');
        //-- заявить доклад / тезисы
        // Route::post('submit-document/{conference}', [ClientController::class, 'submitDocument'])
        //     ->name('conferences.submit-document');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
