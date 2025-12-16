const Business = require('../models/Business');
const Staff = require('../models/Staff');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

// Helper to convert time "09:00" to minutes 540
const timeToMinutes = (time) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

// Helper to convert minutes 540 to "09:00"
const minutesToTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

exports.generateSlots = async (dateStr, staffId) => {
    // 1. Get Business Settings
    const business = await Business.findOne();
    if (!business) throw new Error('Business settings not configured');

    const date = new Date(dateStr);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    // 2. Check Global Holidays
    const isHoliday = business.holidays.some(h => new Date(h.date).toDateString() === date.toDateString());
    if (isHoliday) return [];

    // 3. Determine Hours (Staff override or Business default)
    let openingHours = business.openingHours.find(d => d.day === dayName);

    if (staffId) {
        const staff = await Staff.findById(staffId);
        if (staff && staff.availability && staff.availability.length > 0) {
            const staffDay = staff.availability.find(d => d.day === dayName);
            if (staffDay) {
                // If staff has specific schedule for this day, use it
                openingHours = staffDay;
            }
        }
    }

    if (!openingHours || !openingHours.isOpen) return []; // Closed

    const startMin = timeToMinutes(openingHours.start);
    const endMin = timeToMinutes(openingHours.end);
    const slotDuration = business.slotDuration;
    const bufferTime = business.bufferTime || 0;

    // 4. Fetch Existing Appointments
    let query = { date: dateStr, status: { $ne: 'Cancelled' } };
    if (staffId) query.staff = staffId;

    // If no specific staff, we need to check capacity? 
    // Pro logic: If no staff selected, show slots available for ANY staff.
    // For simplicity in this iteration: If no staff selected, we assume generic business capacity (or need to loop all staff).
    // Let's implement: If staffId provided, strict check. If not, only block if ALL staff booked? 
    // Easier approach for v1: User must select staff or we auto-assign (auto-assign logic needed).
    // Let's stick to: Slots showing availability. If staffId is null, we might show slots if at least one staff is free.
    // For now, let's assume staffId is optional and we just check general business constraint if generic, OR simple collision if generic.
    // To match "Production" standard: we should ideally aggregate availability across all active staff.

    const appointments = await Appointment.find(query);

    // 5. Generate Time Slots
    let slots = [];
    // Current Time for "Past" validation
    const now = new Date();
    const isToday = new Date().toDateString() === date.toDateString();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (let time = startMin; time + slotDuration <= endMin; time += slotDuration + bufferTime) {
        const timeStr = minutesToTime(time);

        // Validation: Past Time
        if (isToday && time <= currentMinutes) {
            slots.push({ time: timeStr, available: false, reason: 'Past' });
            continue;
        }

        // Validation: Slot Collision
        // Simple overlap check
        const isTaken = appointments.some(appt => {
            // If appointment is at this time
            return appt.timeSlot === timeStr;
            // Better: Check durations overlap if variable durations allow
        });

        if (isTaken) {
            slots.push({ time: timeStr, available: false, reason: 'Booked' });
        } else {
            slots.push({ time: timeStr, available: true });
        }
    }

    return slots;
};

exports.attemptLockSlot = async (userId, staffId, date, timeSlot) => {
    // START TRANSACTION
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Re-Verify Availability (Race Condition Check)
        // We must query INSIDE the transaction
        const existingBooking = await Appointment.findOne({
            date: date,
            timeSlot: timeSlot,
            status: { $in: ['Pending', 'Confirmed', 'locked'] }, // Check locked too
            // If staffId is specific, check that staff. If generic, check if capacity full?
            // Assuming 1-1 booking for now:
            ...(staffId ? { staff: staffId } : {})
        }).session(session);

        if (existingBooking) {
            throw new Error('Slot already reserved.');
        }

        // 2. Create Appointment (Default Pending)
        // If staffId not provided, we might auto-assign here or leave null
        const appointment = await Appointment.create([{
            user: userId,
            staff: staffId, // Might be null
            date: date,
            timeSlot: timeSlot,
            duration: 30, // Default or fetch from settings
            status: 'Pending',
            auditLog: [{
                action: 'Created',
                timestamp: new Date(),
                details: 'User initiated booking'
            }]
        }], { session });

        await session.commitTransaction();
        session.endSession();
        return appointment[0];

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error; // Rethrow to controller
    }
};
