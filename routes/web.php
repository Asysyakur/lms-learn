<?php

use App\Http\Controllers\Admin\MeetingController;
use App\Http\Controllers\Admin\QuizAttemptController;
use App\Http\Controllers\Admin\QuizQuestionController;
use App\Http\Controllers\Admin\QuizSetController;
use App\Http\Controllers\Admin\StepController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\LearningController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return auth()->check()
        ? redirect()->route('beranda')
        : redirect()->route('login');
});

/*
|--------------------------------------------------------------------------
| AUTH USER
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {
    Route::get('/beranda', [LearningController::class, 'index'])->name('beranda');

    Route::get('/kuis', [LearningController::class, 'quizIndex'])->name('kuis');
    Route::get('/kuis/{slug}', [LearningController::class, 'quizShow'])->name('kuis.show');
    Route::post('/kuis/{slug}', [LearningController::class, 'submitQuiz'])->name('kuis.submit');

    Route::get('/pertemuan/{id}', [LearningController::class, 'meetingShow'])->name('pertemuan');

    Route::get('/pertemuan/{id}/step/{step}', [LearningController::class, 'meetingStep'])
        ->whereNumber('step')
        ->name('pertemuan.step');

    Route::post('/pertemuan/{id}/step/{step}/complete', [LearningController::class, 'completeMeetingStep'])
        ->name('pertemuan.step.complete');

    Route::post('/pertemuan/{id}/step/{step}/response', [LearningController::class, 'saveMeetingStepResponse'])
        ->name('pertemuan.step.response');

    Route::get('/about', fn () => Inertia::render('About'))->name('about');

    // Profile settings
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update']);
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| ADMIN
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', fn () => Inertia::render('Admin/Dashboard'))->name('dashboard');

        Route::resource('meetings', MeetingController::class)->except(['show']);
        Route::resource('quiz-sets', QuizSetController::class)->except(['show']);
        Route::resource('quiz-questions', QuizQuestionController::class)->except(['show']);
        Route::get('quiz-results', [QuizAttemptController::class, 'index'])->name('quiz-results.index');
        Route::get('quiz-results/{quizSet}', [QuizAttemptController::class, 'show'])->name('quiz-results.show');
        Route::resource('users', UserController::class)->only(['index', 'edit', 'update', 'destroy']);

        Route::get('meetings/{meeting}/steps', [StepController::class, 'index'])
            ->name('meetings.steps');

        Route::post('steps', [StepController::class, 'store'])
            ->name('steps.store');

        Route::get('steps/{step}/edit', [StepController::class, 'edit'])
            ->name('steps.edit');

        Route::put('steps/{step}', [StepController::class, 'update'])
            ->name('steps.update');

        Route::delete('steps/{step}', [StepController::class, 'destroy'])
            ->name('steps.destroy');
    });

require __DIR__.'/auth.php';
