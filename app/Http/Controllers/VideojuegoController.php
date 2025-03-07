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
          $currentPage = request()->get('page', 1);
          $perPage = 20;

          

          // Primero, obtenemos y guardamos los juegos de la API
          //$this->videojuegoService->fetchAndSaveGames();

          // Luego, obtenemos los juegos de la base de datos con paginación
          $juegos = $this->videojuegoService->getGames($currentPage, $perPage);

          return inertia('videojuegos', [
               'juegos' => $juegos->items(),
               'currentPage' => $juegos->currentPage(),
               'totalPages' => $juegos->lastPage(),
               
          ]);
     }

}