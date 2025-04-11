import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Heart, MessageCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
    const handleLike = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevenir comportamiento por defecto
        if (!onLike) return;
        onLike(post.id);
    };

    const isAuthor = currentUserId === post.user.id;

    return (
        <Card className="mb-4 overflow-hidden border shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-2">
                <div className="flex items-center gap-3">
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
