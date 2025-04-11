<?php

namespace App\Http\Controllers;


use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
        ]);

        $post = new Post();
        $post->usuario_id = Auth::id();
        $post->content = $request->content;

        // Procesar la imagen solo si se ha subido una imagen
        if ($request->hasFile('image')) {
          $image = $request->file('image');
          // Generar un nombre único para la imagen
          $nombreImagen = time() . '.' . $image->getClientOriginalExtension();
          // Guardar la imagen en el disco 'public' dentro de la carpeta 'images'
          $post->image = $image->storeAs('postImages', $nombreImagen, 'public');
        }
        
        $post->save();

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'post' => $post]);
        }

        return redirect()->back();
    }  

    /**
     * Display the specified resource (post).
     */
    public function show(Post $post)
    {
        $user = Auth::user();
        
        // Cargar el post con su usuario y comentarios (ordenados por fecha)
        $post->load(['user']);
        $post->liked_by_user = $post->isLikedBy($user);
        
        // Cargar comentarios con sus autores
        $comments = Comment::where('post_id', $post->id)
            ->with('user')
            ->orderByDesc('created_at')
            ->get();
            
        return Inertia::render('posts/show', [
            'post' => $post,
            'comments' => $comments
        ]);
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
