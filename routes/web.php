<?php

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
    Route::get('/beranda', fn () => Inertia::render('Beranda'))->name('beranda');

    Route::get('/kuis', fn () => Inertia::render('Kuis'))->name('kuis');

    Route::get('/pertemuan/{id}', function ($id) {
        return Inertia::render('Pertemuan', [
            'id' => $id
        ]);
    })->name('pertemuan');

    Route::get('/pertemuan/{id}/step/{step}', function ($id, $step) {
        return Inertia::render('Pertemuan/StepPage', [
            'id' => $id,
            'step' => (int) $step,
        ]);
    })->whereNumber('step')->name('pertemuan.step');

    Route::get('/about', fn () => Inertia::render('About'))->name('about');
});
require __DIR__.'/auth.php';
