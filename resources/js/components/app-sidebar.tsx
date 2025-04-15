import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Gamepad2, Home, LogOut, MessageSquare, Newspaper, UserCircle } from 'lucide-react';
import AppLogo from './app-logo';

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
];

export function AppSidebar() {
    const cleanup = useMobileNavigation();

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
                            <UserCircle className="mr-2" />
                            Perfil
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
