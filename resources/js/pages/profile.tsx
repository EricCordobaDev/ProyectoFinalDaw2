import AiChatBot from '@/components/chat-assistant';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Settings, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perfil',
        href: '/profile',
    },
];

export default function Profile() {
    const { auth } = usePage<SharedData>().props;
    const cleanup = useMobileNavigation();

    const handleDeleteGame = (gameId) => {
        router.delete(route('user.games.destroy', gameId));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perfil">
                <link rel="icon" href="icono.png" type="image/x-icon" />
            </Head>

            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Información del perfil */}
                <div className="rounded-lg p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Perfil de {auth.user.name}</h1>
                        <Link
                            className="flex items-center rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                            href={route('profile.edit')}
                            as="button"
                            prefetch
                            onClick={cleanup}
                        >
                            <Settings className="mr-2" size={18} />
                            Configuración
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2"></div>
                </div>

                {/* Sección de juegos */}
                <div className="rounded-lg p-6">
                    <h2 className="mb-4 text-xl font-bold">Mis Juegos</h2>

                    {auth.user.games && auth.user.games.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {auth.user.games.map((game) => (
                                <div
                                    key={game.id}
                                    className="overflow-hidden rounded-lg bg-white shadow-lg transition-transform hover:scale-105 dark:bg-gray-800"
                                >
                                    <div className="h-48 overflow-hidden">
                                        {game.background_image ? (
                                            <img src={game.background_image} alt={game.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                                                <span className="text-gray-400">Sin imagen</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="mb-2 line-clamp-2 text-lg font-bold">{game.name}</h3>
                                        <div className="mt-2 flex items-center justify-between">
                                            <button
                                                onClick={() => handleDeleteGame(game.id)}
                                                className="flex items-center rounded bg-red-50 px-3 py-1 text-sm text-red-500 transition-colors hover:bg-red-100 hover:text-red-700 dark:bg-gray-700 dark:hover:bg-gray-600"
                                            >
                                                <Trash2 size={16} className="mr-1" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg bg-gray-50 py-10 text-center dark:bg-gray-700">
                            <p className="text-muted-foreground">
                                No tienes juegos en tu biblioteca todavía.
                                <Link href={route('games')} className="ml-1 text-blue-600 hover:text-blue-800">
                                    Explorar catálogo
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <AiChatBot />
        </AppLayout>
    );
}
