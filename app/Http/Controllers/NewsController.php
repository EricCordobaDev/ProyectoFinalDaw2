<?php

namespace App\Http\Controllers;

use App\Services\NewsScraperService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NewsController extends Controller
{
    protected $newsScraperService;

    public function __construct(NewsScraperService $newsScraperService)
    {
        $this->newsScraperService = $newsScraperService;
    }

    public function index()
    {
        return Inertia::render('News');
    }

    public function getNews()
    {
        $news = $this->newsScraperService->getNews();
        return response()->json($news);
    }

    /**
     * Muestra los detalles de una noticia específica.
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        // Obtener la lista de noticias
        $news = $this->newsScraperService->getNews();

        // Buscar la noticia específica por ID (índice en este caso)
        if (!isset($news[$id])) {
            abort(404, 'Noticia no encontrada');
        }

        $selectedNews = $news[$id];

        // Renderizar la vista con los detalles de la noticia
        return Inertia::render('News/Show', [
            'news' => $selectedNews
        ]);
    }
}