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
        $authUser = $request->user();

        // Si se proporciona un userId, mostrar el perfil de ese usuario
        if ($request->has('userId')) {
            $user = User::with('games')->findOrFail($request->userId);
            $user->followers_count = $user->followers()->count();
            $user->following_count = $user->following()->count();
            $user->is_followed_by_auth_user = $authUser ? $authUser->isFollowing($user) : false;
            
            return inertia('profile', [
                'user' => array_merge($user->toArray(), [
                    'games' => $user->games
                ]),
                'isCurrentUser' => $authUser ? ($authUser->id === $user->id) : false
            ]);
        }
        
        // Si no hay userId, mostrar el perfil del usuario actual
        $authUser->followers_count = $authUser->followers()->count();
        $authUser->following_count = $authUser->following()->count();
        $authUser->is_followed_by_auth_user = false; // No se puede seguir a uno mismo
        
        return inertia('profile', [
            'user' => array_merge($authUser->toArray(), [
                'games' => $authUser->games
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