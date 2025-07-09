import AdminLayout from '@/layouts/admin-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { Toaster, toast } from 'react-hot-toast';
import { type BreadcrumbItem } from '@/types';
import AdminSlotManagerGrid from '@/components/AdminSlotManagerGrid';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Reservation Schedule',
    href: '/admin/schedule',
  },
];

interface BlockedSlotModalData {
  id: number;
  date: string;
  from: string;
  to: string;
  reason: string;
}

export default function ScheduleReservations() {
  const { props } = usePage();
  const [editModalData, setEditModalData] = useState<BlockedSlotModalData | null>(null);
  const [createModalDate, setCreateModalDate] = useState<string | null>(null);
  const [createModalTime, setCreateModalTime] = useState<string | null>(null);
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newReason, setNewReason] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const blockedSlots = props.blockedSlots || {};
  const reservations = props.bookings || [];
  const loading = false;

  const handleSlotClick = (date: string, time: string, isBlocked: boolean) => {
    if (isBlocked) {
      const slot = (blockedSlots[date] || []).find(
        (s: any) => time >= s.from.slice(0, 5) && time < s.to.slice(0, 5)
      );
      if (slot) {
        setEditModalData({
          id: slot.id,
          date,
          from: slot.from,
          to: slot.to,
          reason: slot.reason,
        });
      }
    } else {
      setCreateModalDate(date);
      setCreateModalTime(time);
      setNewFrom(time);
      const [h, m] = time.split(":" ).map(Number);
      const to = new Date();
      to.setHours(h);
      to.setMinutes(m + 30);
      const toTime = to.toTimeString().slice(0, 5);
      setNewTo(toTime);
    }
  };

  const closeModals = () => {
    setEditModalData(null);
    setCreateModalDate(null);
    setCreateModalTime(null);
    setNewFrom('');
    setNewTo('');
    setNewReason('');
    setError('');
  };

  const handleSubmitBlock = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (createModalDate) {
      router.post('/admin/schedule/block', {
        date: createModalDate,
        from: newFrom,
        to: newTo,
        reason: newReason,
      }, {
        onSuccess: () => {
          toast.success('Block created successfully.');
          closeModals();
        },
        onFinish: () => setIsSubmitting(false),
        onError: (errors) => {
          toast.error(errors?.error || 'Failed to create block.');
          setIsSubmitting(false);
        },
      });
    } else if (editModalData) {
      router.post('/admin/schedule/block', {
        _method: 'PUT',
        id: editModalData.id,
        date: editModalData.date,
        from: editModalData.from,
        to: editModalData.to,
        reason: editModalData.reason,
      }, {
        onSuccess: () => {
          toast.success('Block updated successfully.');
          closeModals();
        },
        onFinish: () => setIsSubmitting(false),
        onError: (errors) => {
          toast.error(errors?.error || 'Failed to update block.');
          setIsSubmitting(false);
        },
      });
    }
  };

  const handleDeleteBlock = () => {
    if (!editModalData) return;
    setIsSubmitting(true);

    router.post('/admin/schedule/block', {
      _method: 'DELETE',
      id: editModalData.id,
      date: editModalData.date,
      from: editModalData.from,
      to: editModalData.to,
    }, {
      onSuccess: () => {
        toast.success('Block deleted successfully.');
        closeModals();
      },
      onFinish: () => setIsSubmitting(false),
      onError: () => {
        toast.error('Failed to delete block.');
      },
    });
  };

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title="Reservation Schedule" />
      <Toaster position="top-right" />

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Reservation Schedule</h1>
        <AdminSlotManagerGrid
          blockedSlots={blockedSlots}
          reservations={reservations}
          loading={loading}
          onSlotClick={handleSlotClick}
        />
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editModalData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModals}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white p-6 rounded-lg shadow-xl w-full max-w-lg"
            >
              <h2 className="text-lg font-bold mb-4">Edit Blocked Slot</h2>
              <form onSubmit={handleSubmitBlock} className="space-y-4">
                <input type="date" className="w-full px-3 py-2 border rounded" value={editModalData.date} onChange={(e) => setEditModalData(prev => prev && { ...prev, date: e.target.value })} />
                <input type="time" className="w-full px-3 py-2 border rounded" value={editModalData.from} onChange={(e) => setEditModalData(prev => prev && { ...prev, from: e.target.value })} />
                <input type="time" className="w-full px-3 py-2 border rounded" value={editModalData.to} onChange={(e) => setEditModalData(prev => prev && { ...prev, to: e.target.value })} />
                <input type="text" className="w-full px-3 py-2 border rounded" value={editModalData.reason} onChange={(e) => setEditModalData(prev => prev && { ...prev, reason: e.target.value })} />
                <div className="flex justify-end space-x-2">
                  <button type="button" className="px-4 py-2 border rounded text-gray-700" onClick={closeModals}>Cancel</button>
                  <button type="button" onClick={handleDeleteBlock} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {createModalDate && createModalTime && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModals}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white p-6 rounded-lg shadow-xl w-full max-w-lg"
            >
              <h2 className="text-lg font-bold mb-4">Add New Block</h2>
              <form onSubmit={handleSubmitBlock} className="space-y-4">
                <input type="date" className="w-full px-3 py-2 border rounded" value={createModalDate} onChange={(e) => setCreateModalDate(e.target.value)} />
                <input type="time" className="w-full px-3 py-2 border rounded" value={newFrom} onChange={(e) => setNewFrom(e.target.value)} />
                <input type="time" className="w-full px-3 py-2 border rounded" value={newTo} onChange={(e) => setNewTo(e.target.value)} />
                <input type="text" className="w-full px-3 py-2 border rounded" value={newReason} onChange={(e) => setNewReason(e.target.value)} placeholder="Reason" />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={closeModals} className="px-4 py-2 border rounded text-gray-700">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-green-600 text-white rounded">
                    {isSubmitting ? 'Submitting...' : 'Add Block'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
