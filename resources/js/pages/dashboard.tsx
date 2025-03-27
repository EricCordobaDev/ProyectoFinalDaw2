import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import AiChatBot from '@/components/chat-assistant';
import PostForm from '@/components/post-form';
import PostCard from '@/components/post-card';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
];

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
        avatar?: string;
    };
}

export default function Dashboard({ posts = [] }: { posts: Post[] }) {
    const { auth } = usePage().props as any;
    const currentUserId = auth.user?.id;
    const [localPosts, setLocalPosts] = useState(posts);
    const [isRefreshing, setIsRefreshing] = useState(false);
    
    useEffect(() => {
        setLocalPosts(posts);
    }, [posts]);
    
    const handleDelete = (postId: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
            const form = document.createElement('form');
            form.action = route('posts.destroy', postId);
            form.method = 'POST';
            form.innerHTML = `<input type="hidden" name="_token" value="${(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content}" />
                               <input type="hidden" name="_method" value="DELETE" />`;
            document.body.appendChild(form);
            form.submit();
        }
    };
    
    const handleLike = (postId: number) => {
        // Actualizamos primero el estado local para dar feedback inmediato al usuario
        setLocalPosts(prevPosts => 
            prevPosts.map(post => {
                if (post.id === postId) {
                    const newLikedStatus = !post.liked_by_user;
                    return {
                        ...post,
                        liked_by_user: newLikedStatus,
                        likes: newLikedStatus ? post.likes + 1 : post.likes - 1
                    };
                }
                return post;
            })
        );
        
        // Luego realizamos la petición en segundo plano sin mostrar indicadores visuales
        router.post(route('posts.like', postId), {}, {
            preserveScroll: true,
            preserveState: true,
            // Estas opciones evitan que se muestre cualquier indicador visual de carga
            only: [],
            onSuccess: () => {
                // La acción ya se reflejó en la UI con el cambio de estado anterior
            },
            onError: (errors) => {
                console.error('Error:', errors);
                // Revertimos el cambio en caso de error
                setLocalPosts(prevPosts => 
                    prevPosts.map(post => {
                        if (post.id === postId) {
                            const revertedLikedStatus = post.liked_by_user;
                            return {
                                ...post,
                                liked_by_user: !revertedLikedStatus,
                                likes: !revertedLikedStatus ? post.likes - 1 : post.likes + 1
                            };
                        }
                        return post;
                    })
                );
            }
        });
    };

    const refreshFeed = () => {
        setIsRefreshing(true);
        router.reload({
            onSuccess: () => setIsRefreshing(false),
            onError: () => setIsRefreshing(false),
            onFinish: () => setIsRefreshing(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
           <Head title="Inicio">
                <link rel="icon" href="icono.png" type="image/x-icon" />
            </Head>
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-6">
                <div className="mx-auto w-full max-w-3xl">
                    <Card className="mb-6 border-none shadow-sm bg-gradient-to-br from-background to-muted/40">
                        <CardContent className="p-4 sm:p-6">
                            <PostForm />
                        </CardContent>
                    </Card>
                    
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold tracking-tight">Tu feed</h2>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={refreshFeed}
                            disabled={isRefreshing}
                            className="flex items-center gap-2"
                        >
                            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            <span className="hidden sm:inline">Actualizar</span>
                        </Button>
                    </div>
                    
                
                            <AnimatePresence>
                                {localPosts.length > 0 ? (
                                    <motion.div className="space-y-4">
                                        {localPosts.map((post) => (
                                            <motion.div 
                                                key={post.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <PostCard 
                                                    post={post} 
                                                    currentUserId={currentUserId}
                                                    onDelete={handleDelete}
                                                    onLike={handleLike}
                                                />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="rounded-lg border border-dashed p-10 text-center"
                                    >
                                        <p className="text-muted-foreground">No hay publicaciones todavía. ¡Sé el primero en publicar algo!</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                       
                </div>
            </div>
          
            <AiChatBot />
        </AppLayout>
    );
    
}
