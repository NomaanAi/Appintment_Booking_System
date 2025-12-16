import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Spinner from '../components/Spinner';

const Profile = () => {
    const { user, loading: authLoading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [msg, setMsg] = useState({ type: '', content: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({});
        try {
            await api.put('/auth/me', { name, email });
            setMsg({ type: 'success', content: 'Profile updated successfully!' });
        } catch (error) {
            setMsg({ type: 'error', content: error.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({});
        try {
            await api.put('/auth/change-password', { oldPassword, newPassword });
            setMsg({ type: 'success', content: 'Password changed successfully!' });
            setOldPassword('');
            setNewPassword('');
        } catch (error) {
            setMsg({ type: 'error', content: error.response?.data?.message || 'Password change failed' });
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) return <div className="flex justify-center py-10"><Spinner /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>

            {msg.content && (
                <div className={`p-4 rounded-lg border ${msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300' : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300'}`}>
                    {msg.content}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Details */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Personal Info</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {loading ? <Spinner /> : 'Update Info'}
                        </button>
                    </form>
                </div>

                {/* Change Password */}
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Security</h2>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Current Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                minLength="6"
                                required
                            />
                        </div>
                         <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            {loading ? <Spinner /> : 'Update Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
