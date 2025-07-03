import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { type BreadcrumbItem } from '@/types';
import { format, parseISO } from 'date-fns';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Technical Lab Dashboard',
    href: '/admin/dashboard',
  },
];

export default function ReservationDashboard() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    reason: '',
    attendance: '',
    out_id: '',
    role: '',
    sort: '',
    direction: 'asc',
  });

  const fetchReservations = async () => {
        try {
            // Format dates before sending
            const formattedFilters = {
            ...filters,
            from: filters.from ? format(new Date(filters.from), 'yyyy-MM-dd') : '',
            to: filters.to ? format(new Date(filters.to), 'yyyy-MM-dd') : '',
            };

            const response = await axios.get('/admin/reservation', {
            params: formattedFilters,
            });

            setReservations(response.data);
        } catch {
            toast.error('Failed to fetch reservations.');
        } finally {
            setLoading(false);
        }
    };


  const handleAttendanceToggle = async (id: number, current: number, date: string) => {
    const today = new Date().toISOString().slice(0, 10);
    if (date > today) {
      toast.error('Cannot update future dates.');
      return;
    }
    try {
      await axios.put(`/admin/reservation/${id}/attendance`, {
        attendance: current === 1 ? 0 : 1,
      });
      fetchReservations();
      toast.success('Attendance updated');
    } catch {
      toast.error('Failed to update attendance.');
    }
  };

  const handleSort = (column: string) => {
    const isAsc = filters.sort === column && filters.direction === 'asc';
    setFilters({
      ...filters,
      sort: column,
      direction: isAsc ? 'desc' : 'asc',
    });
  };

  useEffect(() => {
    fetchReservations();
  }, [filters]);

  return (
    <AdminLayout breadcrumbs={breadcrumbs}>
      <Head title="Reservation Dashboard" />
      <Toaster position="top-right" />
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Reservation Management
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
          <input
            type="date"
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
            value={filters.from ? format(parseISO(filters.from), 'yyyy-MM-dd') : ''}
            onChange={(e) => {
                const val = e.target.value;
                setFilters({ ...filters, from: val });
            }}
            placeholder="From"
            />

            <input
            type="date"
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
            value={filters.to ? format(parseISO(filters.to), 'yyyy-MM-dd') : ''}
            onChange={(e) => {
                const val = e.target.value;
                setFilters({ ...filters, to: val });
            }}
            placeholder="To"
            />

          <select
            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm rounded px-2 py-1"
            value={filters.attendance}
            onChange={(e) => setFilters({ ...filters, attendance: e.target.value })}
          >
            <option value="">All</option>
            <option value="1">Attend</option>
            <option value="0">Absent</option>
          </select>
          <input
            type="text"
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
            placeholder="Reason"
            value={filters.reason}
            onChange={(e) => setFilters({ ...filters, reason: e.target.value })}
          />
          <input
            type="text"
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
            placeholder="Out ID"
            value={filters.out_id}
            onChange={(e) => setFilters({ ...filters, out_id: e.target.value })}
          />
          <input
            type="text"
            className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded px-2 py-1"
            placeholder="Role"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          />
        </div>

        {/* Table */}
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
                  {[
                    { key: 'id', label: '#' },
                    { key: 'date', label: 'Date' },
                    { key: 'time', label: 'Time' },
                    { key: 'out_id', label: 'ID' },
                    { key: 'name', label: 'User' },
                    { key: 'role', label: 'Role' },
                    { key: 'reason', label: 'Reason' },
                    { key: 'number_of_visitors', label: 'Visitors' },
                    { key: 'attendance', label: 'Attendance' },
                    { key: 'notes', label: 'Notes' },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="p-2 border cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      {filters.sort === col.key && (filters.direction === 'asc' ? ' ↑' : ' ↓')}
                    </th>
                  ))}
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((res: any, index: number) => (
                  <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-2 border text-center">{index + 1}</td>
                    <td className="p-2 border text-center">{res.date}</td>
                    <td className="p-2 border text-center">{res.time}</td>
                    <td className="p-2 border text-center">{res.user?.out_id || 'N/A'}</td>
                    <td className="p-2 border text-center">{res.user?.name || 'N/A'}</td>
                    <td className="p-2 border text-center">{res.user?.role || 'N/A'}</td>
                    <td className="p-2 border text-center">{res.reason || '-'}</td>
                    <td className="p-2 border text-center">{res.number_of_visitors || 1}</td>
                    <td className="p-2 border text-center">
  {new Date(res.date) <= new Date() ? (
    <label className="inline-flex items-center cursor-pointer relative">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={res.attendance === 1}
        onChange={() => handleAttendanceToggle(res.id, res.attendance, res.date)}
      />
      <div className="w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-full"></div>
    </label>
  ) : (
    <span className="text-xs text-gray-400">Not available</span>
  )}
</td>

                    <td className="p-2 border text-center">{res.notes || '-'}</td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to cancel this reservation?')) {
                            axios
                              .delete(`/admin/reservation/${res.id}`)
                              .then(() => {
                                toast.success('Reservation cancelled');
                                fetchReservations();
                              })
                              .catch(() => toast.error('Failed to cancel'));
                          }
                        }}
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
