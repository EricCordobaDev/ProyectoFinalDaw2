import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const breadcrumbs: BreadcrumbItem[] = [    
    {
        title: 'Manual de Usuario',
        href: '/manual',
    },
];

export default function Manual() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manual de Usuario">
                <link rel="icon" href="icono.png" type="image/x-icon" />
            </Head>
            <div className="flex h-full flex-1 flex-col gap-4 p-4 md:p-5">
                <Card className="border-none shadow-sm bg-gradient-to-br from-background to-muted/40">
                    <CardHeader>
                        <CardTitle>Manual de Usuario</CardTitle>
                        <CardDescription>Guía completa para utilizar la aplicación.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Puesta en marcha</AccordionTrigger>
                                <AccordionContent>
                                    <p>Aquí se explicará cómo iniciar la aplicación, requisitos previos, registro e inicio de sesión.</p>
                                    <h4 className="font-semibold mt-2">Requisitos previos:</h4>
                                    <ul className="list-disc pl-5">
                                        <li>Conexión a internet estable.</li>
                                        <li>Navegador actualizado (Google Chrome, Firefox, etc.).</li>
                                        <li>Cuenta de usuario registrada.</li>
                                    </ul>
                                    <h4 className="font-semibold mt-2">Pasos para iniciar:</h4>
                                    <ol className="list-decimal pl-5">
                                        <li>Accede a la URL de la aplicación.</li>
                                        <li>Haz clic en "Registrarse" si no tienes cuenta, o "Iniciar sesión" si ya estás registrado.</li>
                                        <li>Introduce tus credenciales y accede al sistema.</li>
                                    </ol>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Manejo de los menús o acceso a cada módulo</AccordionTrigger>
                                <AccordionContent>
                                    <p>Descripción de la interfaz principal, la barra de navegación, y cómo acceder a las diferentes secciones como el Dashboard, Perfil, Juegos, Mensajes, etc.</p>
                                    <h4 className="font-semibold mt-2">Perfil de Usuario Registrado:</h4>
                                    <ul className="list-disc pl-5">
                                        <li>Dashboard: Feed principal con publicaciones.</li>
                                        <li>Perfil: Ver y editar tu información, ver tus juegos guardados, seguidores y seguidos.</li>
                                        <li>Juegos: Explorar el catálogo de juegos, ver detalles y guardar juegos.</li>
                                        <li>Mensajes: Chatear con otros usuarios.</li>
                                        <li>Noticias: Ver las últimas noticias sobre videojuegos.</li>
                                        <li>Configuración: Ajustes de la cuenta.</li>
                                    </ul>
                                    
                                                                  
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Gestión periódica del sistema</AccordionTrigger>
                                <AccordionContent>
                                    <p>Tareas recomendadas para mantener el sistema funcionando correctamente (principalmente para administradores).</p>
                                    <ul className="list-disc pl-5">
                                        <li>Revisión de logs: Verifica errores y eventos importantes en el sistema.</li>
                                        <li>Actualización de dependencias: Mantén el software actualizado para evitar vulnerabilidades.</li>
                                        <li>Monitorización del rendimiento: Usa herramientas como Google Analytics o servicios de monitoreo.</li>
                                        <li>Gestión de usuarios inactivos: Elimina o desactiva cuentas que no se usen.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>Realización de copias de seguridad</AccordionTrigger>
                                <AccordionContent>
                                    <p>Instrucciones sobre cómo realizar copias de seguridad de la base de datos y los archivos importantes de la aplicación.</p>
                                    <h4 className="font-semibold mt-2">Pasos para realizar una copia de seguridad:</h4>
                                    <ol className="list-decimal pl-5">
                                        <li>Accede al panel de administración del servidor.</li>
                                        <li>Exporta la base de datos en formato SQL (por ejemplo, `proyecto_final.sql`).</li>
                                        <li>Descarga el directorio `storage/app` y guárdalo en un lugar seguro.</li>
                                        <li>Guarda las copias en un almacenamiento externo o en la nube.</li>
                                    </ol>
                                    <p>Frecuencia recomendada: Semanal o antes de realizar actualizaciones importantes.</p>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-5">
                                <AccordionTrigger>Mensajes de error</AccordionTrigger>
                                <AccordionContent>
                                    <p>Listado de posibles mensajes de error comunes y sus soluciones o significados.</p>
                                    <ul className="list-disc pl-5">
                                        <li>Error 404: Página no encontrada. Verifica la URL.</li>
                                        <li>Error 500: Error interno del servidor. Contacta al administrador.</li>
                                        <li>Error de validación: Revisa los campos del formulario marcados en rojo.</li>
                                        <li>Error de autenticación: Credenciales incorrectas. Intenta nuevamente o restablece tu contraseña.</li>
                                        <li>Error de conexión: Verifica tu conexión a internet o contacta al soporte técnico.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-6">
                                <AccordionTrigger>Glosario de términos</AccordionTrigger>
                                <AccordionContent>
                                    <p>Definiciones de términos específicos utilizados en la aplicación.</p>
                                    <ul className="list-disc pl-5">
                                        <li><strong>Post:</strong> Publicación realizada por un usuario en el feed principal.</li>
                                        <li><strong>Review:</strong> Reseña u opinión sobre un videojuego.</li>
                                        <li><strong>Feed:</strong> Flujo de publicaciones en el dashboard.</li>
                                        <li><strong>Seguidor/Following:</strong> Usuarios que sigues o te siguen.</li>
                                        <li><strong>Dashboard:</strong> Página principal con un resumen de actividades.</li>
                                        <li><strong>Notificaciones:</strong> Alertas sobre eventos importantes en la aplicación.</li>
                                        <li><strong>Backup:</strong> Copia de seguridad de datos importantes.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}