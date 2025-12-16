import Modal from './Modal';
import { useState } from 'react';
import CalendarView from './CalendarView';
import api from '../api/axios';

const AppointmentDetailsModal = ({ appointment, onClose, onUpdate }) => {
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [msg, setMsg] = useState('');

    const handleReschedule = async (date, timeSlot) => {
        try {
            await api.put(`/appointments/${appointment._id}/reschedule`, { date, timeSlot });
            setMsg('Rescheduled successfully!');
            setTimeout(() => {
                onUpdate();
                onClose();
            }, 1000);
        } catch (error) {
            setMsg('Failed to reschedule. Slot might be taken.');
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Appointment Details">
            <div className="space-y-4">
                {msg && <div className="p-3 bg-green-100 text-green-800 rounded">{msg}</div>}
                
                <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Current Booking</h4>
                    <p className="text-gray-600 dark:text-gray-300">
                        Date: {appointment.date} <br/>
                        Time: {appointment.timeSlot} <br/>
                        Staff: {appointment.staff ? 'Assigned' : 'Any Available'} <br/>
                        Status: <span className="font-bold">{appointment.status}</span>
                    </p>
                </div>

                {isRescheduling ? (
                    <div className="mt-4 border-t pt-4 dark:border-gray-700">
                        <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Select New Time</h4>
                        <CalendarView onSelectSlot={handleReschedule} />
                        <button 
                            onClick={() => setIsRescheduling(false)}
                            className="mt-4 text-sm text-gray-500 hover:underline"
                        >
                            Cancel Reschedule
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 flex space-x-3">
                        {appointment.status !== 'Cancelled' && appointment.status !== 'Completed' && (
                            <>
                                <button 
                                    onClick={() => setIsRescheduling(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Reschedule
                                </button>
                                <button className="px-4 py-2 border border-red-200 text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                                    Cancel Booking
                                </button>
                            </>
                        )}
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300">
                            Close
                        </button>
                    </div>
                )}
            </div>
        </Modal>
    );
};

export default AppointmentDetailsModal;
