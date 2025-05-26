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
                        <CardDescription>Guía práctica para aprovechar todas las funcionalidades de la aplicación.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">

                            {/* Sección: Uso básico */}
                            <h3 className="mt-4 mb-2 text-lg font-semibold">Uso básico</h3>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Inicio de la aplicación</AccordionTrigger>
                                <AccordionContent>
                                    <p>Descubre cómo preparar todo lo necesario e iniciar sesión en la plataforma.</p>
                                    <h4 className="font-semibold mt-2">Requisitos previos</h4>
                                    <ul className="list-disc pl-5">
                                        <li>Conexión a Internet estable.</li>
                                        <li>Navegador web actualizado (Chrome, Firefox, Edge).</li>
                                        <li>Cuenta de usuario activa.</li>
                                    </ul>
                                    <h4 className="font-semibold mt-2">Pasos iniciales</h4>
                                    <ol className="list-decimal pl-5">
                                        <li>Abre la URL de la aplicación en tu navegador.</li>
                                        <li>Selecciona "Registrarse" o "Iniciar sesión".</li>
                                        <li>Introduce tus datos y accede al sistema.</li>
                                    </ol>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Navegación y módulos</AccordionTrigger>
                                <AccordionContent>
                                    <p>Descripción de la barra de navegación y cómo acceder a cada sección principal.</p>
                                    <h4 className="font-semibold mt-2">Secciones disponibles</h4>
                                    <ul className="list-disc pl-5">
                                        <li><strong>Dashboard:</strong> Resumen de actividad y últimas publicaciones.</li>
                                        <li><strong>Perfil:</strong> Edita tu información, consulta juegos guardados y estadísticas.</li>
                                        <li><strong>Juegos:</strong> Explora el catálogo, ve detalles y guarda tus favoritos.</li>
                                        <li><strong>Mensajes:</strong> Chat en tiempo real con otros usuarios.</li>
                                        <li><strong>Noticias:</strong> Actualizaciones y novedades sobre videojuegos.</li>
                                        <li><strong>Configuración:</strong> Ajustes de cuenta y preferencias.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-7">
                                <AccordionTrigger>Agregar juegos al perfil</AccordionTrigger>
                                <AccordionContent>
                                    <p>Aprende a buscar y guardar nuevos títulos en tu biblioteca personal.</p>
                                    <ol className="list-decimal pl-5">
                                        <li>Ve al módulo <strong>Juegos</strong> en la navegación lateral.</li>
                                        <li>Utiliza la barra de búsqueda o explora el catálogo.</li>
                                        <li>En la tarjeta de cada juego, haz clic en <em>Guardar</em> o <em>Agregar</em>.</li>
                                        <li>El juego aparecerá inmediatamente en <strong>Mis Juegos</strong> de tu perfil.</li>
                                    </ol>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-8">
                                <AccordionTrigger>Cómo hacer una review de un juego</AccordionTrigger>
                                <AccordionContent>
                                    <p>Guía paso a paso para calificar y comentar un juego.</p>
                                    <ul className="list-disc pl-5">
                                        <li>Accede a la página de detalles del juego desde <strong>Juegos</strong> o tu perfil.</li>
                                        <li>Desplázate hasta la sección de <strong>Reviews</strong>.</li>
                                        <li>Si ya has jugado, verás la opción <em>Escribe tu review</em> (o <em>Editar tu review</em>).</li>
                                        <li>Selecciona la cantidad de estrellas que deseas otorgar.</li>
                                        <li>Escribe tu comentario en el campo proporcionado (opcional).</li>
                                        <li>Haz clic en <em>Publicar review</em> para compartir tu opinión con la comunidad.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Sección: Administración */}
                            <h3 className="mt-6 mb-2 text-lg font-semibold">Administración</h3>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Mantenimiento del sistema</AccordionTrigger>
                                <AccordionContent>
                                    <p>Buenas prácticas para mantener la plataforma estable y segura.</p>
                                    <ul className="list-disc pl-5">
                                        <li>Revisar logs periódicamente para identificar errores.</li>
                                        <li>Actualizar dependencias y parches de seguridad.</li>
                                        <li>Monitorizar rendimiento con herramientas externas.</li>
                                        <li>Gestionar usuarios inactivos o con comportamientos sospechosos.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger>Copias de seguridad</AccordionTrigger>
                                <AccordionContent>
                                    <p>Cómo exportar datos y archivos para proteger tu información.</p>
                                    <h4 className="font-semibold mt-2">Procedimiento recomendado</h4>
                                    <ol className="list-decimal pl-5">
                                        <li>Accede al panel de administración del servidor.</li>
                                        <li>Exporta la base de datos en formato SQL.</li>
                                        <li>Descarga el directorio <code>storage/app</code>.</li>
                                        <li>Almacena las copias en un soporte externo o en la nube.</li>
                                    </ol>
                                    <p className="mt-2">Frecuencia sugerida: semanal o antes de grandes actualizaciones.</p>
                                </AccordionContent>
                            </AccordionItem>

                            {/* Sección: Soporte y ayuda */}
                            <h3 className="mt-6 mb-2 text-lg font-semibold">Soporte y ayuda</h3>
                            <AccordionItem value="item-5">
                                <AccordionTrigger>Errores comunes y soluciones</AccordionTrigger>
                                <AccordionContent>
                                    <p>Listado de mensajes de error frecuentes y cómo resolverlos.</p>
                                    <ul className="list-disc pl-5">
                                        <li><strong>404 - No encontrado:</strong> Verifica la URL y rutas configuradas.</li>
                                        <li><strong>500 - Error interno:</strong> Consulta los logs del servidor.</li>
                                        <li><strong>Validación:</strong> Corrige los campos marcados en rojo.</li>
                                        <li><strong>Autenticación:</strong> Revisa tus credenciales o restablece la contraseña.</li>
                                        <li><strong>Conexión:</strong> Comprueba tu conexión a Internet.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-6">
                                <AccordionTrigger>Glosario de términos</AccordionTrigger>
                                <AccordionContent>
                                    <p>Definiciones clave para familiarizarte con la jerga de la plataforma.</p>
                                    <ul className="list-disc pl-5">
                                        <li><strong>Post:</strong> Publicación de un usuario en el feed.</li>
                                        <li><strong>Review:</strong> Reseña de un videojuego.</li>
                                        <li><strong>Feed:</strong> Flujo de contenido en el Dashboard.</li>
                                        <li><strong>Seguidor/Seguido:</strong> Conexiones entre usuarios.</li>
                                        <li><strong>Dashboard:</strong> Vista principal con resumen de actividades.</li>
                                        <li><strong>Notificaciones:</strong> Alertas sobre eventos recientes.</li>
                                        <li><strong>Backup:</strong> Copia de seguridad de datos.</li>
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