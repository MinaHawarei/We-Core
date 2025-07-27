import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button } from '@/components/ui/button';
import { Head, usePage } from '@inertiajs/react';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'VOC',
        href: '/voc-logs',
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


    const { props } = usePage() as any;
    const vocs = props.vocs?.data || []

    const [autoSave, setAutoSave] = useState(true); // Toggle for auto-save
    const [isClearing, setIsClearing] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleToggleAutoSave = async () => {
        try {
            const response = await axios.post('/voc-toggle');
            const { autoSaveEnabled } = response.data;
            setAutoSave(autoSaveEnabled);
            toast.success(`Auto-save is now ${autoSaveEnabled ? 'enabled' : 'disabled'}`);
        } catch (error) {
            toast.error('Failed to toggle auto-save.');
        }
    };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete all VOC records?')) return;
    setIsClearing(true);
    try {
      await axios.post('/voc-clear-all');
      toast.success('All VOC logs deleted successfully.');
    } catch (err) {
      toast.error('Failed to delete records.');
    } finally {
      setIsClearing(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await axios.get('/voc-export', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'voc_logs.xlsx');
      document.body.appendChild(link);
      link.click();
      toast.success('Exported successfully.');
    } catch (error) {
      toast.error('Export failed.');
    } finally {
      setIsExporting(false);
    }
  };


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="VOC Dashboard" />
            <Toaster position="top-right" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1 className="text-2xl font-bold mb-4">VOC Dashboard</h1>
                {/* Action Buttons */}
                <div className="flex gap-4 flex-wrap">
<div className="flex items-center gap-2">
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={autoSave}
      onChange={handleToggleAutoSave}
    />
    <div className="
      w-11 h-6
      rounded-full
      transition-colors
      duration-300
      bg-gray-300
      peer-checked:bg-green-500
      relative
      after:content-['']
      after:absolute
      after:top-[2px]
      after:left-[2px]
      after:bg-white
      after:border
      after:border-gray-300
      after:rounded-full
      after:h-5
      after:w-5
      after:transition-all
      peer-checked:after:translate-x-full
      peer-checked:after:border-white
    "></div>
  </label>
  <span className="text-sm text-gray-700 dark:text-gray-200">
    {autoSave ? 'Tracker Enabled' : 'Tracker Disabled'}
  </span>
</div>

                <Button onClick={handleClearAll} disabled={isClearing} variant="destructive">
                    {isClearing ? 'Clearing...' : 'Clear All Records'}
                </Button>
                <Button onClick={handleExport} disabled={isExporting}>
                    {isExporting ? 'Exporting...' : 'Export to Excel'}
                </Button>
                </div>
                <div className="overflow-x-auto rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold">CST Number</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">SR Name</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">SR ID</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">BRAS</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Area</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            {vocs.map((voc: any) => (
                                <tr key={voc.id}>
                                    <td className="px-4 py-2">{voc.cst_number}</td>
                                    <td className="px-4 py-2">{voc.sr_name}</td>
                                    <td className="px-4 py-2">{voc.sr_id}</td>
                                    <td className="px-4 py-2">{voc.type || '-'}</td>
                                    <td className="px-4 py-2">{voc.bras || '-'}</td>
                                    <td className="px-4 py-2">{voc.area || '-'}</td>
                                    <td className="px-4 py-2">{new Date(voc.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                            {vocs.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                                        No VOC logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

