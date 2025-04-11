import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import PostCard from '@/components/post-card';
import { usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        image?: string;
    };
}

interface Post {
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
}

interface PostShowProps {
    post: Post;
    comments: Comment[];
}

export default function PostShow({ post, comments: initialComments }: PostShowProps) {
    const { auth } = usePage().props as any;
    const currentUserId = auth.user?.id;
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localComments, setLocalComments] = useState(initialComments);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Inicio',
            href: '/dashboard',
        },
        {
            title: 'Publicación',
            href: `/posts/${post.id}`,
        },
    ];

    const handleLike = (postId: number) => {
        router.visit(route('posts.like', postId), {
            method: 'post',
            preserveScroll: true,
            preserveState: true
        });
    };
    
    const handleSubmitComment = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newComment.trim()) {
            return;
        }
        
        setIsSubmitting(true);
        
        router.post(route('comments.store', post.id), {
            content: newComment
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setNewComment('');
                // Actualizar los comentarios localmente para una experiencia más fluida
                const newLocalComment = {
                    id: Date.now(), // ID temporal mientras se recarga
                    content: newComment,
                    created_at: new Date().toISOString(),
                    user: {
                        id: auth.user.id,
                        name: auth.user.name,
                        image: auth.user.image
                    }
                };
                setLocalComments([newLocalComment, ...localComments]);
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };
  

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Publicación de ${post.user.name}`}>
                <link rel="icon" href="/icono.png" type="image/x-icon" />
            </Head>
            
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="mx-auto w-full max-w-3xl">
                    <PostCard 
                        post={post} 
                        currentUserId={currentUserId}
                        onLike={handleLike}
                    />
                    
                    <Card className="mb-6 overflow-hidden border">
                        <CardHeader className="pb-3">
                            <h3 className="text-lg font-medium">Comentarios ({localComments.length})</h3>
                        </CardHeader>
                        
                        <CardContent>
                            <form onSubmit={handleSubmitComment} className="mb-6">
                                <div className="flex items-start gap-3">
                                    <Avatar className="mt-1 h-9 w-9">
                                        {auth.user?.image ? (
                                            <AvatarImage src={`/storage/${auth.user.image}`} alt={`${auth.user.name} avatar`} />
                                        ) : (
                                            <AvatarFallback className="bg-primary/10 text-primary">
                                                {auth.user?.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="flex-1">
                                        <Textarea
                                            placeholder="Escribe un comentario..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            className="mb-2 resize-none"
                                            rows={2}
                                        />
                                        <div className="flex justify-end">
                                            <Button 
                                                type="submit" 
                                                size="sm" 
                                                disabled={isSubmitting || !newComment.trim()}
                                            >
                                                {isSubmitting ? 'Enviando...' : 'Comentar'}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            
                            {localComments.length > 0 ? (
                                <div className="space-y-4">
                                    {localComments.map((comment) => (
                                        <div key={comment.id} className="relative">
                                            <div className="flex gap-3">
                                                <Avatar className="h-8 w-8">
                                                    {comment.user.image ? (
                                                        <AvatarImage src={`/storage/${comment.user.image}`} alt={`${comment.user.name} avatar`} />
                                                    ) : (
                                                        <AvatarFallback className="bg-primary/10 text-primary">
                                                            {comment.user.name.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    )}
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-medium">{comment.user.name}</h4>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true, locale: es })}
                                                        </p>
                                                    </div>
                                                    <p className="mt-1 text-sm">{comment.content}</p>
                                                </div>
                                            </div>                                           
                                            
                                            
                                            <Separator className="mt-4" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-lg border border-dashed p-6 text-center">
                                    <p className="text-muted-foreground">No hay comentarios todavía. ¡Sé el primero en comentar!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}