const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    staff: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff'
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true
    },
    timeSlot: {
        type: String, // HH:mm (Start time)
        required: true
    },
    duration: {
        type: Number, // minutes
        required: true
    },
    endTime: { // Calculated helper field for queries
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled', 'NoShow', 'Rescheduled', 'Rejected'],
        default: 'Pending'
    },
    // For Atomic Locking
    locked: { type: Boolean, default: false },
    lockedUntil: { type: Date },

    // Email Automation Flags
    reminderSent: { type: Boolean, default: false },
    emailLogs: [{
        type: { type: String, enum: ['Confirmation', 'Reminder', 'Cancellation', 'Rescheduled'] },
        recipient: String,
        sentAt: { type: Date, default: Date.now },
        status: { type: String, default: 'Sent' }
    }],
    
    auditLog: [{
        action: String,
        by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
        details: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient lookups and lock checks
AppointmentSchema.index({ date: 1, staff: 1 });
AppointmentSchema.index({ user: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);
