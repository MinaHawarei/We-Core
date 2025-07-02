import AdminLayout from '@/layouts/admin-layout';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { type BreadcrumbItem } from '@/types';
import axios from 'axios';
import { Inertia } from '@inertiajs/inertia';
import { AnimatePresence, motion } from 'framer-motion';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users Management',
        href: '/admin/users',
    },
];

export default function UsersDashboard() {
    const { users } = usePage().props as unknown as { users: any[] };
    const [localUsers, setLocalUsers] = useState(users);   // 👈 نعمل نسخة محلية علشان نقدر نحذف منها

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    site: '',
    out_id: '',
    manager_id: '',
    role: '',
    is_active: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);


    const openEditModal = (user: any) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            department: user.department,
            site: user.site,
            out_id: user.out_id,
            manager_id: user.manager_id,
            role: user.role,
            is_active: user.is_active,
        });
        setShowEditModal(true);
    };
    const closeEditModal = () => {
        setShowEditModal(false);
        setEditingUser(null);
    };
    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        setIsSubmitting(true);

        try {
            await axios.put(`/admin/users/${editingUser.id}`, formData);

            // حدث البيانات المحلية
            setLocalUsers((prev) =>
            prev.map((user) =>
                user.id === editingUser.id ? { ...user, ...formData } : user
            )
            );

            toast.success('User updated successfully.');
            closeEditModal();
        } catch (error) {
            toast.error('Failed to update user.');
        } finally {
            setIsSubmitting(false);
        }
    };



    const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            const response = await axios.delete(`/admin/users/${id}`);

            // تحقق من حالة الرد
            if (response.status === 200 || response.status === 204) {
                setLocalUsers((prev) => prev.filter((user) => user.id !== id));
                toast.success('User deleted.');
            } else {
                toast.error('Unexpected response from server.');
            }
        } catch (error: any) {
            console.error('Delete error:', error.response || error.message || error);
            toast.error(error.response?.data?.message || 'Failed to delete user.');
        }
    };



  const toggleUserStatus = async (id: number, currentStatus: boolean) => {
    try {
        await axios.put(`/admin/users/${id}`, {
            is_active: !currentStatus,
        });

        setLocalUsers((prevUsers) =>
            prevUsers.map((user: any) =>
                user.id === id ? { ...user, is_active: !currentStatus } : user
            )
        );

        toast.success('User status updated.');
    } catch (error) {
        console.error(error);
        toast.error('Failed to update user status.');
    }
    };



    return (

        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Users Management" />
            <Toaster position="top-right" />
            <AnimatePresence>
                {showEditModal && (
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={closeEditModal}
                    >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="bg-white dark:bg-[#1a1a1a] text-black dark:text-white p-6 rounded-lg shadow-xl w-full max-w-md"
                        onClick={(e) => e.stopPropagation()} // لمنع إغلاق المودال عند الضغط داخل الصندوق
                    >
                        <h2 className="text-lg font-bold mb-4">Edit User</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                name="out_id"
                                required
                                value={formData.out_id}
                                onChange={(e) => setFormData({ ...formData, out_id: e.target.value })}
                                className="w-1/2 px-4 py-2 border rounded"
                                placeholder="out_id"
                            />
                            <input
                                type="text"
                                name="role"
                                required
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-1/2 px-4 py-2 border rounded"
                                placeholder="Role"
                            />
                        </div>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border rounded"
                            placeholder="Name"
                        />
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border rounded"
                            placeholder="Email"
                        />
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                name="department"
                                required
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-1/2 px-4 py-2 border rounded"
                                placeholder="department"
                            />
                            <input
                                type="text"
                                name="site"
                                required
                                value={formData.site}
                                onChange={(e) => setFormData({ ...formData, site: e.target.value })}
                                className="w-1/2 px-4 py-2 border rounded"
                                placeholder="site"
                            />
                        </div>


                        <input
                            type="text"
                            name="manager_id"
                            value={formData.manager_id}
                            onChange={(e) => setFormData({ ...formData, manager_id: e.target.value })}
                            className="w-full px-4 py-2 border rounded"
                            placeholder="manager_id"
                        />

                        <div className="flex justify-end space-x-2">
                            <button
                            type="button"
                            onClick={closeEditModal}
                            disabled={isSubmitting}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                            >
                            Cancel
                            </button>
                            <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                            {isSubmitting ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                        </form>
                    </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="p-4 space-y-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                    Users Dashboard
                </h1>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow overflow-x-auto">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                        User List
                    </h2>

                    <table className="min-w-full border text-sm text-gray-800 dark:text-gray-200">
                        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                            <tr>
                                <th className="p-2 border">ID</th>
                                <th className="p-2 border">Name</th>
                                <th className="p-2 border">Site</th>
                                <th className="p-2 border">Department</th>
                                <th className="p-2 border">Manager</th>
                                <th className="p-2 border">Role</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localUsers.map((user: any, index: number) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="p-2 border text-center">{user.out_id}</td>
                                    <td className="p-2 border text-center">{user.name}</td>
                                    <td className="p-2 border text-center">{user.site}</td>
                                    <td className="p-2 border text-center">{user.department}</td>
                                    <td className="p-2 border text-center">{user.manager ? user.manager.name : '-'}</td>
                                    <td className="p-2 border text-center">{user.role}</td>
                                    <td className="p-2 border text-center">
                                        <label className="inline-flex items-center cursor-pointer relative">
                                            <input
                                                type="checkbox"
                                                className="sr-only peer"
                                                checked={user.is_active}
                                                onChange={() => toggleUserStatus(user.id, user.is_active)}
                                            />
                                            <div className="w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
                                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 peer-checked:translate-x-full"></div>
                                        </label>
                                    </td>
                                    <td className="p-2 border text-center">
                                          <button
                                                className="text-blue-600 dark:text-blue-400 hover:underline text-xs p-2"
                                                onClick={() => openEditModal(user)}
                                            >
                                                Edit
                                            </button>
                                        <button
                                            className="text-red-600 dark:text-red-400 hover:underline text-xs p-2"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
