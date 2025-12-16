const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Staff = require('./src/models/Staff');
const Business = require('./src/models/Business');
const Appointment = require('./src/models/Appointment');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/aps');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('DB Connection FAIL:', err);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        await connectDB();
        // ... rest of script ...

        console.log('Clearing old data...');
        await User.deleteMany({});
        await Staff.deleteMany({});
        await Business.deleteMany({});
        await Appointment.deleteMany({});

        console.log('Creating Business Settings...');
        await Business.create({
            name: 'Pro Clinic',
            timezone: 'UTC',
            openingHours: [
                { day: 'Monday', start: '09:00', end: '17:00', isOpen: true },
                { day: 'Tuesday', start: '09:00', end: '17:00', isOpen: true },
                { day: 'Wednesday', start: '09:00', end: '17:00', isOpen: true },
                { day: 'Thursday', start: '09:00', end: '17:00', isOpen: true },
                { day: 'Friday', start: '09:00', end: '17:00', isOpen: true },
                { day: 'Saturday', start: '10:00', end: '14:00', isOpen: true },
                { day: 'Sunday', start: '00:00', end: '00:00', isOpen: false }
            ],
            slotDuration: 30,
            bufferTime: 0,
            holidays: []
        });

        console.log('Creating Users...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 1. Admin
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        // 2. Staff
        const staff1 = await User.create({
            name: 'Dr. Sarah Smith',
            email: 'sarah@example.com',
            password: hashedPassword,
            role: 'staff'
        });

        const staff2 = await User.create({
            name: 'Dr. John Doe',
            email: 'john@example.com',
            password: hashedPassword,
            role: 'staff'
        });

        // Create Staff Profiles
        const s1 = await Staff.create({ user: staff1._id, specialties: ['General'], availability: [] });
        const s2 = await Staff.create({ user: staff2._id, specialties: ['Specialist'], availability: [] });

        // 3. Regular Users
        const u1 = await User.create({ name: 'Alice Client', email: 'alice@example.com', password: hashedPassword, role: 'user' });
        const u2 = await User.create({ name: 'Bob Client', email: 'bob@example.com', password: hashedPassword, role: 'user' });
        const u3 = await User.create({ name: 'Charlie Client', email: 'charlie@example.com', password: hashedPassword, role: 'user' });

        console.log('Creating Appointments...');

        // Helper to get formatted date string for upcoming days
        const getFutureDate = (days) => {
            const d = new Date();
            d.setDate(d.getDate() + days);
            return d.toISOString().split('T')[0];
        };

        const appointments = [
            { user: u1._id, staff: s1._id, date: getFutureDate(1), timeSlot: '09:00', status: 'Confirmed' },
            { user: u2._id, staff: s1._id, date: getFutureDate(1), timeSlot: '10:00', status: 'Pending' },
            { user: u3._id, staff: s2._id, date: getFutureDate(2), timeSlot: '11:00', status: 'Confirmed' },
            { user: u1._id, staff: s2._id, date: getFutureDate(2), timeSlot: '14:00', status: 'Cancelled' }, // for KPI
            { user: u2._id, staff: s1._id, date: getFutureDate(3), timeSlot: '09:30', status: 'Completed' },
            // Batch of past appts for volume
            { user: u3._id, staff: s1._id, date: getFutureDate(-2), timeSlot: '10:00', status: 'Completed' },
            { user: u1._id, staff: s2._id, date: getFutureDate(-1), timeSlot: '15:00', status: 'Confirmed' },
            { user: u2._id, staff: s2._id, date: getFutureDate(-5), timeSlot: '12:00', status: 'Cancelled' }
        ];

        for (const apt of appointments) {
            await Appointment.create({
                ...apt,
                duration: 30,
                auditLog: [{ action: 'Created via Seed', timestamp: new Date(), details: 'Initial seed' }]
            });
        }

        console.log('Database Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error("SEEDING FAILED MSG:", error.message);
        if (error.errors) {
            console.error("VALIDATION ERRORS:", JSON.stringify(error.errors, null, 2));
        }
        process.exit(1);
    }
};

seedData();
