<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    /**
     * Almacenar un nuevo comentario para un post.
     */
    public function store(Request $request, Post $post)
    {
        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        $comment = new Comment();
        $comment->content = $request->content;
        $comment->user_id = Auth::id();
        $comment->post_id = $post->id;
        $comment->save();

        return redirect()->back();
    }

    /**
     * Eliminar un comentario.
     */
    public function destroy(Comment $comment)
    {
        // Verificar que el usuario actual sea el autor del comentario
        if (Auth::id() !== $comment->user_id) {
            return redirect()->back()->with('error', 'No tienes permiso para eliminar este comentario');
        }

        $comment->delete();
        
        return redirect()->back()->with('success', 'Comentario eliminado correctamente');
    }
}