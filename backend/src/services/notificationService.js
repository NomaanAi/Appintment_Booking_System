const nodemailer = require('nodemailer');

// Initialize Transporter
// PRO TIP: In production, usage AWS SES, SendGrid, or Mailgun credentials from .env
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
        user: process.env.SMTP_USER || 'sample_user', // Fallback for dev if env missing
        pass: process.env.SMTP_PASS || 'sample_pass'
    }
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        const info = await transporter.sendMail({
            from: '"Pro Clinic System" <no-reply@proclinic.com>',
            to,
            subject,
            html
        });
        console.log(`Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        return false;
    }
};

const templates = {
    confirmation: (user, appointment) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2 style="color: #2563eb;">Booking Confirmed!</h2>
            <p>Hi ${user.name},</p>
            <p>Your appointment has been successfully booked.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Date:</strong> ${appointment.date}</p>
                <p><strong>Time:</strong> ${appointment.timeSlot}</p>
                <p><strong>Status:</strong> <span style="color: green;">${appointment.status}</span></p>
            </div>
            <p>Need to reschedule? <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard">Click here</a></p>
        </div>
    `,
    reminder: (user, appointment) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2 style="color: #d97706;">Appointment Reminder ⏰</h2>
            <p>Hi ${user.name},</p>
            <p>This is a reminder for your upcoming appointment tomorrow.</p>
            <div style="background: #fffbeb; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Date:</strong> ${appointment.date}</p>
                <p><strong>Time:</strong> ${appointment.timeSlot}</p>
            </div>
            <p>We look forward to seeing you!</p>
        </div>
    `,
    statusChange: (user, appointment, status) => `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h2 style="color: #4b5563;">Status Update</h2>
            <p>Hi ${user.name},</p>
            <p>The status of your appointment on <strong>${appointment.date}</strong> has changed to: <strong>${status}</strong>.</p>
        </div>
    `
};

exports.notifyBookingCreated = async (user, appointment) => {
    await sendEmail({
        to: user.email,
        subject: 'Booking Confirmation - Pro Clinic',
        html: templates.confirmation(user, appointment)
    });
};

exports.notifyReminder = async (user, appointment) => {
    await sendEmail({
        to: user.email,
        subject: 'Upcoming Appointment Reminder',
        html: templates.reminder(user, appointment)
    });
};

exports.notifyStatusChange = async (user, appointment) => {
    await sendEmail({
        to: user.email,
        subject: `Appointment Update: ${appointment.status}`,
        html: templates.statusChange(user, appointment, appointment.status)
    });
};
