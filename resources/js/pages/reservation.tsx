import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface PageProps {
  fullyBookedDates: string[];
  [key: string]: unknown; // علشان يدعم أي بيانات إضافية
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Technical LAB Reservation',
        href: '/reservation',
    },
];

export default function Dashboard() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        notes: '',
        bookingTime: '',
    });

    const { fullyBookedDates = [] } = usePage<PageProps>().props;
    const disabledDates = fullyBookedDates.map((date) =>
        new Date(date).toDateString()
    );

    // Handle modal close with Escape key or click outside
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleClickOutside = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) handleClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;

        setIsSubmitting(true);
        try {
            await axios.post('/bookings', {
                date: selectedDate.toLocaleDateString('en-CA'),
                notes: formData.notes,
                booking_time: formData.bookingTime,
            });
            toast.success(`Booking confirmed for ${selectedDate.toDateString()}!`);
            setShowModal(false);
            router.reload({ only: ['fullyBookedDates'] });
        } catch (error: any) {
            const serverMessage = error.response?.data?.message;
            toast.error(serverMessage || 'Failed to submit booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <Toaster position="top-right" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                {/* Calendar Section */}
                <div>

                    <Calendar
                        onClickDay={handleDateClick}
                        tileDisabled={({ date }) =>
                            date < new Date() || disabledDates.includes(date.toDateString())
                        }
                        tileClassName={({ date }) =>
                            disabledDates.includes(date.toDateString()) ? 'text-red-500 font-bold' : undefined
                        }
                        className="react-calendar !w-full !border !border-gray-200 !rounded-lg !shadow-sm !bg-white !text-black"

                    />


                    {/* Booking Modal */}
                    <AnimatePresence>
                        {showModal && selectedDate && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={handleClickOutside}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                            >
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: 20, opacity: 0 }}
                                    className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white p-6 rounded-lg shadow-xl w-full max-w-md"
                                >
                                    <h2 className="text-lg font-bold mb-4">
                                        Booking on {selectedDate.toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                    </h2>
                                    <form onSubmit={handleSubmit} className="space-y-4">

                                        <input
                                            type="time"
                                            name="booking_time"
                                            required
                                            value={formData.bookingTime}
                                            onChange={(e) => setFormData({ ...formData, bookingTime: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-black dark:text-white rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                        <textarea
                                            placeholder="Additional Notes"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#2a2a2a] text-black dark:text-white rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            rows={3}
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        ></textarea>
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                type="button"
                                                onClick={handleClose}
                                                disabled={isSubmitting}
                                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors flex items-center justify-center min-w-24"
                                            >
                                                {isSubmitting ? (
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                ) : (
                                                    'Confirm'
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AppLayout>
    );
}
