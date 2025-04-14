import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Star, Calendar, Monitor, Gamepad2, Tag, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePage } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import AiChatBot from '@/components/chat-assistant';

interface User {
    id: number;
    name: string;
    image?: string;
}

interface Review {
    id: number;
    user_id: number;
    game_id: number;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
    user: User;
}

interface Game {
    id: number;
    idApi?: string;
    name: string;
    background_image?: string;
    released?: string;
    metacritic?: number;
    rating: number;
    platforms?: string[];
    genres?: string[];
    saved_by_user: boolean;
    latest_reviews: Review[];
    reviews_count: number;
    average_rating?: number;
}

export default function GameDetails({ game }: { game: Game }) {
    const { auth } = usePage().props as any;
    const platforms = typeof game.platforms === 'string' ? JSON.parse(game.platforms) : game.platforms;
    const genres = typeof game.genres === 'string' ? JSON.parse(game.genres) : game.genres;
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Videojuegos',
            href: '/games',
        },
        {
            title: game.name,
            href: `/games/${game.id}`,
        },
    ];

    // Función para renderizar estrellas según el rating
    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star 
                    key={i} 
                    className="h-5 w-5" 
                    fill={i <= fullStars ? "#FFD700" : (i === fullStars + 1 && hasHalfStar ? "#FFD700" : "none")} 
                    fillOpacity={i === fullStars + 1 && hasHalfStar ? 0.5 : 1}
                    stroke="#FFD700"
                />
            );
        }
        
        return stars;
    };

    const handleSaveGame = () => {
        if (!auth.user) {
            window.location.href = '/login';
            return;
        }
        
        router.post(`/games/save/${game.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={game.name}>
                <link rel="icon" href="/icono.png" type="image/x-icon" />
            </Head>
            
            <div className="container py-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {/* Columna izquierda: Imagen y acciones */}
                    <div className="md:col-span-1">
                        <div className="sticky top-20">
                            <div className="overflow-hidden rounded-lg border shadow-lg">
                                {game.background_image ? (
                                    <img 
                                        src={game.background_image} 
                                        alt={game.name} 
                                        className="w-full object-cover" 
                                    />
                                ) : (
                                    <div className="flex h-64 w-full items-center justify-center bg-gray-200">
                                        <span className="text-gray-500">Sin imagen</span>
                                    </div>
                                )}
                                
                                <div className="bg-card p-4 space-y-4">
                                    <Button
                                        onClick={handleSaveGame}
                                        variant={game.saved_by_user ? "outline" : "default"}
                                        className="w-full"
                                    >
                                        {game.saved_by_user ? 'En tu biblioteca' : 'Añadir a Biblioteca'}
                                    </Button>
                                    
                                    <Link href={`/games/${game.id}/reviews`}>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Ver todas las Reviews
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Columna derecha: Información del juego */}
                    <div className="md:col-span-2">
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-4xl font-bold">{game.name}</h1>
                                
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="flex">
                                        {renderStars(game.rating)}
                                    </div>
                                    <span className="font-semibold">{game.rating.toFixed(1)}/5</span>
                                    <span className="text-sm text-muted-foreground">
                                        ({game.reviews_count} {game.reviews_count === 1 ? 'review' : 'reviews'})
                                    </span>
                                </div>
                                
                                {game.metacritic && (
                                    <div className="mt-2">
                                        <span 
                                            className={`rounded px-2 py-1 text-sm font-bold ${
                                                game.metacritic >= 75 ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                                                game.metacritic >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                                                'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                            }`}
                                        >
                                            Metacritic: {game.metacritic}
                                        </span>
                                    </div>
                                )}
                            </div>
                            
                            <Tabs defaultValue="info" className="w-full">
                                <TabsList>
                                    <TabsTrigger value="info">Información</TabsTrigger>
                                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                                </TabsList>
                                
                                <TabsContent value="info" className="space-y-6">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {game.released && (
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5 text-muted-foreground" />
                                                <div>
                                                    <p className="text-sm font-medium">Fecha de lanzamiento</p>
                                                    <p>{new Date(game.released).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {platforms && platforms.length > 0 && (
                                            <div className="flex items-start gap-2">
                                                <Gamepad2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium">Plataformas</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {platforms.map((platform: string, index: number) => (
                                                            <Badge key={index} variant="outline">{platform}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {genres && genres.length > 0 && (
                                            <div className="flex items-start gap-2">
                                                <Tag className="h-5 w-5 text-muted-foreground mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium">Géneros</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {genres.map((genre: string, index: number) => (
                                                            <Badge key={index} variant="secondary">{genre}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <Separator />
                                    
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3">Acerca de este juego</h3>
                                        <p className="text-muted-foreground">
                                            {game.name} es un videojuego {genres && genres.length > 0 ? `de ${genres[0]}` : ''} 
                                            {platforms && platforms.length > 0 ? ` disponible para ${platforms.slice(0, 3).join(', ')}${platforms.length > 3 ? ' y otras plataformas' : ''}` : ''}.
                                            {game.released ? ` Fue lanzado el ${new Date(game.released).toLocaleDateString()}.` : ''}
                                            {game.metacritic ? ` Ha recibido una puntuación de ${game.metacritic} en Metacritic.` : ''}
                                        </p>
                                    </div>
                                </TabsContent>
                                
                                <TabsContent value="reviews" className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-semibold">Opiniones de la comunidad</h3>
                                        <Link href={`/games/${game.id}/reviews`}>
                                            <Button variant="link">Ver todas ({game.reviews_count})</Button>
                                        </Link>
                                    </div>
                                    
                                    {game.latest_reviews && game.latest_reviews.length > 0 ? (
                                        <div className="space-y-4">
                                            {game.latest_reviews.map((review) => (
                                                <Card key={review.id}>
                                                    <CardHeader className="pb-2">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <CardTitle className="text-base">{review.user.name}</CardTitle>
                                                                <CardDescription>{new Date(review.created_at).toLocaleDateString()}</CardDescription>
                                                            </div>
                                                            <div className="flex items-center">
                                                                {renderStars(review.rating)}
                                                            </div>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        {review.comment ? (
                                                            <p className="text-sm">{review.comment}</p>
                                                        ) : (
                                                            <p className="text-sm text-muted-foreground italic">Sin comentario</p>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed p-6 text-center">
                                            <Users className="mx-auto h-8 w-8 text-muted-foreground" />
                                            <p className="mt-2 text-muted-foreground">No hay reviews todavía</p>
                                            <p className="mt-1">
                                                <Link href={`/games/${game.id}/reviews`}>
                                                    <Button variant="link" className="px-0">Sé el primero en opinar</Button>
                                                </Link>
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
            
            <AiChatBot />
        </AppLayout>
    );
}