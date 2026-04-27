<?php

use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\MeetingController;
use App\Http\Controllers\Admin\QuizQuestionController;
use App\Http\Controllers\Admin\QuizSetController;
use App\Http\Controllers\Admin\StepController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\LearningController;
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

    Route::get('/pertemuan/{id}', [LearningController::class, 'meetingShow'])->name('pertemuan');

    Route::get('/pertemuan/{id}/step/{step}', [LearningController::class, 'meetingStep'])
        ->whereNumber('step')
        ->name('pertemuan.step');

    Route::post('/pertemuan/{id}/step/{step}/complete', [LearningController::class, 'completeMeetingStep'])
        ->name('pertemuan.step.complete');

    Route::post('/pertemuan/{id}/step/{step}/response', [LearningController::class, 'saveMeetingStepResponse'])
        ->name('pertemuan.step.response');

    Route::get('/about', fn () => Inertia::render('About'))->name('about');
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

        Route::resource('courses', CourseController::class)->except(['show']);
        Route::resource('meetings', MeetingController::class)->except(['show']);
        Route::resource('quiz-sets', QuizSetController::class)->except(['show']);
        Route::resource('quiz-questions', QuizQuestionController::class)->except(['show']);
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
