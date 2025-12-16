import { useState, useEffect } from 'react';
import api from '../api/axios';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import Modal from '../components/Modal';

const StaffDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAvailability, setShowAvailability] = useState(false);
    const [availability, setAvailability] = useState([]);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scheduleRes, staffRes] = await Promise.all([
                    api.get('/appointments/my'),
                     // Assuming /auth/me returns staff info or we have a generic way to get my staff profile
                     // Since we don't have a direct /staff/me, we'll assume the user is staff and fetch from a new endpoint or existing.
                     // For now, let's just fetch schedule. Availability editing might require fetching current settings first.
                     // Let's add a quick endpoint for "get my profile" in staff controller or just rely on defaults.
                     // Actually, let's just use defaults for the UI demo for now or fetch if possible.
                    api.get('/auth/me') 
                ]);
                setAppointments(scheduleRes.data.data);
                
                // If the user object has staff details (populated), usage that. 
                // Otherwise we might need a specific call. for simplicity, initializing empty or default.
                const defaultWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                    .map(day => ({ day, start: '09:00', end: '17:00', isOpen: true }));
                setAvailability(defaultWeek);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSaveAvailability = async () => {
        try {
            // Transform for backend
            const payload = availability.map(d => ({
                day: d.day,
                start: d.start,
                end: d.end,
                isAvailable: d.isOpen
            }));
            
            await api.put('/staff/availability', { availability: payload });
            setMsg('Availability updated successfully!');
            setTimeout(() => { setMsg(''); setShowAvailability(false); }, 2000);
        } catch (error) {
            setMsg('Failed to update availability');
        }
    };

    const handleDayChange = (idx, field, value) => {
        const newAv = [...availability];
        newAv[idx][field] = value;
        setAvailability(newAv);
    };

    if (loading) return <Spinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold dark:text-white">Staff Schedule</h2>
                <Button onClick={() => setShowAvailability(true)} variant="secondary">Manage Availability</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {appointments.length === 0 ? (
                    <p className="text-gray-500">No appointments assigned yet.</p>
                ) : (
                    appointments.map(appt => (
                        <Card key={appt._id} className="border-l-4 border-purple-500">
                             <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{appt.timeSlot}</h3>
                                    <p className="text-sm text-gray-500">{appt.date}</p>
                                    <div className="mt-2 text-sm">
                                        <p>Client: {appt.user?.name || 'Client'}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                    appt.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {appt.status}
                                </span>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {showAvailability && (
                <Modal isOpen={true} onClose={() => setShowAvailability(false)} title="My Availability">
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                        {msg && <div className="p-2 bg-green-100 text-green-800 rounded">{msg}</div>}
                        {availability.map((day, idx) => (
                            <div key={day.day} className="flex items-center space-x-2 border-b pb-2">
                                <span className="w-24 font-medium">{day.day}</span>
                                <input 
                                    type="checkbox" 
                                    checked={day.isOpen} 
                                    onChange={(e) => handleDayChange(idx, 'isOpen', e.target.checked)}
                                />
                                {day.isOpen && (
                                    <>
                                        <input type="time" value={day.start} onChange={(e) => handleDayChange(idx, 'start', e.target.value)} className="border rounded px-1"/>
                                        <span>-</span>
                                        <input type="time" value={day.end} onChange={(e) => handleDayChange(idx, 'end', e.target.value)} className="border rounded px-1"/>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button onClick={() => setShowAvailability(false)} variant="secondary">Cancel</Button>
                        <Button onClick={handleSaveAvailability}>Save Changes</Button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default StaffDashboard;
