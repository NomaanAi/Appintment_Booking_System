const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// General Limiter
exports.limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Booking Specific Limiter (Stricter)
exports.bookingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 bookings per hour
    message: 'Too many booking attempts from this IP, please try again later'
});

// Auth Limiter (Brute Force Protection)
exports.authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // 20 login attempts per hour
    message: 'Too many login attempts, please try again later'
});

exports.helmetConfig = helmet();
