import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import AiChatBot from '@/components/chat-assistant';
import PostForm from '@/components/post-form';
import PostCard from '@/components/post-card';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';


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
        const form = document.createElement('form');
        form.action = route('posts.destroy', postId);
        form.method = 'POST';
        form.innerHTML = `<input type="hidden" name="_token" value="${(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content}" />
                           <input type="hidden" name="_method" value="DELETE" />`;
        document.body.appendChild(form);
        form.submit();
    };
    
    const handleLike = (postId: number) => {
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
        
        router.visit(route('posts.like', postId), {
            method: 'post',
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
            },
            onError: (errors) => {
                console.error('Error:', errors);
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
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-5">
                <div className="mx-auto w-full max-w-3xl">
                    <Card className="mb-6 border-none shadow-sm bg-gradient-to-br from-background to-muted/40">
                        <CardContent className="p-4 sm:p-6">
                            <PostForm />
                        </CardContent>
                    </Card>                    
                   
                    
                    <ScrollArea className="h-[calc(95vh-300px)]">
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
                                >
                                    <Card className="border-dashed">
                                        <CardHeader>
                                            <CardTitle className="text-center">Sin publicaciones</CardTitle>
                                            <CardDescription className="text-center">
                                                No hay publicaciones todavía. ¡Sé el primero en publicar algo!
                                            </CardDescription>
                                        </CardHeader>                                       
                                    </Card>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </ScrollArea>
                </div>
            </div>
          
            <AiChatBot />
        </AppLayout>
    );
    
}
