<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Si se proporciona un userId, mostrar el perfil de ese usuario
        if ($request->has('userId')) {
            $user = User::with('games')->findOrFail($request->userId);
            
            return inertia('profile', [
                'user' => array_merge($user->toArray(), [
                    'games' => $user->games
                ]),
                'isCurrentUser' => $request->user()->id === $user->id
            ]);
        }
        
        // Si no hay userId, mostrar el perfil del usuario actual
        return inertia('profile', [
            'user' => array_merge($request->user()->toArray(), [
                'games' => $request->user()->games
            ]),
            'isCurrentUser' => true
        ]);
    }

    /**
     * Remove the specified game from the user's library.
     */
    public function destroyGame(Request $request, $gameId)
    {
        $user = $request->user();
        
        // Eliminar la relación entre el usuario y el juego
        $user->games()->detach($gameId);
        
        return redirect()->back()->with('success', 'Juego eliminado de tu biblioteca correctamente');
    }
}