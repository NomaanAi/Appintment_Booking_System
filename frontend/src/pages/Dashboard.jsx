import { useAuth } from '../context/AuthContext';
import AdminStats from '../components/AdminStats';
import { useState, useEffect } from 'react';
import api from '../api/axios';
import StatusBadge from '../components/StatusBadge';
import Spinner from '../components/Spinner';

import UserDashboard from '../components/UserDashboard';
import StaffDashboard from './StaffDashboard';

const Dashboard = () => {
    const { user, loading: authLoading } = useAuth(); // Assuming AuthContext provides loading state
    const [loading, setLoading] = useState(true);
    const [allAppointments, setAllAppointments] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        date: ''
    });

    // Helper to build query string
    const buildQuery = () => {
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', 10);
        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.date) params.append('date', filters.date);
        return params.toString();
    };

    const fetchAdminData = async () => {
        setLoading(true);
         try {
            const query = buildQuery();
            const { data } = await api.get(`/appointments?${query}`);
            setAllAppointments(data.data);
            setTotalPages(data.meta.pages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAdminData();
        }
    }, [user, page, filters]); 

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setPage(1); 
    };

    const handleExport = async () => {
        try {
            const response = await api.get(`/appointments/export?${buildQuery()}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'appointments.csv');
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            console.error("Export failed", err);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/appointments/${id}/status`, { status });
            fetchAdminData();
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    // 1. Wait for Auth
    if (authLoading) return <div className="p-8 flex justify-center"><Spinner /></div>;

    // 2. Redirect/Render based on Role
    if (!user) return <div>Please log in.</div>; // Should be handled by PrivateRoute but safe guard

    if (user.role === 'staff') return <StaffDashboard />;
    if (user.role !== 'admin') return <UserDashboard />;

    // 3. Render Admin Dashboard
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold dark:text-white">Admin Dashboard</h2>
                <div className="flex gap-2">
                    <button onClick={handleExport} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center">
                        Download CSV
                    </button>
                    <button onClick={() => window.location.href='/admin/settings'} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
                        Settings
                    </button>
                </div>
            </div>
            
            <AdminStats />

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
                {/* Filters */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                    <input 
                        type="text" 
                        name="search"
                        placeholder="Search user name..." 
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <select 
                        name="status" 
                        value={filters.status} 
                        onChange={handleFilterChange}
                        className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <input 
                        type="date" 
                        name="date"
                        value={filters.date}
                        onChange={handleFilterChange}
                        className="px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {loading ? (
                         <div className="p-8 flex justify-center"><Spinner /></div>
                    ) : (
                        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-medium">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Time</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {allAppointments.map((appt) => (
                                    <tr key={appt._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{appt.user?.name || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{appt.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">{appt.date}</td>
                                        <td className="px-6 py-4">{appt.timeSlot}</td>
                                        <td className="px-6 py-4"><StatusBadge status={appt.status} /></td>
                                        <td className="px-6 py-4">
                                            {appt.status === 'Pending' && (
                                                <div className="flex space-x-2">
                                                    <button onClick={() => handleStatusUpdate(appt._id, 'Confirmed')} className="text-green-600 hover:text-green-800 font-medium">Approve</button>
                                                    <button onClick={() => handleStatusUpdate(appt._id, 'Rejected')} className="text-red-600 hover:text-red-800 font-medium">Reject</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {allAppointments.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No appointments found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p - 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                    <button 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => p + 1)}
                        className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-gray-300"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
