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
          $resultado = $this->videojuegoService->fetchGamesFromApi($page, $pageSize);

          return inertia('games', [
               'juegos' => $resultado['games'],
               'paginacion' => $resultado['pagination']
          ]);
     }
}