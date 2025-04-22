import AiChatBot from '@/components/chat-assistant';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Search, Star as  X } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import GameCard from '@/components/GameCard';
import { Input } from '@/components/ui/input';

interface Game {
    id: number;
    name: string;
    background_image?: string;
    released?: string;
    metacritic?: number;
    rating: number;
    saved_by_user: boolean;
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
    
    // Temporizador para implementar debounce en la búsqueda
    const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);

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

    // Efecto para la búsqueda en tiempo real
    useEffect(() => {
        // Cancelar el temporizador anterior si existe
        if (searchTimer) {
            clearTimeout(searchTimer);
        }
        
        // Crear un nuevo temporizador para realizar la búsqueda después de 500ms
        const timer = setTimeout(() => {
            // Solo realizar la búsqueda si el término difiere del término actual
            if (search !== searchTerm) {
                router.get('/games', { search: search }, {
                    preserveState: true,
                    preserveScroll: true,
                });
            }
        }, 500); // Retraso de 500ms para evitar solicitudes excesivas
        
        setSearchTimer(timer);
        
        // Limpiar el temporizador al desmontar
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [search]); // Se ejecuta cada vez que cambia el término de búsqueda

    // Mantenemos esta función por si quieres conservar el botón de búsqueda como respaldo
    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        // Esta función ahora es opcional ya que la búsqueda se realiza automáticamente
    };

    const closeNotification = () => {
        setNotification(prev => prev ? {...prev, visible: false} : null);
    };

    // Función para renderizar números de página
    const renderPageNumbers = () => {
        if (!paginacion) return null;
        
        const pageNumbers = [];
        const maxVisiblePages = 5;
        const startPage = Math.max(1, paginacion.current_page - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(paginacion.total_pages, startPage + maxVisiblePages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <Button
                    key={i}
                    variant={paginacion.current_page === i ? "default" : "outline"}
                    onClick={() => router.get('/games', { page: i, search }, { preserveState: true })}
                >
                    {i}
                </Button>
            );
        }

        return pageNumbers;
    };

    const handleSaveGame = (gameId: number) => {
        router.post(`/games/save/${gameId}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Videojuegos">
                <link rel="icon" href="icono.png" type="image/x-icon" />
            </Head>
            
            {/* Notificación */}
            {notification && notification.visible && (
                <div 
                    className={`
                        fixed top-20 left-1/2 z-[9999] -translate-x-1/2 transform 
                        rounded-lg px-6 py-4 shadow-2xl
                        animate-in fade-in slide-in-from-top-4 duration-300
                        ${notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
                    `}
                    style={{
                        minWidth: '300px',
                        maxWidth: '90%'
                    }}
                >
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-lg font-medium">{notification.message}</span>
                        <button 
                            onClick={closeNotification} 
                            className="rounded-full p-1.5 hover:bg-white/20 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="mb-6 text-2xl font-bold">Catálogo de Videojuegos</h1>
                
                {/* Buscador */}
                <div className="mb-6">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Buscar videojuegos..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            // Modificamos las clases para el estilo violeta
                            className="w-full rounded-lg border border-transparent py-2 pl-10 pr-4 " 
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                            {/* Ajustamos el color del icono para que contraste */}
                            <Search className="h-5 w-5 text-violet-200" /> 
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {juegos.map((juego) => (
                        <GameCard 
                            key={juego.id} 
                            game={juego} 
                            onSave={handleSaveGame} 
                        />
                    ))}
                </div>

                {/* Paginación */}
                {paginacion !== null && (
                    <div className="mt-8 flex justify-center items-center space-x-2">
                        {paginacion.current_page > 1 && (
                            <Button
                                variant="outline"
                                onClick={() => router.get('/games', { page: 1, search }, { preserveState: true })}
                            >
                                Primero
                            </Button>
                        )}
                        {paginacion.current_page > 1 && (
                            <Button
                                variant="outline"
                                onClick={() => router.get('/games', { page: paginacion.current_page - 1, search }, { preserveState: true })}
                            >
                                Anterior
                            </Button>
                        )}

                        {renderPageNumbers()}

                        {paginacion.current_page < paginacion.total_pages && (
                            <Button
                                variant="outline"
                                onClick={() => router.get('/games', { page: paginacion.current_page + 1, search }, { preserveState: true })}
                            >
                                Siguiente
                            </Button>
                        )}
                        {paginacion.current_page < paginacion.total_pages && (
                            <Button
                                variant="outline"
                                onClick={() => router.get('/games', { page: paginacion.total_pages, search }, { preserveState: true })}
                            >
                                Último
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <AiChatBot />
        </AppLayout>
    );
}
