const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or use standard SMTP
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // Message options
    const message = {
        from: `${process.env.FROM_NAME} <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    const info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
