import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import Footer from '@/components/Footer';


interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs, ...props }: AppLayoutProps) {
    useEffect(() => {
    }, []);

    return (

        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            <Footer />
        </AppLayoutTemplate>
    );
}
