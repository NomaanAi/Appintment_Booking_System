const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        default: 'My Business'
    },
    timezone: {
        type: String,
        default: 'UTC'
    },
    slotDuration: {
        type: Number,
        default: 30 // minutes
    },
    bufferTime: {
        type: Number,
        default: 5 // minutes
    },
    openingHours: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        start: { type: String, default: '09:00' }, // HH:mm
        end: { type: String, default: '17:00' },   // HH:mm
        isOpen: { type: Boolean, default: true }
    }],
    holidays: [{
        date: { type: String }, // YYYY-MM-DD
        description: String
    }]
});

// Ensure only one business setting exists (Singleton pattern usually handled in service)
module.exports = mongoose.model('Business', BusinessSchema);
