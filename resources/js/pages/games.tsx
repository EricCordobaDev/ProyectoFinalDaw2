import AiChatBot from '@/components/chat-assistant';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Search, Star, X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

interface Game {
    id: number;
    name: string;
    background_image?: string;
    released?: string;
    metacritic?: number;
    rating: number;
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

export default function Games({
    juegos = [],
    paginacion = null,
    searchTerm = '',
    flash = {},
}: {
    juegos: Game[];
    paginacion: Pagination | null;
    searchTerm?: string;
    flash?: {
        message?: string;
        type?: 'success' | 'error';
    };
}) {
    const [search, setSearch] = useState(searchTerm);
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
        visible: boolean;
    } | null>(null);

    // Procesar mensajes flash recibidos del servidor
    useEffect(() => {
        if (flash.message) {
            setNotification({
                message: flash.message,
                type: flash.type || 'success',
                visible: true
            });
            
            // Ocultar la notificación después de 5 segundos
            const timer = setTimeout(() => {
                setNotification(prev => prev ? {...prev, visible: false} : null);
            }, 5000);
            
            return () => clearTimeout(timer);
        }
    }, [flash.message]);

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        router.get('/games', { search: search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const closeNotification = () => {
        setNotification(prev => prev ? {...prev, visible: false} : null);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Videojuegos">
                <link rel="icon" href="icono.png" type="image/x-icon" />
            </Head>
            
            {/* Notificación */}
            {notification && notification.visible && (
                <div className={`fixed top-4 left-1/2 z-50 -translate-x-1/2 transform rounded-md px-6 py-3 shadow-lg transition-all ${
                    notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    <div className="flex items-center justify-between">
                        <span>{notification.message}</span>
                        <button onClick={closeNotification} className="ml-4 rounded-full p-1 hover:bg-white/20">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
            
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="mb-6 text-2xl font-bold">Catálogo de Videojuegos</h1>
                
                {/* Buscador */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar videojuegos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <button
                            type="submit"
                            className="absolute inset-y-0 right-0 flex items-center rounded-r-lg bg-blue-500 px-4 text-white hover:bg-blue-600"
                        >
                            Buscar
                        </button>
                    </div>
                </form>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {juegos.map((juego) => (
                        <div
                            key={juego.id}
                            className="relative overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105 dark:bg-gray-800"
                        >
                            {/* Estrella */}
                            <div className="absolute top-2 right-2 z-10 flex items-center space-x-1 rounded bg-black/30 px-2 py-0.5">
                                <Star className="h-5 w-5 text-yellow-400" fill="#FFD700" />
                                <span className="font-medium text-white">{juego.rating}</span>
                            </div>

                            <div className="h-48 overflow-hidden">
                                {juego.background_image ? (
                                    <img src={juego.background_image} alt={juego.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                                        <span className="text-gray-400">Sin imagen</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="mb-2 line-clamp-2 text-lg font-bold">{juego.name}</h3>
                                <div className="mt-2 flex items-center justify-between">
                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                        {juego.released ? new Date(juego.released).toLocaleDateString() : 'Fecha desconocida'}
                                    </div>
                                    {juego.metacritic && (
                                        <div
                                            className={`rounded px-2 py-1 font-medium ${
                                                juego.metacritic >= 75
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                                    : juego.metacritic >= 50
                                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                                                      : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                            }`}
                                        >
                                            {juego.metacritic}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <Link
                                        href={`/games/save/${juego.id}`}
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center justify-center rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Añadir a mi biblioteca
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Paginacion */}
                {paginacion !== null && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex items-center gap-2">
                            {paginacion.current_page > 1 && (
                                <Link
                                    href={`/games?page=${paginacion.current_page - 1}${search ? `&search=${search}` : ''}`}
                                    className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
                                >
                                    Anterior
                                </Link>
                            )}

                            <span className="px-4 py-2">
                                Página {paginacion.current_page} de {paginacion.total_pages}
                            </span>

                            {paginacion.current_page < paginacion.total_pages && (
                                <Link
                                    href={`/games?page=${paginacion.current_page + 1}${search ? `&search=${search}` : ''}`}
                                    className="rounded bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
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
