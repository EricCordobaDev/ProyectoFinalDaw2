import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import AiChatBot from '@/components/chat-assistant';
import PostForm from '@/components/post-form';
import PostCard from '@/components/post-card';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
           <Head title="Inicio">
                <link rel="icon" href="icono.png" type="image/x-icon" />
            </Head>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="max-w-3xl mx-auto w-full">
                    <PostForm />
                    
                    <div className="space-y-4">
                        {localPosts.length > 0 ? (
                            localPosts.map((post) => (
                                <PostCard 
                                    key={post.id} 
                                    post={post} 
                                    currentUserId={currentUserId}
                                    onDelete={handleDelete}
                                    onLike={handleLike}
                                />
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                No hay publicaciones todavía. ¡Sé el primero en publicar algo!
                            </div>
                        )}
                    </div>
                </div>
            </div>
          
            <AiChatBot />
        </AppLayout>
    );
    
}
