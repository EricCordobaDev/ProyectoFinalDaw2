<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Services\VideojuegoService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideojuegoController extends Controller
{
     protected $videojuegoService;

     public function __construct(VideojuegoService $videojuegoService)
     {
          $this->videojuegoService = $videojuegoService;
     }
     
     /**
      * Muestra la lista de juegos con filtros opcionales
      */
     public function mostrarVideojuegos(Request $request)
     {
         $page = $request->input('page', 1);
         $pageSize = $request->input('page_size', 20);      
         $searchTerm = $request->input('search', '');   
               
         
         // Aplicamos filtro de búsqueda si existe un término de búsqueda
         $query = Game::query();
         
         if (!empty($searchTerm)) {
             $query->where('name', 'like', '%' . $searchTerm . '%');
         }
         
         $juegos = $query->paginate($pageSize);
         
         return inertia('games', [
             'juegos' => $juegos->items(),
             'paginacion' => [
                 'current_page' => $juegos->currentPage(),
                 'total_pages' => $juegos->lastPage(),
                 'total' => $juegos->total()
             ],
             'searchTerm' => $searchTerm           
         ]);
     }

     /**
      * Muestra los detalles de un juego específico
      * 
      * @param Game $game
      * @return \Inertia\Response
      */
     public function show(Game $game)
     {
         $user = Auth::user();
         
         // Verificar si el juego está en la biblioteca del usuario actual
         $savedByUser = false;
         if ($user) {
             $savedByUser = $user->games()->where('game_id', $game->id)->exists();
         }
         
         // Obtener las 3 reviews más recientes
         $latestReviews = $game->reviews()
             ->with('user')
             ->orderBy('created_at', 'desc')
             ->limit(3)
             ->get();
             
         // Calcular la valoración promedio de las reviews
         $averageRating = $game->reviews()->avg('rating');
         
         return Inertia::render('games/show', [
             'game' => array_merge($game->toArray(), [
                 'saved_by_user' => $savedByUser,
                 'latest_reviews' => $latestReviews,
                 'reviews_count' => $game->reviews()->count(),
                 'average_rating' => $averageRating
             ])
         ]);
     }

     /**
     * Guarda un juego en la biblioteca del usuario
     */
    public function saveGame($id)
    {
        $user = Auth::user();
        $game = Game::findOrFail($id);
        
        // Comprueba si el juego ya está en la biblioteca del usuario
        if (!$user->games()->where('game_id', $id)->exists()) {
            $user->games()->attach($id);
            return redirect()->back()
                ->with('message', 'Juego añadido a tu biblioteca correctamente')
                ->with('type', 'success');
        }
        
        return redirect()->back()
            ->with('message', 'Este juego ya está en tu biblioteca')
            ->with('type', 'error');
    }

     /**
      * Summary of guardar
      * @param \Illuminate\Http\Request $request
      * @return \Inertia\Response|\Inertia\ResponseFactory
      */
     public function guardar(Request $request)
     {              
          $page = $request->input('page', 1);
          $pageSize = $request->input('page_size', 20);
          
          // Obtenemos los juegos de la API con paginación
          $resultado = $this->videojuegoService->recogerJuegosApi($page, $pageSize);


          $this->videojuegoService->guardarJuegos($resultado['games']);
        

          // Calcular el número total de páginas
          $totalPages = ceil($resultado['total'] / $pageSize);

          return inertia('games', [
               'juegos' => $resultado['games'],
               'paginacion' => [
                    'current_page' => (int)$page,
                    'total_pages' => $totalPages,                    
               ]           
          ]);
     }
    
}