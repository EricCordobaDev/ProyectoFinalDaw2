import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface NewsProps {
    news: {
        title: string;
        url: string;
        image: string;
    };
}

const Show: React.FC<NewsProps> = ({ news }) => {
    return (
        <AppLayout>
            <Head title={news.title} />

            <div className="container py-6">
                <h1 className="text-3xl font-bold mb-4">{news.title}</h1>

                {news.image && (
                    <div className="mb-4">
                        <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                    </div>
                )}

                <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    Leer más en la fuente original
                </a>
            </div>
        </AppLayout>
    );
};

export default Show;