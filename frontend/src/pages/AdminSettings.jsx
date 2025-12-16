import { useState, useEffect } from 'react';
import api from '../api/axios';
import Spinner from '../components/Spinner';

const AdminSettings = () => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await api.get('/admin/settings');
                setSettings(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (idx, field, value) => {
        const newHours = [...settings.openingHours];
        newHours[idx][field] = value;
        setSettings({ ...settings, openingHours: newHours });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/admin/settings', settings);
            setMsg('Settings saved successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (error) {
            setMsg('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Business Settings</h2>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {msg && <div className="p-3 bg-green-100 text-green-800 rounded-lg">{msg}</div>}

            <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Opening Hours</h3>
                <div className="space-y-4">
                    {settings.openingHours.map((day, idx) => (
                        <div key={day._id || idx} className="flex items-center space-x-4">
                            <div className="w-24 font-medium text-gray-700 dark:text-gray-300">{day.day}</div>
                            <label className="flex items-center space-x-2">
                                <input 
                                    type="checkbox" 
                                    checked={day.isOpen} 
                                    onChange={(e) => handleChange(idx, 'isOpen', e.target.checked)}
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-500">Open</span>
                            </label>
                            {day.isOpen && (
                                <>
                                    <input 
                                        type="time" 
                                        value={day.start} 
                                        onChange={(e) => handleChange(idx, 'start', e.target.value)}
                                        className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                                    />
                                    <span className="text-gray-400">-</span>
                                    <input 
                                        type="time" 
                                        value={day.end} 
                                        onChange={(e) => handleChange(idx, 'end', e.target.value)}
                                        className="border rounded px-2 py-1 dark:bg-gray-700 dark:text-white"
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
