import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronRight, Gamepad2, Users, Trophy, MessageSquare } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="GameConnect - La red social para gamers">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-gray-900 text-white">
                {/* Navigation Bar */}
                <nav className="bg-gray-800 p-4">
                    <div className="container mx-auto flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Gamepad2 className="text-purple-500" size={24} />
                            <span className="text-xl font-bold text-purple-500">GameConnect</span>
                        </div>
                        <div className="hidden md:flex space-x-6">
                            <a href="#features" className="hover:text-purple-400">Características</a>
                            <a href="#community" className="hover:text-purple-400">Comunidad</a>
                            <a href="#download" className="hover:text-purple-400">Descargar</a>
                        </div>
                        <div className="flex space-x-3">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 transition"
                                >
                                    Panel de Control
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-3 py-1 rounded border border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white transition"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-700 transition"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="bg-gradient-to-r from-purple-900 to-blue-900 py-20">
                    <div className="container mx-auto px-4 flex flex-col items-center text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Conecta. Juega. Conquista.</h1>
                        <p className="text-xl mb-8 max-w-2xl">
                            La red social definitiva para gamers. Conecta con otros jugadores, comparte tus logros, organiza partidas y mantente al día con las últimas noticias del mundo gaming.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href={route('register')}
                                className="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 font-bold flex items-center justify-center"
                            >
                                Únete Ahora
                                <ChevronRight size={20} className="ml-2" />
                            </Link>
                            <button className="px-6 py-3 rounded-full bg-gray-800 hover:bg-gray-700 font-bold">
                                Ver Demo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div id="features" className="py-16 bg-gray-800">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Características Principales</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gray-700 p-6 rounded-lg text-center">
                                <div className="flex justify-center mb-4">
                                    <Users size={48} className="text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Comunidades por Juego</h3>
                                <p>Únete a comunidades específicas para tus juegos favoritos y conecta con jugadores que comparten tus mismas pasiones.</p>
                            </div>
                            
                            <div className="bg-gray-700 p-6 rounded-lg text-center">
                                <div className="flex justify-center mb-4">
                                    <Trophy size={48} className="text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Seguimiento de Logros</h3>
                                <p>Muestra tus logros de juego, comparte capturas de pantalla y presume de tus mejores momentos con toda la comunidad.</p>
                            </div>
                            
                            <div className="bg-gray-700 p-6 rounded-lg text-center">
                                <div className="flex justify-center mb-4">
                                    <MessageSquare size={48} className="text-purple-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Chat en Tiempo Real</h3>
                                <p>Comunícate con otros jugadores, organiza partidas y estrategias a través de nuestro sistema avanzado de chat.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Community Section */}
                <div id="community" className="py-16 bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="md:w-1/2 mb-8 md:mb-0">
                                <h2 className="text-3xl font-bold mb-4">Únete a una comunidad de millones de gamers</h2>
                                <p className="text-gray-300 mb-6">
                                    GameConnect es más que una red social, es un hogar para todos los amantes de los videojuegos donde puedes:
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center">
                                        <div className="bg-purple-600 p-1 rounded-full mr-3">
                                            <ChevronRight size={16} />
                                        </div>
                                        Encontrar compañeros para tus juegos favoritos
                                    </li>
                                    <li className="flex items-center">
                                        <div className="bg-purple-600 p-1 rounded-full mr-3">
                                            <ChevronRight size={16} />
                                        </div>
                                        Participar en torneos y eventos exclusivos
                                    </li>
                                    <li className="flex items-center">
                                        <div className="bg-purple-600 p-1 rounded-full mr-3">
                                            <ChevronRight size={16} />
                                        </div>
                                        Descubrir nuevos juegos basados en tus preferencias
                                    </li>
                                    <li className="flex items-center">
                                        <div className="bg-purple-600 p-1 rounded-full mr-3">
                                            <ChevronRight size={16} />
                                        </div>
                                        Conseguir descuentos exclusivos en juegos
                                    </li>
                                </ul>
                            </div>
                            
                            <div className="md:w-1/2 flex justify-center">
                                <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                                            <Users size={24} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-bold">Grupo: Fans de RPG</div>
                                            <div className="text-sm text-gray-400">8,542 miembros</div>
                                        </div>
                                        <button className="ml-auto bg-purple-600 px-3 py-1 rounded hover:bg-purple-700">
                                            Unirse
                                        </button>
                                    </div>
                                    
                                    <div className="bg-gray-700 p-3 rounded mb-4">
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                                            <div className="ml-2">
                                                <div className="font-medium">GamerX42</div>
                                                <p className="text-sm">¿Alguien para una partida de Elden Ring esta noche?</p>
                                            </div>
                                        </div>
                                        <div className="flex mt-2 text-sm text-gray-400">
                                            <span className="mr-4">Me gusta (24)</span>
                                            <span>Respuestas (8)</span>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-700 p-3 rounded">
                                        <div className="flex items-start">
                                            <div className="w-8 h-8 bg-green-600 rounded-full"></div>
                                            <div className="ml-2">
                                                <div className="font-medium">DragonSlayer</div>
                                                <p className="text-sm">¡Acabo de conseguir el logro más difícil en God of War! 🏆</p>
                                            </div>
                                        </div>
                                        <div className="flex mt-2 text-sm text-gray-400">
                                            <span className="mr-4">Me gusta (37)</span>
                                            <span>Respuestas (12)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Download Section */}
                <div id="download" className="py-16 bg-gradient-to-r from-purple-900 to-blue-900">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-6">Disponible en todas las plataformas</h2>
                        <p className="text-xl mb-8 max-w-2xl mx-auto">
                            Mantente conectado en cualquier momento y lugar. Descarga GameConnect ahora y lleva tu experiencia gaming al siguiente nivel.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg flex items-center">
                                <span className="text-2xl mr-2">🍎</span>
                                <div className="text-left">
                                    <div className="text-xs">Descargar en</div>
                                    <div className="font-bold">App Store</div>
                                </div>
                            </button>
                            <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg flex items-center">
                                <span className="text-2xl mr-2">🤖</span>
                                <div className="text-left">
                                    <div className="text-xs">Descargar en</div>
                                    <div className="font-bold">Google Play</div>
                                </div>
                            </button>
                            <button className="bg-gray-800 hover:bg-gray-700 px-6 py-3 rounded-lg flex items-center">
                                <span className="text-2xl mr-2">💻</span>
                                <div className="text-left">
                                    <div className="text-xs">Disponible para</div>
                                    <div className="font-bold">Windows/Mac</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="bg-gray-800 py-8">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex items-center mb-4 md:mb-0">
                                <Gamepad2 className="text-purple-500 mr-2" size={20} />
                                <span className="font-bold text-purple-500">GameConnect</span>
                            </div>
                            <div className="flex space-x-6 mb-4 md:mb-0">
                                <a href="#" className="text-gray-400 hover:text-white">Acerca de</a>
                                <a href="#" className="text-gray-400 hover:text-white">Blog</a>
                                <a href="#" className="text-gray-400 hover:text-white">Privacidad</a>
                                <a href="#" className="text-gray-400 hover:text-white">Términos</a>
                            </div>
                            <div className="text-gray-400 text-sm">
                                © 2025 GameConnect. Todos los derechos reservados.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
