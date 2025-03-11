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
      * Obtiene juegos desde la API paginados
      * @param int $page Número de página a recuperar
      * @param int $pageSize Número de elementos por página
      * @return array Con los juegos y metadatos de paginación
      */
      public function fetchGamesFromApi($page = 1, $pageSize = 40)
      {
          try {
              set_time_limit(0); 
              $url = 'https://api.rawg.io/api/games';
              $params = [
                  'key' => '915e17cf3f9c485bab6bf3bda733f6eb',
                  'metacritic' => '50,100',           
                  'page_size' => $pageSize,
                  'page' => $page,                  
                  'ordering' => '-released',                   
              ];
              
              $response = $this->client->request('GET', $url, [
                  'query' => $params,
                  'timeout' => 30, // Tiempo máximo de espera
              ]);
      
              $data = json_decode($response->getBody(), true);
              
              if (!isset($data['results'])) {
                  Log::error('API no devolvió resultados esperados', ['response' => $data]);
                  return ['games' => [], 'pagination' => ['count' => 0, 'current_page' => $page, 'page_size' => $pageSize, 'total_pages' => 0]];
              }
              
              
              return [
                  'games' => $data['results'] ?? [],
                  'pagination' => [
                      'count' => $data['count'] ?? 0,
                      'next' => $data['next'] ?? null,
                      'previous' => $data['previous'] ?? null,
                      'current_page' => $page,
                      'page_size' => $pageSize,
                      'total_pages' => ceil(($data['count'] ?? 0) / $pageSize),
                  ]
              ];
          } catch (\Exception $e) {
              Log::error('Error al obtener datos de la API de juegos', [
                  'error' => $e->getMessage(),
                  'page' => $page,
                  'pageSize' => $pageSize
              ]);
              
              return ['games' => [], 'pagination' => ['count' => 0, 'current_page' => $page, 'page_size' => $pageSize, 'total_pages' => 0]];
          }
      }
}