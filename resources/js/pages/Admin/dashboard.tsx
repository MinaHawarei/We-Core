import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { usePage } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Technical LAB Reservation',
        href: '/admin-reservation',
    },
];

export default function Dashboard() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        outId: '',
        notes: '',
    });

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
            await axios.post('/api/bookings', {
                date: selectedDate.toISOString(),
                // Add other form data here
            });
            toast.success(`Booking confirmed for ${selectedDate.toDateString()}!`);
            setShowModal(false);
        } catch (error) {
            toast.error('Failed to submit booking. Please try again.');
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
                    <h1> Weclome to Admin Dashbord</h1>
                </div>
            </div>
        </AppLayout>
    );
}
