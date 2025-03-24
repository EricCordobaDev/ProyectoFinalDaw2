import AiChatBot from '@/components/chat-assistant';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Settings, Star, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Mensajes',
        href: '/messages',
    },
];

export default function Profile() {
    const { auth } = usePage<SharedData>().props;
    const cleanup = useMobileNavigation();


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfil">
                <link rel="icon" href="icono.png" type="image/x-icon" />
            </Head>

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
              
                <div className="rounded-lg p-6">
                  
                </div>
            </div>

            <AiChatBot />
        </AppLayout>
    );
}
