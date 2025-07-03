import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { type BreadcrumbItem } from '@/types';
import { format } from 'date-fns';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Technical Lab Dashboard',
        href: '/admin/dashboard',
    },
];

export default function ReservationDashboard() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

    const fetchReservations = async () => {
        try {
            const response = await axios.get('/admin/reservation');
            setReservations(response.data);
        } catch (error) {
            toast.error('Failed to fetch reservations.');
        } finally {
            setLoading(false);
        }
    };
    const fetchReservationsForDate = async (date: Date) => {
        setLoading(true);
        try {
            const response = await axios.get('/admin/reservation', {
                params: {
                    date: format(date, 'yyyy-MM-dd'), // 👈 إرسال التاريخ كـ باراميتر
                },
            });
            setReservations(response.data);
        } catch (error) {
            toast.error('Failed to fetch reservations for selected date.');
        } finally {
            setLoading(false);
        }
    };
    const handleCancel = async (id: number) => {
        if (!confirm('Are you sure you want to cancel this reservation?')) return;

        try {
            await axios.delete(`/admin/reservation/${id}`);
            toast.success('Reservation cancelled successfully');
            fetchReservationsForDate(selectedDate || new Date()); // إعادة تحميل القائمة
        } catch (error) {
            toast.error('Failed to cancel reservation.');
        }
    };



    useEffect(() => {
        fetchReservations();
    }, []);

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Reservation Dashboard" />
            <Toaster position="top-right" />
            <div className="p-4 space-y-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Reservation Management
                </h1>

                {/* إحصائيات */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                        <h2 className="text-sm text-gray-500 dark:text-gray-300">
                            Today’s Bookings
                        </h2>
                        <p className="text-2xl font-semibold text-gray-800 dark:text-white">
                            {
                                reservations.filter(
                                    (r: any) => r.date === new Date().toISOString().slice(0, 10)
                                ).length
                            }
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                        <h2 className="text-sm text-gray-500 dark:text-gray-300 mb-2">
                            Select a date to view reservations
                        </h2>

                        <input
                            type="date"
                            className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
                            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                            onChange={(e) => {
                                const newDate = new Date(e.target.value);
                                setSelectedDate(newDate);
                                fetchReservationsForDate(newDate); // 👈 بنادي الفنكشن هنا
                            }}
                        />
                    </div>
                </div>

                {/* جدول الحجوزات */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow overflow-x-auto">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                        Reservations List
                    </h2>
                    {loading ? (
                        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
                    ) : (
                        <table className="min-w-full border text-sm text-gray-800 dark:text-gray-200">
                            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                                <tr>
                                    <th className="p-2 border">#</th>
                                    <th className="p-2 border">Time</th>
                                    <th className="p-2 border">ID</th>
                                    <th className="p-2 border">User</th>
                                    <th className="p-2 border">Notes</th>
                                    <th className="p-2 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservations.map((res: any, index: number) => (
                                    <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="p-2 border text-center">{index + 1}</td>
                                        <td className="p-2 border text-center">{res.time}</td>
                                        <td className="p-2 border text-center">{res.user?.out_id || 'N/A'}</td>
                                        <td className="p-2 border text-center">{res.user?.name || 'N/A'}</td>
                                        <td className="p-2 border text-center">{res.notes || '-'}</td>
                                        <td className="p-2 border text-center">
                                            <button
                                                onClick={() => handleCancel(res.id)}
                                                className="text-red-600 dark:text-red-400 hover:underline text-xs"
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
