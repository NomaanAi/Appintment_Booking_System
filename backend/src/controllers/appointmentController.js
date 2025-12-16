const appointmentService = require('../services/appointmentService');
const schedulerService = require('../services/schedulerService');
const notificationService = require('../services/notificationService');
const { catchAsync } = require('../middleware/errorMiddleware');
const User = require('../models/User');

// Public/User: Get available slots
exports.getSlots = catchAsync(async (req, res, next) => {
    const { date, staffId } = req.query;
    if (!date) {
        return res.status(400).json({ status: 'fail', message: 'Date is required' });
    }
    const slots = await schedulerService.generateSlots(date, staffId);
    res.status(200).json({
        status: 'success',
        data: slots
    });
});

exports.createAppointment = catchAsync(async (req, res, next) => {
    const { date, timeSlot, staffId } = req.body;
    const appointment = await schedulerService.attemptLockSlot(req.user.id, staffId, date, timeSlot);
    await notificationService.notifyBookingCreated(req.user, appointment);
    res.status(201).json({ status: 'success', data: appointment });
});

exports.reschedule = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { date, timeSlot } = req.body;
    const appointment = await appointmentService.rescheduleAppointment(id, date, timeSlot, req.user.id);
    await notificationService.notifyBookingCreated(req.user, appointment);
    res.status(200).json({ status: 'success', data: appointment, message: 'Rescheduled successfully' });
});

exports.getMyAppointments = catchAsync(async (req, res, next) => {
    const appointments = await appointmentService.getUserAppointments(req.user.id);
    res.status(200).json({ status: 'success', data: appointments });
});

// Admin: Advanced Get Al
exports.getAllAppointments = catchAsync(async (req, res, next) => {
    // Pass entire query object (page, limit, status, search, date)
    const result = await appointmentService.getAllAppointments(req.query);
    res.status(200).json({
        status: 'success',
        data: result.appointments,
        meta: {
            total: result.total,
            page: result.page,
            pages: result.pages
        }
    });
});

exports.updateStatus = catchAsync(async (req, res, next) => {
    const appointment = await appointmentService.updateAppointmentStatus(req.params.id, req.body.status);
    const user = await User.findById(appointment.user);
    if (user) {
        await notificationService.notifyStatusChange(user, appointment);
    }
    res.status(200).json({ status: 'success', data: appointment });
});

// CSV Export
exports.exportAppointments = catchAsync(async (req, res, next) => {
    // Re-use logic or create specialized service method
    // For large datasets, cursor/streaming is better. For this scale, fetch all is okay.
    const { appointments } = await appointmentService.getAllAppointments({ ...req.query, limit: 10000 }); // High limit for export

    // Simple CSV conversion
    const headers = ['ID,User,Email,Date,Time,Duration,Status,Staff'];
    const rows = appointments.map(a => {
        return `${a._id},"${a.user?.name || ''}","${a.user?.email || ''}",${a.date},${a.timeSlot},${a.duration},${a.status},"${a.staff || ''}"`;
    });
    const csv = headers.concat(rows).join('\n');

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="appointments.csv"');
    res.status(200).send(csv);
});
