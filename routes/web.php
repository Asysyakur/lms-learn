<?php

use App\Http\Controllers\LearningController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/beranda', [LearningController::class, 'index'])->name('beranda');

    Route::get('/kuis', [LearningController::class, 'quizIndex'])->name('kuis');
    Route::get('/kuis/{slug}', [LearningController::class, 'quizShow'])->name('kuis.show');

    Route::get('/pertemuan/{id}', [LearningController::class, 'meetingShow'])->name('pertemuan');

    Route::get('/pertemuan/{id}/step/{step}', [LearningController::class, 'meetingStep'])
        ->whereNumber('step')
        ->name('pertemuan.step');

    Route::post('/pertemuan/{id}/step/{step}/complete', [LearningController::class, 'completeMeetingStep'])
        ->whereNumber('step')
        ->name('pertemuan.step.complete');

    Route::post('/pertemuan/{id}/step/{step}/response', [LearningController::class, 'saveMeetingStepResponse'])
        ->whereNumber('step')
        ->name('pertemuan.step.response');

    Route::get('/about', fn () => Inertia::render('About'))->name('about');
});
require __DIR__.'/auth.php';
