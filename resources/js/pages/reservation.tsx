interface PageProps {
  fullyBookedDates: string[];
  blockedSlots: Record<string, string[]>;
  disabledDates: string[];
  auth: { user: { role: string } };
  [key: string]: unknown;
}
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import WeeklyBookingGrid from '@/components/WeeklyBookingGrid';

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
  const [visitorIds, setVisitorIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    notes: '',
    bookingTime: '',
    bookingTimeTo: '',
    visit_reason: '',
    agreeToPolicy: false,
    number_of_visitors: 1,
  });

  const {
    fullyBookedDates = [],
    blockedSlots = {},
    disabledDates = [],
    auth,
  } = usePage<PageProps>().props;

  const userRole = auth?.user?.role;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        booking_time_to: formData.bookingTimeTo,
        number_of_visitors: formData.number_of_visitors,
        visit_reason: formData.visit_reason,
        visitor_ids: visitorIds,
        agreeToPolicy: formData.agreeToPolicy,
      });
      toast.success(`Booking request submitted for ${selectedDate.toDateString()} , pending approval.`);
      setShowModal(false);
      router.reload({ only: ['fullyBookedDates'] });
    } catch (error: any) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (userRole != 'agent') {
      const count = formData.number_of_visitors || 0;
      setVisitorIds((prev) => {
        const updated = [...prev];
        updated.length = count;
        return updated.map((v, i) => v || '');
      });
    }
  }, [formData.number_of_visitors]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <Toaster position="top-right" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
        <WeeklyBookingGrid
          fullyBookedDates={fullyBookedDates}
          disabledDates={disabledDates}
          blockedSlots={blockedSlots}
          onSelectSlot={(date, fromTime) => {
            setSelectedDate(date);
            setFormData((prev) => ({ ...prev, bookingTime: fromTime }));
            const [h, m] = fromTime.split(':').map(Number);
            const to = new Date(date);
            to.setHours(h);
            to.setMinutes(m + 30);
            const toTime = to.toTimeString().slice(0, 5);
            setFormData((prev) => ({ ...prev, bookingTimeTo: toTime }));
            setShowModal(true);
          }}
        />

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
                className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <h2 className="text-lg font-bold mb-4">
                  Booking on {selectedDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="w-[48%]">
                      <label className="block text-sm font-medium">From</label>
                      <input type="time" step="900" required value={formData.bookingTime} onChange={(e) => {
                        const from = e.target.value;
                        const [h, m] = from.split(":").map(Number);
                        const to = new Date();
                        to.setHours(h);
                        to.setMinutes(m + 30);
                        const toTime = to.toTimeString().slice(0, 5);
                        setFormData({ ...formData, bookingTime: from, bookingTimeTo: toTime });
                      }} className="w-full px-4 py-2 border rounded" />
                    </div>
                    <div className="w-[48%]">
                      <label className="block text-sm font-medium">To</label>
                      <input type="time" step="900" value={formData.bookingTimeTo} readOnly={userRole === 'agent'} disabled={userRole === 'agent'} onChange={(e) => setFormData({ ...formData, bookingTimeTo: e.target.value })} className="w-full px-4 py-2 border rounded disabled:opacity-60" />
                    </div>
                    <div className="w-[48%]">
                      <label className="block text-sm font-medium">Reason</label>
                      <select required value={formData.visit_reason} onChange={(e) => setFormData({ ...formData, visit_reason: e.target.value })} className="w-full px-4 py-2 border rounded">
                        <option className="dark:text-black" value="">Select a reason</option>
                        <option className="dark:text-black" value="System">System</option>
                        <option className="dark:text-black" value="Device">Device</option>
                        <option className="dark:text-black" value="CPE">CPE</option>
                        <option className="dark:text-black" value="training">Training</option>
                        <option className="dark:text-black" value="other">Other</option>
                      </select>
                    </div>
                    <div className="w-[48%]">
                      <label className="block text-sm font-medium">Number of Visitors</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        required
                        disabled={userRole === 'agent'}
                        value={formData.number_of_visitors}
                        className="w-full px-4 py-2 border rounded"
                        onChange={(e) => {
                          const count = parseInt(e.target.value) || 1;
                          setFormData((prev) => ({ ...prev, number_of_visitors: count }));
                          setVisitorIds((prev) => {
                            const updated = [...prev];
                            updated.length = count;
                            return updated.map((val, i) => val || '');
                          });
                        }}
                      />
                    </div>
                  </div>

                  {(userRole != 'agent') && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {visitorIds.map((id, index) => (
                        <input
                          key={index}
                          type="text"
                          placeholder={`Visitor ${index + 1} Out ID`}
                          className="px-3 py-2 border rounded"
                          value={visitorIds[index]}
                          onChange={(e) => {
                            const updated = [...visitorIds];
                            updated[index] = e.target.value;
                            setVisitorIds(updated);
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <textarea placeholder="Additional Notes" className="w-full px-4 py-2 border rounded" rows={3} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}></textarea>
                  <div className="flex items-start space-x-2">
                    <input
                        type="checkbox"
                        id="policy"
                        checked={formData.agreeToPolicy || false}
                        onChange={(e) => setFormData({ ...formData, agreeToPolicy: e.target.checked })}
                        className="mt-1"
                        required
                    />
                    <label htmlFor="policy" className="text-sm">
                        Confirm that you are responsible To Update mention Schedule time on your Teleopti - IF Needed
                    </label>
                    </div>
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={handleClose} disabled={isSubmitting} className="px-4 py-2 border rounded text-gray-700">Cancel</button>
                    <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-purple-600 text-white rounded min-w-24">
                      {isSubmitting ? 'Submitting...' : 'Confirm'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </AppLayout>

  );
}
