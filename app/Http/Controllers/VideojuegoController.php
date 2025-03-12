<?php

namespace App\Http\Controllers;

use App\Services\VideojuegoService;
use Illuminate\Http\Request;

class VideojuegoController extends Controller
{
     protected $videojuegoService;

     public function __construct(VideojuegoService $videojuegoService)
     {
          $this->videojuegoService = $videojuegoService;
     }
     
     public function mostrarVideojuegos(Request $request)
     {              
          $page = $request->input('page', 1);
          $pageSize = $request->input('page_size', 20);
          
          // Obtenemos los juegos de la API con paginación
          $resultado = $this->videojuegoService->recogerJuegosApi($page, $pageSize);

          // Calcular el número total de páginas
          $totalPages = ceil($resultado['total'] / $pageSize);

          return inertia('games', [
               'juegos' => $resultado['games'],
               'paginacion' => [
                    'current_page' => (int)$page,
                    'total_pages' => $totalPages,
                    'has_next_page' => $resultado['next_page'] !== null,
                    'has_prev_page' => $resultado['prev_page'] !== null,
               ]           
          ]);
     }
    
}