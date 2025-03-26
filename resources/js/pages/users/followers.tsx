import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { UserInfo } from '@/components/user-info';

interface FollowersProps {
    user: {
        id: number;
        name: string;
    };
    followers: {
        data: Array<{
            id: number;
            follower: {
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

export default function Followers({ user, followers }: FollowersProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `Perfil de ${user.name}`,
            href: `/profile?userId=${user.id}`,
        },
        {
            title: 'Seguidores',
            href: `/users/${user.id}/followers`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Seguidores de ${user.name}`} />

            <div className="flex h-full flex-1 flex-col rounded-xl p-4">
                <div className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                    <h1 className="mb-6 text-2xl font-bold">Seguidores de {user.name}</h1>

                    <div className="space-y-4">
                        {followers.data.length > 0 ? (
                            followers.data.map((follow) => (
                                <div
                                    key={follow.id}
                                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <UserInfo user={follow.follower} showEmail={true} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500">
                                {user.name} no tiene seguidores todavía.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}