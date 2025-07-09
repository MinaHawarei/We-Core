import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Activity Logs',
        href: '/admin/activity-logs',
    },
];

export default function Dashboard() {
    const { props } = usePage();
    const [logs, setLogs] = useState(props.logs || []);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: '',
        userId: '',
        action: '',
    });

    const fetchLogs = async () => {
        try {
            const formattedFilters = {
                ...filters,
                fromDate: filters.fromDate ? format(new Date(filters.fromDate), 'yyyy-MM-dd') : '',
                toDate: filters.toDate ? format(new Date(filters.toDate), 'yyyy-MM-dd') : '',
            };

            const { data } = await axios.get('/admin/activity-logs', {
                params: formattedFilters,
            });
            setLogs(data.logs);
        } catch (error) {
            toast.error('Failed to fetch logs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [filters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Activity Logs" />
            <Toaster position="top-right" />

            <div className="p-4 space-y-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Activity Log Management
                </h1>

                {/* Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <input
                        type="date"
                        name="fromDate"
                        value={filters.fromDate ? format(parseISO(filters.fromDate), 'yyyy-MM-dd') : ''}
                        onChange={handleChange}
                        className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                        placeholder="From Date"
                    />
                    <input
                        type="date"
                        name="toDate"
                        value={filters.toDate ? format(parseISO(filters.toDate), 'yyyy-MM-dd') : ''}
                        onChange={handleChange}
                        className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                        placeholder="To Date"
                    />
                    <input
                        type="text"
                        name="userId"
                        value={filters.userId}
                        onChange={handleChange}
                        className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                        placeholder="User ID"
                    />
                    <select
                        name="action"
                        value={filters.action}
                        onChange={handleChange}
                        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm rounded px-2 py-1"
                    >
                        <option value="">All Actions</option>
                        <option value="created">Created</option>
                        <option value="updated">Updated</option>
                        <option value="deleted">Deleted</option>
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow overflow-x-auto">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                        Logs List
                    </h2>
                    {loading ? (
                        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
                    ) : (
                        <table className="min-w-full border text-sm text-gray-800 dark:text-gray-200">
                            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                                <tr>
                                    <th className="p-2 border">User ID</th>
                                    <th className="p-2 border">Model</th>
                                    <th className="p-2 border">Model ID</th>
                                    <th className="p-2 border">Action</th>
                                    <th className="p-2 border">Description</th>
                                    <th className="p-2 border">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="p-2 border text-center">{log.user?.out_id ?? '—'}</td>
                                        <td className="p-2 border text-center">{log.model_type}</td>
                                        <td className="p-2 border text-center">{log.model_id}</td>
                                        <td className="p-2 border text-center">{log.action}</td>
                                        <td className="p-2 border text-center">{log.description}</td>
                                        <td className="p-2 border text-center">{new Date(log.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
