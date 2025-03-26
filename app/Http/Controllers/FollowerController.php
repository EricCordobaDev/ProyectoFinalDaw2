<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FollowerController extends Controller
{
    /**
     * Seguir a un usuario
     */
    public function follow(User $user)
    {
        $currentUser = Auth::user();
        
        if ($currentUser->id === $user->id) {
            return back()->with('error', 'No puedes seguirte a ti mismo');
        }
        
        $currentUser->follow($user);
        
        return back()->with('success', 'Ahora estás siguiendo a ' . $user->name);
    }
    
    /**
     * Dejar de seguir a un usuario
     */
    public function unfollow(User $user)
    {
        $currentUser = Auth::user();
        
        $currentUser->unfollow($user);
        
        return back()->with('success', 'Has dejado de seguir a ' . $user->name);
    }
    
    /**
     * Mostrar seguidores de un usuario
     */
    public function showFollowers(User $user)
    {
        $followers = $user->followers()->with('follower')->paginate(10);
        
        return Inertia::render('users/followers', [
            'user' => $user,
            'followers' => $followers
        ]);
    }
    
    /**
     * Mostrar usuarios que sigue un usuario
     */
    public function showFollowing(User $user)
    {
        $following = $user->following()->with('followed')->paginate(10);
        
        return Inertia::render('users/following', [
            'user' => $user,
            'following' => $following
        ]);
    }
}