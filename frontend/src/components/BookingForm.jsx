import { useState } from 'react';
import api from '../api/axios';
import Spinner from './Spinner';

const BookingForm = ({ onBookingSuccess }) => {
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMsg('');

        try {
            await api.post('/appointments', { date, timeSlot });
            setMsg('Appointment request sent successfully!');
            setDate('');
            setTimeSlot('');
            if (onBookingSuccess) onBookingSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    const slots = [
        "09:00 AM", "10:00 AM", "11:00 AM", 
        "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
    ];

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-xl p-6 border border-gray-100 dark:border-gray-700 transition-all">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Book an Appointment</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Select a date and time to reserve your spot.</p>
            
            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
                {error && <div className="sm:col-span-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm">{error}</div>}
                {msg && <div className="sm:col-span-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-sm">{msg}</div>}
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                    <input
                        type="date"
                        min={minDate}
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Slot</label>
                    <select
                        required
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Select a slot</option>
                        {slots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                        ))}
                    </select>
                </div>

                <div className="sm:col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full inline-flex justify-center py-2.5 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                    >
                        {loading ? <Spinner /> : 'Request Booking'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BookingForm;
