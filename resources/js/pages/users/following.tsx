import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { UserInfo } from '@/components/user-info';

interface FollowingProps {
    user: {
        id: number;
        name: string;
    };
    following: {
        data: Array<{
            id: number;
            followed: {
                id: number;
                name: string;
                email: string;
                image?: string;
            };
        }>;
        meta: {
            current_page: number;
            last_page: number;
        };
    };
}

export default function Following({ user, following }: FollowingProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `Perfil de ${user.name}`,
            href: `/profile?userId=${user.id}`,
        },
        {
            title: 'Siguiendo',
            href: `/users/${user.id}/following`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Usuarios que sigue ${user.name}`} />

            <div className="flex h-full flex-1 flex-col rounded-xl p-4">
                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <h1 className="mb-6 text-2xl font-bold">Usuarios que sigue {user.name}</h1>

                    <div className="space-y-4">
                        {following.data.length > 0 ? (
                            following.data.map((follow) => (
                                <div
                                    key={follow.id}
                                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <UserInfo user={follow.followed} showEmail={true} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500">
                                {user.name} no sigue a ningún usuario todavía.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}