<?php

namespace App\Services;

use GuzzleHttp\Client;
use DOMDocument;
use DOMXPath;

class NewsScraperService
{
    protected $client;
    protected $url = 'https://vandal.elespanol.com/noticias/videojuegos';

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 10,
            'verify' => false, // Deshabilitar la verificación SSL
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            ]
        ]);
    }

    public function getNews()
    {
        try {
            $response = $this->client->get($this->url);
            $html = (string) $response->getBody();
            
            $dom = new DOMDocument();
            @$dom->loadHTML($html);
            $xpath = new DOMXPath($dom);
            
            $newsItems = [];
            
            // Seleccionar los elementos de noticias con la clase "caja620"
            $articles = $xpath->query('//div[contains(@class, "caja620")]');
            
            foreach ($articles as $article) {
                $link = $xpath->query('.//a', $article)->item(0);
                $title = $link ? $link->getAttribute('title') : null;
                $url = $link ? $link->getAttribute('href') : null;
              

                if ($title && $url) {
                     // Obtener la imagen haciendo scraping de la URL de la noticia
                     $image = $this->getImageFromArticleUrl($url);

                    $newsItems[] = [
                        'title' => $title,
                        'url' => $url,
                        'image' => $image,                        
                    ];
                }
            }
            
            return $newsItems;
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => $e->getMessage()
            ];
        }
    }

    /**
     * Obtiene la imagen principal de una noticia específica
     * 
     * @param string $url URL de la noticia
     * @return string|null URL de la imagen o null si no se encuentra
     */
    protected function getImageFromArticleUrl($url)
    {
        try {
            $response = $this->client->get($url);
            $html = (string) $response->getBody();
            
            $dom = new DOMDocument();
            @$dom->loadHTML($html);
            $xpath = new DOMXPath($dom);
            
            // Buscar la imagen dentro del div con clase "imagenprincipal tcenter"
            $imageElement = $xpath->query('//div[contains(@class, "tcenter")]//picture//img')->item(0);
            
            return $imageElement ? $imageElement->getAttribute('src') : null;
        } catch (\Exception $e) {
            // Si hay un error, simplemente devolvemos null para esa imagen
            return null;
        }
    }
}