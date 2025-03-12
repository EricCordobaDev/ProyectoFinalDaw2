import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import AiChatBot from '@/components/chat-assistant';

interface Game {
    id: number;
    name: string;
    background_image?: string;
    released?: string;
    metacritic?: number;
}

interface Pagination {
    current_page: number;
    total_pages: number;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Videojuegos',
        href: '/games',
    },
];

export default function Games({ juegos = [], paginacion = null }: { juegos: Game[], paginacion: Pagination | null }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
           <Head title="Videojuegos">
                <link rel="icon" href="icono.png" type="image/x-icon" />
            </Head>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold mb-6">Catálogo de Videojuegos</h1>
                
                {juegos.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">No se encontraron videojuegos disponibles</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {juegos.map((juego) => (
                            <div key={juego.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                                <div className="h-48 overflow-hidden">
                                    {juego.background_image ? (
                                        <img 
                                            src={juego.background_image} 
                                            alt={juego.name} 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                            <span className="text-gray-400">Sin imagen</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2 line-clamp-2">{juego.name}</h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            {juego.released ? new Date(juego.released).toLocaleDateString() : 'Fecha desconocida'}
                                        </div>
                                        {juego.metacritic && (
                                            <div className={`px-2 py-1 rounded font-medium ${
                                                juego.metacritic >= 75 ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                                                juego.metacritic >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                                                'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                            }`}>
                                                {juego.metacritic}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {paginacion && (
                    <div className="flex justify-center mt-8">
                        <nav className="flex items-center gap-2">
                            {paginacion.current_page > 1 && (
                                <Link 
                                    href={`/games?page=${paginacion.current_page - 1}`}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                >
                                    Anterior
                                </Link>
                            )}
                            
                            <span className="px-4 py-2">
                                Página {paginacion.current_page} de {paginacion.total_pages}
                            </span>
                            
                            {paginacion.current_page < paginacion.total_pages && (
                                <Link 
                                    href={`/games?page=${paginacion.current_page + 1}`}
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                >
                                    Siguiente
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </div>
          
            <AiChatBot />
        </AppLayout>
    );
}