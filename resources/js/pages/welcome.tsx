import AppearanceTabs from '@/components/appearance-tabs';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Bienvenido" />           
                {/* Navigation Bar */}
                <nav className="bg-gray-800 p-4">
                    <div className="container">                    

                        <div className="flex space-x-3">
                            <AppearanceTabs />
                            {auth.user ? (
                                <Link href={route('dashboard')} className="rounded bg-purple-600 px-3 py-1 transition hover:bg-purple-700">
                                    Inicio
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="rounded bg-purple-600 px-3 py-1 transition hover:bg-purple-500"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link href={route('register')} className="rounded bg-purple-600 px-3 py-1 transition hover:bg-purple-700">
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
          
        </>
    );
}
