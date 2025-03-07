<?php

namespace App\Services;

use App\Models\Videojuego;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

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
      * Obtiene juegos desde la API y los guarda en la base de datos
      */
     public function fetchAndSaveGames()
     {
          set_time_limit(0); 
          $allGames = [];
          $url = 'https://api.rawg.io/api/games';
          $params = [
               'key' => '915e17cf3f9c485bab6bf3bda733f6eb',
               'metacritic' => '70,100',               
               'page_size' => 20,
               'ordering' => '-name', 
          ];

          try {
               do {
                    $response = $this->client->get($url, ['query' => $params]);
                    $data = json_decode($response->getBody()->getContents(), true);

                    // Guardar cada juego en la base de datos (solo crear nuevos)
                    foreach ($data['results'] as $gameData) {
                          if(isset($gameData['released'])) {
                                //  no actualizar si existe
                                Videojuego::firstOrCreate(
                                      ['api_id' => $gameData['id']],
                                      [
                                             'nombre' => $gameData['name'],
                                             'imagen' => $gameData['background_image'] ?? null,
                                             'fecha_lanzamiento' => $gameData['released'] ?? null,
                                             'metacritic' => $gameData['metacritic'] ?? null,
                                             'datos_json' => json_encode($gameData)
                                      ]
                                );
                          }
                    }

                    // Acumular juegos
                    $allGames = array_merge($allGames, $data['results']);

                    // Actualizar URL y parámetros para la siguiente página
                    $nextUrl = $data['next'];
                    if ($nextUrl) {
                         $parsedUrl = parse_url($nextUrl);
                         parse_str($parsedUrl['query'], $queryParams);
                         // Si la API utiliza una URL completa para 'next', puede que requieras reiniciar $url
                         $url = $parsedUrl['scheme'] . '://' . $parsedUrl['host'] . $parsedUrl['path'];
                         $params = $queryParams;
                    }
               } while ($nextUrl);

               return [
                    'juegos' => $allGames,
                    'count' => count($allGames),
                    'next' => null,
                    'previous' => null,
               ];
          } catch (\Exception $e) {
               Log::error('Error al obtener juegos: ' . $e->getMessage());
               return [
                    'juegos' => [],
                    'count' => 0,
                    'next' => null,
                    'previous' => null
               ];
          }
     }


     /**
      * Obtiene juegos desde la base de datos con paginación
      */
     public function getGames($page = 1, $perPage = 20)
     {
          return Videojuego::orderBy('fecha_lanzamiento', 'desc')
               ->paginate($perPage, ['*'], 'page', $page);
     }
}