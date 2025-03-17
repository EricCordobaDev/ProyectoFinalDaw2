<?php

namespace App\Services;

use App\Models\Game;
use GuzzleHttp\Client;

class VideojuegoService
{
     protected $client;

     public function __construct()
     {
          $this->client = new Client([
               'verify' => false,
          ]);
     }

     /**
      * Obtiene juegos desde la API
      * @param int $page Número de página a recuperar
      * @param int $pageSize Número de elementos por página
      * @return array Con los juegos y metadatos de paginación
      */
     public function recogerJuegosApi(int $page = 1, int $pageSize = 20)
     {
          $url = 'https://api.rawg.io/api/games';
          $params = [
               'key' => '915e17cf3f9c485bab6bf3bda733f6eb',
               'metacritic' => '1,100',               
               'page_size' => $pageSize,
               'page' => $page,
               'ordering' => '-released',
          ];
          $response = $this->client->request('GET', $url, [
               'query' => $params
          ]);

          $data = json_decode($response->getBody()->getContents(), true);
          $results = $data['results'] ?? [];

          // Filter out games without images or release dates
          $filteredGames = array_filter($results, function ($game) {
               return !empty($game['background_image']) && !empty($game['released']);
          });

          return [
               'games' => array_values($filteredGames),
               'total' => $data['count'] ?? 0,
               'next_page' => !empty($data['next']) ? $page + 1 : null,
               'prev_page' => !empty($data['previous']) ? $page - 1 : null,
          ];
     }

     /**
      * Guarda juegos en la base de datos
      * @param array $juegos Array con los datos de juegos a guardar
      * @return array Información sobre la operación
      */
     public function guardarJuegos(array $juegos)
     {
          $guardados = 0;
          $errores = 0;
          $detalles = [];

          foreach ($juegos as $juego) {
               try {
                    // Verificar si el juego ya existe por ID de API
                    $existente = Game::where('idApi', $juego['id'])->first();

                    // Preparar los datos a guardar
                    $datos = [
                         'idApi' => $juego['id'],
                         'name' => $juego['name'],
                         'background_image' => $juego['background_image'] ?? null,
                         'released' => $juego['released'] ?? null,
                         'rating' => $juego['rating'] ?? 0,
                         'metacritic' => $juego['metacritic'] ?? 0,
                         'platforms' => isset($juego['platforms']) ? json_encode(array_map(function ($platform) {
                              return $platform['platform']['name'];
                         }, $juego['platforms'])) : null,
                         'genres' => isset($juego['genres']) ? json_encode(array_map(function ($genre) {
                              return $genre['name'];
                         }, $juego['genres'])) : null,
                    ];

                    if ($existente) {
                         $existente->update($datos);
                         $detalles[] = "Juego actualizado: {$juego['name']}";
                    } else {
                         Game::create($datos);
                         $detalles[] = "Juego guardado: {$juego['name']}";
                    }

                    $guardados++;
               } catch (\Exception $e) {
                    $errores++;
                    $detalles[] = "Error al guardar {$juego['name']}: " . $e->getMessage();
               }
          }

          return [
               'guardados' => $guardados,
               'errores' => $errores,
               'detalles' => $detalles
          ];
     }
    

}