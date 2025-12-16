import { useEffect, useState } from 'react';
import api from '../api/axios';
import Card from './Card';
import Spinner from './Spinner';

const AdminStats = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <Spinner />;

    return (
        <div className="space-y-6">
            {/* Top Row: Basic Counts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalAppointments}</p>
                </Card>
                <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-100 dark:border-yellow-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Waitlist (Pending)</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingAppointments}</p>
                </Card>
                <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Revenue (Est.)</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white text-green-600">${stats.revenue}</p>
                </Card>
                 <Card className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cancellation Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white text-red-600">{stats.cancellationRate}%</p>
                </Card>
            </div>

            {/* Second Row: Advanced Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Peak Booking Hours</h3>
                    {stats.peakHours?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.peakHours.map(hour => (
                                <div key={hour._id} className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-300 font-medium">{hour._id}:00</span>
                                    <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500" 
                                            style={{ width: `${(hour.count / stats.totalAppointments) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-500">{hour.count} bookings</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">Not enough data</p>
                    )}
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Staff</h3>
                    {stats.staffStats?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.staffStats.map((staff, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <span className="font-medium text-gray-900 dark:text-white">{staff.name}</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">{staff.count} Served</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No staff performance data yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminStats;
