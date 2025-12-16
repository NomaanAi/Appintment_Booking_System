const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const notificationService = require('./notificationService');
const User = require('../models/User');

const startReminderJob = () => {
    // Schedule: Run every hour at minute 0
    // For Production: '0 * * * *'
    // For Demo: '*/5 * * * *' (Every 5 mins) or stick to hourly but checking a wider window?
    // Let's do Hourly. 
    cron.schedule('0 * * * *', async () => {
        console.log('Running Reminder Cron Job...');
        try {
            // Logic: Find appointments starting in ~24 hours (23.5 to 24.5 h window)
            // Simpler: Find all [tomorrow start, tomorrow end] and filter? 
            // Better: Find appointments where date is TOMORROW and reminderSent is false.

            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0]; // "YYYY-MM-DD"

            // Since we store Date as String "YYYY-MM-DD", this is easy!
            // We just match the date string.

            const appointments = await Appointment.find({
                date: tomorrowStr,
                status: 'Confirmed',
                reminderSent: false
            }).populate('user');
            // We need User details for email

            console.log(`Found ${appointments.length} appointments for reminder.`);

            for (const appt of appointments) {
                if (appt.user && appt.user.email) {
                    await notificationService.notifyReminder(appt.user, appt);

                    // Update Flag
                    appt.reminderSent = true;
                    appt.emailLogs.push({
                        type: 'Reminder',
                        recipient: appt.user.email,
                        status: 'Sent'
                    });

                    await appt.save();
                    console.log(`Reminder sent to ${appt.user.email} for ${appt._id}`);
                }
            }
        } catch (error) {
            console.error('Error in Reminder Cron:', error);
        }
    });

    console.log('Cron Job Initialized: Reminders check every hour.');
};

module.exports = startReminderJob;
