import { useState, useEffect } from 'react';
import api from '../api/axios';
import Card from '../components/Card';
import Button from '../components/Button';
import CalendarView from '../components/CalendarView';
import StatusBadge from '../components/StatusBadge';
import AppointmentDetailsModal from '../components/AppointmentDetailsModal';
import Spinner from '../components/Spinner';

const UserDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppt, setSelectedAppt] = useState(null);
    const [isBooking, setIsBooking] = useState(false);
    const [bookingMsg, setBookingMsg] = useState('');

    const fetchUserAppointments = async () => {
        try {
            const { data } = await api.get('/appointments/my');
            setAppointments(data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserAppointments();
    }, []);

    const handleBook = async (slot) => {
        setIsBooking(true);
        setBookingMsg('');
        try {
             await api.post('/appointments', {
                date: slot.date,
                timeSlot: slot.time,
                staffId: null // Optional logic
            });
            setBookingMsg('Appointment request sent! Waiting for confirmation.');
            fetchUserAppointments();
        } catch (error) {
            setBookingMsg(error.response?.data?.message || 'Booking failed');
        } finally {
            setIsBooking(false);
             // Clear msg after 3s
             setTimeout(() => setBookingMsg(''), 5000);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">My Appointments</h2>
            
            {/* Booking Section */}
            <Card className="border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Book New Appointment</h3>
                {bookingMsg && (
                    <div className={`p-3 rounded mb-4 ${bookingMsg.includes('failed') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {bookingMsg}
                    </div>
                )}
                <CalendarView onSelectSlot={handleBook} />
                {isBooking && <p className="text-sm text-blue-500 mt-2">Processing booking...</p>}
            </Card>

            {/* List Section */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold dark:text-white">Upcoming Schedule</h3>
                {loading ? <Spinner /> : (
                    appointments.length === 0 ? (
                        <p className="text-gray-500">No appointments found.</p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {appointments.map((appt) => (
                                <div key={appt._id} onClick={() => setSelectedAppt(appt)} className="cursor-pointer">
                                    <Card className="hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white text-lg">{appt.timeSlot}</p>
                                                <p className="text-sm text-gray-500">{appt.date}</p>
                                            </div>
                                            <StatusBadge status={appt.status} />
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>

            {selectedAppt && (
                <AppointmentDetailsModal 
                    appointment={selectedAppt} 
                    onClose={() => setSelectedAppt(null)} 
                    onUpdate={fetchUserAppointments} 
                />
            )}
        </div>
    );
};

export default UserDashboard;
