import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';


type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    department: string;
    site: string;
    manager_id: number | null;
    out_id: string;

};
type RegisterProps = {
    admins: { id: number; name: string }[];
};

export default function Register({ admins }: RegisterProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        department: '',
        site: '',
        manager_id: null,
        out_id: '',
    });
    const departments = ['TECH', 'FTTH', 'Non Tech', 'TechLead'];
    const sites = ['Alex', 'NCX', 'NC1', 'NC2', 'NC3', 'NC4', 'Qena'];

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!data.email.endsWith('@xceedcc.com') && !data.email.endsWith('@te.eg')) {
            alert('Email must be a valid company address ending with @xceedcc.com or @te.eg.');
            return;
        }
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="w-full max-w-5xl rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2 col-span-full">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-black dark:text-white rounded"

                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="out_id">OUT ID</Label>
                        <Input
                            id="out_id"
                            type="text"
                            required
                            maxLength={10}
                            tabIndex={2}
                            value={data.out_id}
                            onChange={(e) => setData('out_id', e.target.value.toUpperCase())}
                            disabled={processing}
                            placeholder="for example : OUT281148"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-black dark:text-white rounded"
                        />
                        <InputError message={errors.out_id} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={3}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@xceedcc.com"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-black dark:text-white rounded"

                        />
                        <InputError message={errors.email} />
                    </div>



                    <div className="grid gap-2">
                        <Label htmlFor="department">Department</Label>
                        <select
                            id="department"
                            required
                            tabIndex={4}
                            value={data.department}
                            onChange={(e) => setData('department', e.target.value)}
                            disabled={processing}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-black dark:text-white rounded"
                        >
                            <option value="">-- Select Department --</option>
                            {departments.map((dep) => (
                                <option key={dep} value={dep}>{dep}</option>
                            ))}
                        </select>
                        <InputError message={errors.department} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="site">Site</Label>
                        <select
                            id="site"
                            required
                            tabIndex={5}
                            value={data.site}
                            onChange={(e) => setData('site', e.target.value)}
                            disabled={processing}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-black dark:text-white rounded"
                        >
                            <option value="">-- Select Site --</option>
                            {sites.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <InputError message={errors.site} />
                    </div>
                    <div className="grid gap-2 col-span-full">
                        <Label htmlFor="manager_id">Manager</Label>
                        <select
                            id="manager_id"
                            value={data.manager_id ?? ''}
                            tabIndex={6}
                            onChange={(e) => setData('manager_id', e.target.value === '' ? null : Number(e.target.value))}
                            disabled={processing}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-black dark:text-white rounded"
                        >
                            <option value="">-- Select Manager --</option>
                            {admins.map((admin) => (
                                <option key={admin.id} value={admin.id}>{admin.name}</option>
                            ))}
                        </select>
                        <InputError message={errors.manager_id} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={7}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-black dark:text-white rounded"

                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={8}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-black dark:text-white rounded"

                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="grid gap-2 col-span-full" tabIndex={9} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={10}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
