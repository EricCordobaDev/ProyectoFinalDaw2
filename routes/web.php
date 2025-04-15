<?php

use App\Http\Controllers\MessageController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideojuegoController;
use App\Http\Controllers\FollowerController;
use App\Http\Controllers\ReviewController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ruta principal
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Rutas públicas
Route::get('games', [VideojuegoController::class, 'mostrarVideojuegos'])->name('games');
Route::get('games/{game}', [VideojuegoController::class, 'show'])->name('games.show');
Route::get('profile', [UserController::class, 'index'])->name('profile');

// Rutas para reviews (acceso público para ver)
Route::get('games/{game}/reviews', [ReviewController::class, 'index'])->name('games.reviews.index');

// Rutas protegidas por autenticación
Route::middleware(['auth'])->group(function () {
    // Dashboard
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
    
    // Rutas de mensajes
    Route::prefix('messages')->group(function () {
        Route::get('/', [MessageController::class, 'index'])->name('messages.index');
        Route::post('/', [MessageController::class, 'store'])->name('messages.store');
        Route::get('/conversation/{user}', [MessageController::class, 'getConversation'])->name('messages.conversation');
        Route::delete('/{message}', [MessageController::class, 'destroy'])->name('messages.destroy');
    });
    
    // Rutas de posts
    Route::prefix('posts')->group(function () {
        Route::post('/', [PostController::class, 'store'])->name('posts.store');
        Route::get('/{post}', [PostController::class, 'show'])->name('posts.show');       
        Route::post('/{post}/like', [PostController::class, 'like'])->name('posts.like');
        Route::post('/{post}/comments', [\App\Http\Controllers\CommentController::class, 'store'])->name('comments.store');
       
    });

    // Rutas de seguidores
    Route::prefix('users')->group(function () {
        Route::post('/{user}/follow', [FollowerController::class, 'follow'])->name('users.follow');
        Route::delete('/{user}/unfollow', [FollowerController::class, 'unfollow'])->name('users.unfollow');
        Route::get('/{user}/followers', [FollowerController::class, 'showFollowers'])->name('users.followers');
        Route::get('/{user}/following', [FollowerController::class, 'showFollowing'])->name('users.following');
    });
    
    // Rutas de juegos
    Route::post('/games/save/{id}', [VideojuegoController::class, 'saveGame'])->name('games.save');
    Route::delete('/user/games/{game}', [UserController::class, 'destroyGame'])->name('user.games.destroy');
    
    // Rutas para reviews (protegidas)
    Route::post('/games/{game}/reviews', [ReviewController::class, 'store'])->name('games.reviews.store');
    Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('games.reviews.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('games.reviews.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

