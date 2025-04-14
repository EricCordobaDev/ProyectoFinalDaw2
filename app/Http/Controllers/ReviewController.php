<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Models\Game;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReviewController extends Controller
{
    /**
     * Muestra todas las reviews de un juego específico
     * 
     * @param Game $game
     * @return \Inertia\Response
     */
    public function index(Game $game)
    {
        $reviews = $game->reviews()->with('user')->get();
        $userReview = null;
        
        if (Auth::check()) {
            $userReview = $game->reviews()
                ->where('user_id', Auth::id())
                ->first();
        }
        
        return Inertia::render('games/reviews', [
            'game' => $game,
            'reviews' => $reviews,
            'userReview' => $userReview,
            'canReview' => Auth::check() && !$userReview
        ]);
    }

    /**
     * Almacena una nueva review en la base de datos
     * 
     * @param Request $request
     * @param Game $game
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Game $game)
    {
        $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);
        
        // Verificar si el usuario ya tiene una review para este juego
        $existingReview = Review::where('user_id', Auth::id())
            ->where('game_id', $game->id)
            ->first();
            
        if ($existingReview) {
            return redirect()->back()->with('error', 'Ya has escrito una review para este juego');
        }
        
        $review = new Review([
            'user_id' => Auth::id(),
            'game_id' => $game->id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);
        
        $review->save();
        
        // Actualizar la valoración del juego
        $this->actualizarValoracionJuego($game->id);
        
        return redirect()->back()->with('success', 'Tu review ha sido publicada correctamente');
    }

    /**
     * Actualiza una review existente
     * 
     * @param Request $request
     * @param Review $review
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Review $review)
    {
        // Verificar que el usuario sea el dueño de la review
        if ($review->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'No tienes permiso para editar esta review');
        }
        
        $request->validate([
            'rating' => 'required|numeric|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);
        
        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);
        
        // Actualizar la valoración del juego
        $this->actualizarValoracionJuego($review->game_id);
        
        return redirect()->back()->with('success', 'Tu review ha sido actualizada correctamente');
    }

    /**
     * Elimina una review
     * 
     * @param Review $review
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Review $review)
    {
        // Verificar que el usuario sea el dueño de la review
        if ($review->user_id !== Auth::id()) {
            return redirect()->back()->with('error', 'No tienes permiso para eliminar esta review');
        }
        
        $gameId = $review->game_id;
        $review->delete();
        
        // Actualizar la valoración del juego
        $this->actualizarValoracionJuego($gameId);
        
        return redirect()->back()->with('success', 'Tu review ha sido eliminada correctamente');
    }
    
    /**
     * Actualiza la valoración de un juego basándose en las reviews de los usuarios
     * 
     * @param int $gameId ID del juego a actualizar
     * @return void
     */
    private function actualizarValoracionJuego($gameId)
    {
        // Obtener el juego
        $game = Game::find($gameId);
        if (!$game) return;
        
        // Calcular el promedio de las reviews
        $avgRating = Review::where('game_id', $gameId)->avg('rating');
        
        // Si no hay reviews, mantener la valoración original
        if (!$avgRating) return;
        
        // Combinar la valoración original con la valoración de la comunidad
        // Usamos un peso de 40% para la valoración original y 60% para la valoración de la comunidad
        $originalRating = $game->rating;
        $combinedRating = ($originalRating * 0.4) + ($avgRating * 0.6);
        
        // Actualizar la valoración del juego
        $game->rating = $combinedRating;
        $game->save();
    }
}
