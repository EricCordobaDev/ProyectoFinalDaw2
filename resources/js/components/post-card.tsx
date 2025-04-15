import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Heart, MessageCircle, MoreHorizontal, Trash2, Edit2, Share2 } from 'lucide-react';
import { 
    Tooltip, 
    TooltipContent, 
    TooltipProvider, 
    TooltipTrigger 
} from '@/components/ui/tooltip';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface PostCardProps {
    post: {
        id: number;
        content: string;
        image?: string;
        likes: number;
        created_at: string;
        post_date: string;
        liked_by_user?: boolean;
        user: {
            id: number;
            name: string;
            image?: string;
        };
    };
    currentUserId?: number;
    onDelete?: (id: number) => void;
    onLike?: (id: number) => void;
}

export default function PostCard({ post, onLike, onDelete, currentUserId }: PostCardProps) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    
    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevenir comportamiento por defecto
        if (!onLike) return;
        onLike(post.id);
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(post.id);
        }
    };

    const isAuthor = currentUserId === post.user.id;
    
    // Función para compartir la publicación
    const handleShare = async () => {
        try {
            const shareData = {
                title: `Publicación de ${post.user.name}`,
                text: post.content.substring(0, 100) + (post.content.length > 100 ? '...' : ''),
                url: `${window.location.origin}/posts/${post.id}`,
            };
            
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback para navegadores que no soportan la API Web Share
                navigator.clipboard.writeText(shareData.url);
                // Aquí se podría mostrar un toast de éxito
                console.log('URL copiada al portapapeles');
            }
        } catch (error) {
            console.error('Error al compartir', error);
        }
    };

    return (
        <Card className="mb-4 overflow-hidden border shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <div className="flex items-center gap-3">
                    <HoverCard>
                        <HoverCardTrigger asChild>
                            <Link href={`/profile?userId=${post.user.id}`} className="transition-transform hover:scale-105">
                                <Avatar className="h-10 w-10">
                                    {post.user.image ? (
                                        <AvatarImage src={`/storage/${post.user.image}`} alt={`${post.user.name} avatar`} />
                                    ) : (
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {post.user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </Link>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                            <div className="flex justify-between space-x-4">
                                <Avatar className="h-12 w-12">
                                    {post.user.image ? (
                                        <AvatarImage src={`/storage/${post.user.image}`} alt={`${post.user.name} avatar`} />
                                    ) : (
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {post.user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">{post.user.name}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        Ver perfil completo para más información
                                    </p>
                                    <div className="flex items-center pt-2">
                                        <Link href={`/profile?userId=${post.user.id}`}>
                                            <Button variant="outline" size="sm">Ver perfil</Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                    <div className="flex flex-col">
                        <Link 
                            href={`/profile?userId=${post.user.id}`} 
                            className="font-medium hover:text-primary hover:underline"
                        >
                            {post.user.name}
                        </Link>
                        <p className="text-muted-foreground text-xs">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: es })}
                        </p>
                    </div>
                </div>

              
            </CardHeader>
            
            <CardContent>
                <p className="whitespace-pre-line text-sm md:text-base">{post.content}</p>
                {post.image && (
                    <div className="mx-auto mt-3 overflow-hidden rounded-md">
                        <img 
                            src={`/storage/${post.image}`} 
                            className="h-auto max-h-[500px] w-full object-cover transition-transform hover:scale-[1.01]" 
                            alt="Imagen de la publicación"
                            loading="lazy"
                        />
                    </div>
                )}
            </CardContent>
            
            <CardFooter className="flex justify-between border-t bg-muted/10 px-4 py-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleLike} 
                                className={`flex gap-1.5 transition-colors ${post.liked_by_user ? 'text-red-500' : 'hover:text-red-400'}`}
                            >
                                <Heart 
                                    className={`h-4 w-4 ${post.liked_by_user ? 'fill-red-500 text-red-500' : ''} transition-transform hover:scale-110`} 
                                />
                                <span>{post.likes || 0}</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{post.liked_by_user ? 'Quitar me gusta' : 'Me gusta'}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                
                <div className="flex gap-2">
                    <Link href={`/posts/${post.id}`}>
                        <Button variant="ghost" size="sm" className="flex gap-1.5">
                            <MessageCircle className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only">Comentar</span>
                        </Button>
                    </Link>                   
                  
                  
                  
                </div>
            </CardFooter>
        </Card>
    );
}
