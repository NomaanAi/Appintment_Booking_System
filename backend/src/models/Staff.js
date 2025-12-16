const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    specialties: [String],
    // Override business hours for specific staff
    availability: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
            required: true
        },
        start: String, // "09:00"
        end: String,   // "17:00"
        isAvailable: {
            type: Boolean,
            default: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Staff', staffSchema);
