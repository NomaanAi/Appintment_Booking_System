import { useState, useEffect } from 'react';
import api from '../api/axios';
import Spinner from './Spinner';

const CalendarView = ({ onSelectSlot }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [staffId, setStaffId] = useState(''); // Future: Staff selector

    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/appointments/slots?date=${date}&staffId=${staffId}`);
                setSlots(data.data);
            } catch (error) {
                console.error("Failed to fetch slots", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, [date, staffId]);

    const handleDateChange = (e) => setDate(e.target.value);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Select a Date & Time</h3>
            
            <div className="mb-6">
                <input 
                    type="date" 
                    value={date} 
                    onChange={handleDateChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            {loading ? (
                <div className="flex justify-center p-8"><Spinner /></div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {slots.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">No slots available for this date.</p>
                    ) : (
                        slots.map((slot, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSelectSlot(date, slot.time)}
                                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors
                                    ${slot.available 
                                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }
                                `}
                                disabled={!slot.available}
                            >
                                {slot.time}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default CalendarView;
