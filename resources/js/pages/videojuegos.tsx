import { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import AiChatBot from '@/components/chat-assistant';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Gamepad2, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Videojuegos',
        href: '/videojuegos',
    },
];

export default function Videojuegos({ juegos, currentPage = 1, totalPages = 1 }) {
    const [isLoading, setIsLoading] = useState(false);

    function changePage(page) {
        setIsLoading(true);
        router.get('/videojuegos', { page }, {
            preserveState: true,
            onSuccess: () => setIsLoading(false)
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Videojuegos" />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Videojuegos Destacados</h1>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage <= 1 || isLoading}
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                        </Button>
                        <span className="text-sm">
                            Página {currentPage} de {totalPages}
                        </span>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage >= totalPages || isLoading}
                        >
                            Siguiente <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {juegos?.map((juego) => (
                            <Card key={juego.id} className="overflow-hidden transition-all hover:shadow-lg">
                                <div className="aspect-video w-full relative">
                                    <img 
                                        src={juego.imagen} 
                                        alt={juego.nombre}
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white p-1 rounded flex items-center">
                                        <Star className="h-4 w-4 text-yellow-400 mr-1 fill-yellow-400" />
                                        <span>{juego.metacritic}</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold mb-2 line-clamp-1">{juego.nombre}</h3>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Gamepad2 className="h-4 w-4 mr-1" />
                                         <span className="line-clamp-1">
                                        {juego.datos_json.genres?.map(genre => genre.slug).join(", ")}
                                        </span> 
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        {/* <Button variant="outline" size="sm" asChild>
                                            <a href={`/videojuegos/${juego.slug}`}>Ver detalles</a>
                                        </Button> */}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            
            <AiChatBot />
        </AppLayout>
    );
}