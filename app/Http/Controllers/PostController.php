<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::with('user')->orderByDesc('created_at')->get();
        return response()->json($posts);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string|max:1000',
            'image' => 'nullable|image|max:2048', // Ahora validamos que sea un archivo de imagen de máximo 2MB
        ]);

        $post = new Post();
        $post->usuario_id = Auth::id();
        $post->content = $request->content;
        
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('posts', 'public');
            $post->image = $path;
        }
        
        $post->save();

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'post' => $post]);
        }

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Post $post)
    {
        if (Auth::id() === $post->usuario_id) {
            // Eliminar la imagen si existe
            if ($post->image) {
                Storage::disk('public')->delete($post->image);
            }
            
            $post->delete();
            
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Post eliminado correctamente'
                ]);
            }
        }
        
        return redirect()->back();
    }

    /**
     * Like a post
     */
    public function like(Request $request, Post $post)
    {
        $user = Auth::user();
        
        // Si el usuario ya dio like, lo quitamos (toggle)
        if ($post->isLikedBy($user)) {
            $post->likedBy()->detach($user->id);
            $post->decrement('likes');
        } else {
            // Si no ha dado like, lo agregamos
            $post->likedBy()->attach($user->id);
            $post->increment('likes');
        }
        
        $post->save();
        
        // Si la petición es AJAX, devolver una respuesta de Inertia
        if ($request->ajax() || $request->wantsJson()) {
            return Inertia::render('Dashboard', [
                'posts' => Post::with('user')->orderByDesc('created_at')->get()
            ]);
        }
        
        return redirect()->back();
    }
}
