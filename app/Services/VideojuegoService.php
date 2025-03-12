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
 * Obtiene juegos desde la API
 * @param int $page Número de página a recuperar (0 para todas las páginas)
 * @param int $pageSize Número de elementos por página
 * @return array Con los juegos y metadatos de paginación
 */
/**
 * Obtiene juegos desde la API RAWG
 * @param int $page Número de página a recuperar (1 por defecto)
 * @param int $pageSize Número de elementos por página (20 por defecto)
 * @return array Con los juegos y metadatos de paginación
 */
public function recogerJuegosApi(int $page = 1, int $pageSize = 20)
{
    $url = 'https://api.rawg.io/api/games';
    $params = [
        'key' => '915e17cf3f9c485bab6bf3bda733f6eb',
        'metacritic' => '40,100',
        'page_size' => $pageSize,
        'page' => $page, 
        'ordering' => '-released',       
    ];  
    
    try {
        // Realizar la petición GET a la API
        $response = $this->client->request('GET', $url, [
            'query' => $params
        ]);
        
        // Decodificar la respuesta JSON
        $data = json_decode($response->getBody()->getContents(), true);
        
        return [
            'games' => $data['results'] ?? [],
            'total' => $data['count'] ?? 0,
            'next_page' => !empty($data['next']) ? $page + 1 : null,
            'prev_page' => !empty($data['previous']) ? $page - 1 : null,
        ];
    } catch (\Exception $e) {
        // Registrar el error y devolver un array vacío
        Log::error('Error al obtener juegos de la API: ' . $e->getMessage());
        return [
            'games' => [],
            'total' => 0,
            'next_page' => null,
            'prev_page' => null,
        ];
    }
}

public function recogerTodosLosJuegos()
{
    $allGames = [];
    $page = 1;

    do {
        $resultado = $this->recogerJuegosApi($page);
        $allGames = array_merge($allGames, $resultado['games']);
        $page = $resultado['next_page'];
    } while ($page !== null);

    return $allGames;
}
}