import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link , usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid , CalendarDays , Bell } from 'lucide-react';
import AppLogo from './app-logo';





export function AppSidebar() {
    const mainNavItems: NavItem[] = [
        {
            title: 'TechLAB Reservation',
            href: '/reservation',
            icon: CalendarDays,
        },
        {
            title: 'News Feed',
            href: '/posts',
            icon: Bell,
        },


    ];
    const { props } = usePage();
    const user = props.auth?.user;

    const footerNavItems: NavItem[] = [];
    if (user?.role === 'admin') {
        mainNavItems.push({
        title: 'VOC',
        href: '/voc-logs',
        icon: LayoutGrid,
        });
    }
    if (user?.role === 'admin') {
        footerNavItems.push({
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
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
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
