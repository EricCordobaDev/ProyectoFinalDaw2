<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\VideojuegoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        $posts = \App\Models\Post::with('user')
                ->orderByDesc('created_at')
                ->get()
                ->map(function($post) use ($user) {
                    $post->liked_by_user = $post->isLikedBy($user);
                    return $post;
                });
        return Inertia::render('dashboard', [
            'posts' => $posts
        ]);
    })->name('dashboard');
    
    // Rutas de posts
    Route::post('posts', [PostController::class, 'store'])->name('posts.store');
    Route::delete('posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
    Route::post('posts/{post}/like', [PostController::class, 'like'])->name('posts.like');
});

Route::get('games', [VideojuegoController::class, 'mostrarVideojuegos'])->name('games');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

