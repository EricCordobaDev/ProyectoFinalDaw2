<?php

namespace App\Http\Controllers;

use App\Services\VideojuegoService;


class VideojuegoController extends Controller
{
     protected $videojuegoService;

     public function __construct(VideojuegoService $videojuegoService)
     {
          $this->videojuegoService = $videojuegoService;
     }
     public function mostrarVideojuegos()
     {              

        
          // Luego, obtenemos los juegos de la base de datos con paginación
          $juegos = $this->videojuegoService->fetchGamesFromApi();

          return inertia('games', [
              
          ]);
     }

}