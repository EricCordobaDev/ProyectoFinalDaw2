import AiChatBot from '@/components/chat-assistant';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Noticias',
        href: '/news',
    },
];

interface NewsItem {
    title: string;
    url: string;
    image: string; 
    date: string;
}

export default function News() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get('/api/news');
                if (response.data.error) {
                    setError(response.data.message);
                } else {
                    setNews(response.data);
                }
            } catch (err) {
                setError('Error al cargar las noticias');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Noticias">
                <link rel="icon" href="icono.png" type="image/x-icon" />
            </Head>

            <div className="container py-6">
                <h1 className="text-3xl font-bold mb-6">Últimas Noticias de Videojuegos</h1>
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2">Cargando noticias...</span>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((item, index) => (
                            <Card key={index} className="overflow-hidden h-full flex flex-col">
                                {item.image && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img 
                                            src={item.image} 
                                            alt={item.title} 
                                            className="w-full h-full object-cover transition-transform hover:scale-105"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="line-clamp-2">
                                        <a 
                                            href={`${item.url}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="hover:text-primary transition-colors"
                                        >
                                            {item.title}
                                        </a>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-grow">                                    
                                </CardContent>
                                <CardFooter className="text-sm text-muted-foreground">
                                    {item.date}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
                
                <div className="mt-8">
                    <AiChatBot />
                </div>
            </div>
        </AppLayout>
    );
}

