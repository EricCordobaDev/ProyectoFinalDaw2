import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import AiChatBot from '@/components/chat-assistant';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inicio',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inicio" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                
                        
            </div>
          
            <AiChatBot />
        </AppLayout>
    );
    
}
