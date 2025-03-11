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
      * Obtiene juegos desde la API sin guardarlos
      */
     public function fetchGamesFromApi()
     {
          set_time_limit(0); 
          $allGames = [];
          $url = 'https://api.rawg.io/api/games';
          $params = [
               'key' => '915e17cf3f9c485bab6bf3bda733f6eb',
               'metacritic' => '70,100',               
               'page_size' => 20,
               'ordering' => '-fecha_lanzamiento', 
          ];

          try {
               do {
                    $response = $this->client->get($url, ['query' => $params]);
                    $data = json_decode($response->getBody()->getContents(), true);

                    // Acumular juegos
                    $allGames = array_merge($allGames, $data['results']);

                    // Actualizar URL y parámetros para la siguiente página
                    $nextUrl = $data['next'];
                    if ($nextUrl) {
                         $parsedUrl = parse_url($nextUrl);
                         parse_str($parsedUrl['query'], $queryParams);
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
               Log::error('Error al obtener juegos de la API: ' . $e->getMessage());
               return [
                    'juegos' => [],
                    'count' => 0,
                    'next' => null,
                    'previous' => null
               ];
          }
     }
     
}