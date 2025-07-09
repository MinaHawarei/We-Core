import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link , usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid , CalendarDays , Bell } from 'lucide-react';
import AppLogo from './app-logo';

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



export function AppSidebar() {
    const { props } = usePage();
    const user = props.auth?.user;

    // ✅ Footer items (conditionally includes dashboard for admin)
    const footerNavItems: NavItem[] = [];

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
