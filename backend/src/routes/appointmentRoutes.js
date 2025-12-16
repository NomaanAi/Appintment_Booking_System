const express = require('express');
const router = express.Router();
const { createAppointment, getMyAppointments, getAllAppointments, updateStatus, getSlots, reschedule, exportAppointments } = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate, schemas } = require('../middleware/validationMiddleware');
const { bookingLimiter } = require('../middleware/securityMiddleware');

// Public/User routes
router.get('/slots', getSlots);
router.post('/', protect, bookingLimiter, validate(schemas.createAppointment), createAppointment);
router.get('/my', protect, getMyAppointments);
router.put('/:id/reschedule', protect, bookingLimiter, reschedule);

// Admin routes
router.get('/', protect, admin, getAllAppointments); // Now supports query params
router.get('/export', protect, admin, exportAppointments); // CSV Export
router.put('/:id/status', protect, admin, validate(schemas.updateStatus), updateStatus);

module.exports = router;
