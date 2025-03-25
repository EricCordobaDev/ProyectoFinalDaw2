<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideojuegoController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
     Route::get('/messages', [MessageController::class, 'index'])->name('messages.index');
    Route::post('/messages', [MessageController::class, 'store'])->name('messages.store');
    Route::get('/messages/conversation/{user}', [MessageController::class, 'getConversation'])->name('messages.conversation');
    Route::delete('/messages/{message}', [MessageController::class, 'destroy'])->name('messages.destroy');
    
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
    Route::post('posts/{post}/like', [PostController::class, 'like'])->name('posts.like');
});

Route::get('games', [VideojuegoController::class, 'mostrarVideojuegos'])->name('games');

Route::post('/games/save/{id}', [VideojuegoController::class, 'saveGame'])->middleware(['auth'])->name('games.save');

Route::delete('/user/games/{game}', [UserController::class, 'destroyGame'])
    ->middleware(['auth'])
    ->name('user.games.destroy');
    
Route::get('profile', [UserController::class, 'index'])->name('profile');

Route::get('messages', [MessageController::class, 'index'])->name('messages');



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

