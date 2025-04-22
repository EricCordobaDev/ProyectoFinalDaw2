import { Button } from '@/components/ui/button';
import { Star as StarIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';

interface GameCardProps {
    game: {
        id: number;
        name: string;
        background_image?: string;
        released?: string;
        metacritic?: number;
        rating: number;
        saved_by_user: boolean;
    };
    onSave: (gameId: number) => void;
}

export default function GameCard({ game, onSave }: GameCardProps) {
    // Función para renderizar estrellas según el rating
    const renderStars = (rating: number) => {
        // Asumimos que el rating está en escala 0-5
        // Si está en otra escala (ej. 0-10), normalizamos a 0-5
        const normalizedRating = rating > 5 ? rating / 2 : rating;
        const fullStars = Math.floor(normalizedRating);
        const stars = [];

        // Creamos 5 estrellas
        for (let i = 0; i < 5; i++) {
            // Si la posición actual es menor que el número de estrellas completas, la pintamos
            stars.push(
                <StarIcon 
                    key={i} 
                    className="h-4 w-4" 
                    fill={i < fullStars ? "#FFD700" : "none"} 
                    stroke={i < fullStars ? "#FFD700" : "currentColor"}
                />
            );
        }
        
        return stars;
    };

    // Prevenir que los clics en botones propaguen al contenedor
    const handleButtonClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <Link href={`/games/${game.id}`} className="block">
            <div className="relative overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105 dark:bg-gray-800">
                {/* Puntuación Metacritic con colores según el valor */}
                {game.metacritic !== undefined && game.metacritic > 0 && (
                    <div 
                        className={`absolute top-2 right-2 z-10 rounded px-2 py-1 font-bold text-sm ${
                            game.metacritic >= 75 ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 
                            game.metacritic >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' : 
                            'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        }`}>
                        {game.metacritic}
                    </div>
                )}

                <div className="h-48 overflow-hidden">
                    {game.background_image ? (
                        <img src={game.background_image} alt={game.name} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                            <span className="text-gray-400">Sin imagen</span>
                        </div>
                    )}
                </div>
                
                <div className="p-4">
                    <h3 className="mb-2 line-clamp-2 text-lg font-bold">{game.name}</h3>
                    
                    {/* Rating con estrellas */}
                    <div className="mb-2 flex items-center space-x-0.5">
                        {renderStars(game.rating)}
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            {game.released ? new Date(game.released).toLocaleDateString() : 'Fecha desconocida'}
                        </div>
                    </div>
                    
                    <div className="mt-4 flex flex-col space-y-2">
                        <Button
                            onClick={(e) => {
                                handleButtonClick(e);
                                onSave(game.id);
                            }}
                            className="w-full bg-violet-600 text-white hover:bg-violet-700" // Añadimos clases para el color violeta
                        >
                            {game.saved_by_user ? 'En tu biblioteca' : 'Añadir a la Biblioteca'}
                        </Button>                        
                        
                    </div>
                </div>
            </div>
        </Link>
    );
}