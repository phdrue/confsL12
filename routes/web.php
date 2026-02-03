<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\ConferenceBlockController;
use App\Http\Controllers\ConferenceController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\EnsureCanAccessConference;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\EnsureUserIsResponsible;
use App\Models\Conference;
use App\Models\Responsibility;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/proj', fn () => inertia()->render('proj'));

Route::get('/', [ClientController::class, 'landing'])
    ->name('home');

Route::get('conferences', [ClientController::class, 'conferences'])
    ->name('conferences.index');

Route::get('conferences/plan', [ClientController::class, 'conferencesTable'])
    ->name('conferences.table');

Route::get('conferences/{conference}', [ClientController::class, 'conference'])
    ->name('conferences.show');

// Serve images from storage (supports FTP and local storage)
// Using 'files' instead of 'storage' to avoid conflict with public/storage symlink
Route::get('files/{path}', [ImageController::class, 'serve'])
    ->where('path', '.*')
    ->name('storage.serve');

// File downloads from conference blocks (public)
Route::get('blocks/{block}/download/{fileIndex}', [ConferenceBlockController::class, 'downloadFile'])
    ->name('blocks.download-file');

Route::get('contacts', [ClientController::class, 'contacts'])
    ->name('contacts');

Route::get('subscribe', [ClientController::class, 'subscribe'])
    ->name('subscribe');

// Route::get('policy', fn() => Storage::download('policy.pdf'))
//     ->name('download.policy');

Route::get('sogl1', function () {
    $file = Storage::get('sogl1.pdf');
    $mimeType = Storage::mimeType('sogl1.pdf');

    return response($file, 200)
        ->header('Content-Type', $mimeType ?: 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="sogl1.pdf"');
})->name('download.sogl1');

Route::get('sogl2', function () {
    $file = Storage::get('sogl2.pdf');
    $mimeType = Storage::mimeType('sogl2.pdf');

    return response($file, 200)
        ->header('Content-Type', $mimeType ?: 'application/pdf')
        ->header('Content-Disposition', 'inline; filename="sogl2.pdf"');
})->name('download.sogl2');

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
            ->only('store', 'destroy');

        // предложения - только админ может редактировать
        Route::resource('proposals', ProposalController::class)
            ->only('edit', 'update');

        // Admin proposal management
        Route::put('proposals/{proposal}/deny', [ProposalController::class, 'deny'])
            ->name('proposals.deny');
        Route::put('proposals/{proposal}/approve', [ProposalController::class, 'approve'])
            ->name('proposals.approve');
    });

    // responsible general
    Route::middleware([EnsureUserIsResponsible::class])->as('adm.')->prefix('adm')->group(function () {
        // конференции
        Route::resource('conferences', ConferenceController::class)
            ->only('index');

        // статистика
        Route::get('statistics', [ConferenceController::class, 'statistics'])
            ->name('statistics.index');

        // предложения
        Route::resource('proposals', ProposalController::class)
            ->only('index', 'show', 'store');

        // банк изображений
        Route::resource('images', ImageController::class)
            ->only('index', 'store', 'edit', 'update');

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

        // сборник тезисов
        Route::get('get-book/{conference}', [DocumentController::class, 'getBook'])
            ->name('conferences.get-book');

        // сборник докладов
        Route::get('get-reports-book/{conference}', [DocumentController::class, 'getReportsBook'])
            ->name('conferences.get-reports-book');

        // список присутствующих
        Route::get('get-attendance-list/{conference}', [DocumentController::class, 'getAttendanceList'])
            ->name('conferences.get-attendance-list');

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

        // starred conferences
        Route::get('starred-conferences', [ClientController::class, 'starredConferences'])
            ->name('conferences.starred');

        Route::post('star/{conference}', [ClientController::class, 'star'])
            ->name('conferences.star');

        Route::delete('unstar/{conference}', [ClientController::class, 'unstar'])
            ->name('conferences.unstar');
        // -- заявить доклад / тезисы
        // Route::post('submit-document/{conference}', [ClientController::class, 'submitDocument'])
        //     ->name('conferences.submit-document');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
