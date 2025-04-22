import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Gamepad2, Home, LogOut, MessageSquare, Newspaper, BookOpen } from 'lucide-react';
import AppLogo from './app-logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePage } from '@inertiajs/react';

const mainNavItems: NavItem[] = [
     {
          title: 'Inicio',
          url: '/dashboard',
          icon: Home,
     },
     {
          title: 'Videojuegos',
          url: '/games',
          icon: Gamepad2,
     },
     {
          title: 'Mensajes',
          url: '/messages',
          icon: MessageSquare,
     },
     {
          title: 'Noticias',
          url: '/news',
          icon: Newspaper,
     },
     {
          title: 'Manual',
          url: '/manual',
          icon: BookOpen,  
     },
];

export function AppSidebar() {
    const cleanup = useMobileNavigation();
    const { auth } = usePage().props as any;
    const user = auth?.user;

    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>                  
                    <SidebarMenuButton size="lg" asChild>
                        <Link method="get" href={route('profile')} as="button" onClick={cleanup}>
                            <div className="flex items-center">
                                <Avatar className="h-6 w-6 mr-2">
                                    {user?.image ? (
                                        <AvatarImage src={`/storage/${user.image}`} alt={`${user.name} avatar`} />
                                    ) : (
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <span>Perfil</span>
                            </div>
                        </Link>
                    </SidebarMenuButton>

                    <SidebarMenuButton size="lg" asChild>
                        <Link method="post" href={route('logout')} as="button" onClick={cleanup}>
                            <LogOut className="mr-2" />
                            Cerrar sesión
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
