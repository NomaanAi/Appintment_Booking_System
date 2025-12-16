const Appointment = require('../models/Appointment');
const User = require('../models/User');

exports.getDashboardStats = async () => {
    // 1. Basic Counts
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'Pending' });
    const approvedAppointments = await Appointment.countDocuments({ status: 'Confirmed' });
    const cancelledAppointments = await Appointment.countDocuments({ status: 'Cancelled' });
    const totalUsers = await User.countDocuments({ role: 'user' });

    // 2. Revenue (Mock: Assume $50 per confirmed appt)
    const revenue = approvedAppointments * 50;

    // 3. Appointments by Day (Last 7 days)
    const appointmentsByDay = await Appointment.aggregate([
        {
            $group: {
                _id: "$date",
                count: { $sum: 1 } // All bookings including pending
            }
        },
        { $sort: { _id: 1 } },
        { $limit: 7 }
    ]);

    // 4. Cancellation Rate
    const cancellationRate = totalAppointments > 0
        ? ((cancelledAppointments / totalAppointments) * 100).toFixed(1)
        : 0;

    // 5. Peak Booking Hours
    // Extract Hour from timeSlot string "09:00" -> "09"
    // Since timeSlot is string, we can use substr or just simple javascript processing if dataset small.
    // For Production/Aggregation, let's use $project
    const peakHours = await Appointment.aggregate([
        {
            $project: {
                hour: { $substr: ["$timeSlot", 0, 2] } // "09", "14"
            }
        },
        {
            $group: {
                _id: "$hour",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 3 }
    ]);

    // 6. Staff Performance (Top 5)
    // Group by staffId, lookup name
    const staffPerformance = await Appointment.aggregate([
        { $match: { staff: { $exists: true, $ne: null }, status: 'Confirmed' } }, // Only confirmed assignments
        {
            $group: {
                _id: "$staff",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "staffs", // Collection name usually plural lower
                localField: "_id",
                foreignField: "_id",
                as: "staffDetails"
            }
        },
        // Complex: Staff model links to User. We need User Name.
        // This double lookup is expensive. 
        // Strategy: Just get IDs and counts here, and populate/fetch names via Promise.all if needed.
        // OR relies on frontend to fetch staff list and map.
        // Let's try to lookup User from Staff.
        {
            $lookup: {
                from: "users",
                localField: "staffDetails.user",
                foreignField: "_id",
                as: "userDetails"
            }
        }
        // Simplified: Return raw aggregation and let frontend handle or do lookup in controller.
    ]);

    // Populate names for Staff Performance manually for cleaner result
    const staffStats = [];
    const Staff = require('../models/Staff'); // Lazy load
    for (const item of staffPerformance) {
        const staff = await Staff.findById(item._id).populate('user', 'name');
        if (staff && staff.user) {
            staffStats.push({ name: staff.user.name, count: item.count });
        }
    }

    return {
        totalAppointments,
        pendingAppointments,
        approvedAppointments,
        cancelledAppointments,
        totalUsers,
        revenue,
        cancellationRate,
        appointmentsByDay,
        peakHours,     // Array of { _id: "09", count: 10 }
        staffStats     // Array of { name: "Dr. Smith", count: 5 }
    };
};
