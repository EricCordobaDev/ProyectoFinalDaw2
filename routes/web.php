<?php

use App\Http\Controllers\VideojuegoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('videojuegos', [VideojuegoController::class, 'mostrarVideojuegos'])->name('videojuegos');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

