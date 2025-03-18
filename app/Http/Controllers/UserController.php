<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return inertia('profile', [
            'user' => array_merge($request->user()->toArray(), [
                'games' => $request->user()->games
            ])
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