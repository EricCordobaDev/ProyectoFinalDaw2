import React, { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { Star, StarHalf, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { type BreadcrumbItem } from '@/types';

interface User {
    id: number;
    name: string;
    email: string;
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
    name: string;
    background_image?: string;
    released?: string;
    metacritic?: number;
    rating: number;
}

interface ReviewsProps {
    game: Game;
    reviews: Review[];
    userReview: Review | null;
    canReview: boolean;
    auth?: {
        user: User;
    };
}

export default function Reviews({ game, reviews, userReview, canReview, auth }: ReviewsProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [rating, setRating] = useState(userReview ? userReview.rating : 5);
    const [comment, setComment] = useState(userReview ? userReview.comment : '');
    const [hoveredRating, setHoveredRating] = useState(0);
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Videojuegos',
            href: '/games',
        },
        {
            title: game.name,
            href: `/games/${game.id}/reviews`,
        },
        {
            title: 'Reviews',
            href: `/games/${game.id}/reviews`,
        },
    ];
    
    // Función para renderizar estrellas según el rating
    const renderStars = (rating: number) => {
        const stars = [];
        
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star 
                    key={i} 
                    className="h-5 w-5" 
                    fill={i <= rating ? "#FFD700" : "none"} 
                    stroke={i <= rating ? "#FFD700" : "#6b7280"}
                />
            );
        }
        
        return stars;
    };
    
    // Función para enviar una nueva review
    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (userReview) {
            // Actualizar review existente
            router.put(`/reviews/${userReview.id}`, {
                rating,
                comment
            });
        } else {
            // Crear nueva review
            router.post(`/games/${game.id}/reviews`, {
                rating,
                comment
            });
        }
        
        setIsEditing(false);
    };    
   
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Reviews de ${game.name}`}>
                <link rel="icon" href="/icono.png" type="image/x-icon" />
            </Head>
            
            <div className="container py-8">
                <div className="mb-8 flex items-start gap-6">
                    {/* Imagen del juego */}
                    {game.background_image && (
                        <img 
                            src={game.background_image} 
                            alt={game.name} 
                            className="h-64 w-64 rounded-lg object-cover shadow-lg"
                        />
                    )}
                    
                    <div>
                        <h1 className="text-3xl font-bold">{game.name}</h1>
                        <div className="mt-2 flex items-center gap-2">
                            <div className="flex items-center">{renderStars(game.rating)}</div>
                            <span className="text-lg font-semibold">
                                {game.rating.toFixed(1)}/5
                            </span>
                        </div>
                        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Valoración basada en {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} de la comunidad
                        </div>
                        {game.released && (
                            <p className="mt-3 text-gray-600 dark:text-gray-400">
                                Fecha de lanzamiento: {new Date(game.released).toLocaleDateString()}
                            </p>
                        )}
                    {game.metacritic && (
                         <p className="mt-1 text-gray-600 dark:text-gray-400">
                              Metacritic: {game.metacritic}
                         </p>
                    )}   
                    </div>
                </div>
                
                {/* Formulario para crear/editar review */}
                {auth?.user && (canReview || isEditing) && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>
                                {userReview ? 'Editar tu review' : 'Escribe tu review'}
                            </CardTitle>
                            <CardDescription>
                                Comparte tu opinión sobre este juego con la comunidad
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={submitReview}>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">Tu valoración:</label>
                                    <div className="mt-1 flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <Star 
                                                key={value}
                                                className="h-8 w-8 cursor-pointer"
                                                fill={(hoveredRating || rating) >= value ? "#FFD700" : "none"}
                                                stroke={(hoveredRating || rating) >= value ? "#FFD700" : "currentColor"}
                                                onMouseEnter={() => setHoveredRating(value)}
                                                onMouseLeave={() => setHoveredRating(0)}
                                                onClick={() => setRating(value)}
                                            />
                                        ))}
                                        <span className="ml-2 text-lg font-semibold">
                                            {hoveredRating || rating}/5
                                        </span>
                                    </div>
                                </div>
                                
                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium">
                                        Tu comentario:
                                    </label>
                                    <Textarea
                                        id="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="mt-1"
                                        placeholder="Escribe tu opinión sobre este juego (opcional)"
                                        rows={5}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                {userReview && (
                                    <Button 
                                        type="button" 
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setRating(userReview.rating);
                                            setComment(userReview.comment);
                                        }}
                                    >
                                        Cancelar
                                    </Button>
                                )}
                                <Button type="submit">
                                    {userReview ? 'Actualizar review' : 'Publicar review'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                )}
                
                {/* Review del usuario (cuando no está editando) */}
                {auth?.user && userReview && !isEditing && (
                    <Card className="mb-8 border-2 border-primary">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    Tu review
                                    <div className="flex">
                                        {renderStars(userReview.rating)}
                                    </div>
                                </CardTitle>
                                <CardDescription>
                                    {new Date(userReview.created_at).toLocaleString()}
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>                              
                            </div>
                        </CardHeader>
                        <CardContent>
                            {userReview.comment ? (
                                <p>{userReview.comment}</p>
                            ) : (
                                <p className="text-gray-500 italic">Sin comentario</p>
                            )}
                        </CardContent>
                    </Card>
                )}
                
                {/* Mensaje para iniciar sesión si el usuario no está autenticado */}
                {!auth?.user && (
                    <div className="mb-8 rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-800">
                        <p>Para escribir una review, necesitas <a href="/login" className="text-primary hover:underline">iniciar sesión</a> o <a href="/register" className="text-primary hover:underline">registrarte</a>.</p>
                    </div>
                )}
                
                {/* Lista de reviews de otros usuarios */}
                <h2 className="mb-4 text-2xl font-bold">Todas las reviews</h2>
                
                {reviews.length === 0 ? (
                    <div className="rounded-lg bg-gray-100 p-4 text-center dark:bg-gray-800">
                        <p>Aún no hay reviews para este juego. ¡Sé el primero en opinar!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            // No mostrar la review del usuario actual, ya se muestra arriba
                            auth?.user?.id !== review.user_id && (
                                <Card key={review.id}>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle className="flex items-center gap-2">
                                                    {review.user.name}
                                                    <div className="flex">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                </CardTitle>
                                                <CardDescription>
                                                    {new Date(review.created_at).toLocaleString()}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {review.comment ? (
                                            <p>{review.comment}</p>
                                        ) : (
                                            <p className="text-gray-500 italic">Sin comentario</p>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}