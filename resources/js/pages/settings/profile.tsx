import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Your profile details" />

                    <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                        {/* سطر 1: الاسم والايميل */}
                        <div className="flex gap-6">
                            <div className="flex-1 grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <p
                                id="name"
                                className="mt-1 block w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                                {user.name}
                            </p>
                            </div>

                            <div className="flex-1 grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <p
                                id="email"
                                className="mt-1 block w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                                {user.email}
                            </p>
                            </div>
                        </div>

                        {/* سطر 2: OUT ID و Department */}
                        <div className="flex gap-6">
                            <div className="flex-1 grid gap-2">
                            <Label htmlFor="site">Site</Label>
                            <p
                                id="site"
                                className="mt-1 block w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                                {user.site}
                            </p>
                            </div>

                            <div className="flex-1 grid gap-2">
                            <Label htmlFor="department">Department</Label>
                            <p
                                id="department"
                                className="mt-1 block w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                                {user.department}
                            </p>
                            </div>
                        </div>

                        {/* سطر 3: Site و Manager */}
                        <div className="flex gap-6">

                             <div className="flex-1 grid gap-2">
                            <Label htmlFor="out_id">OUT ID</Label>
                            <p
                                id="out_id"
                                className="mt-1 block w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                                {user.out_id}
                            </p>
                            </div>

                            <div className="flex-1 grid gap-2">
                            <Label htmlFor="manager">Manager</Label>
                            <p
                                id="manager"
                                className="mt-1 block w-full px-3 py-2 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                                {user.manager ? user.manager.name : '-'}
                            </p>
                            </div>
                        </div>
                        </form>

                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
