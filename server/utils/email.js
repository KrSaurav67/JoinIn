const { Resend } = require('resend');
const dotenv = require('dotenv');
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        await resend.emails.send({
            from: 'JoinIn <onboarding@resend.dev>',
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,
            html: `
            <h2>Hi ${userName}!</h2>
            <p>Your booking for the event <strong>${eventTitle}</strong> is successfully confirmed.</p>
            <p>Thank you for choosing JoinIn.</p>
            `
        });
    } catch (error) {
        console.error('Error sending booking email:', error);
        throw error;
    }
};

const sendOTPEmail = async (userEmail, otp, type) => {
    try {
        const title = type === 'account_verification' ? 'Verify your JoinIn Account' : 'JoinIn Booking Verification';

        await resend.emails.send({
            from: 'JoinIn <onboarding@resend.dev>',
            to: userEmail,
            subject: title,
            html: `
            <div style="font-family: Arial, sans-serif; text-align:center; padding: 20px;">
                <h2 style="color: #111;">${title}</h2>
                <div style="margin:20px auto; padding:15px;font-size:24px;font-weight: bold; background: #f4f4f4; width: max-content; letter-spacing: 5px;">
                ${otp}
                </div>
                <p style="color: #999; font-size:12px;">This code expires in 5 minutes. If you didn't request this, please ignore this email.</p>
            </div>
            `
        });
    } catch (error) {
        console.error(`Error sending OTP email to ${userEmail} for ${type}:`, error);
        throw error;
    }
};

module.exports = { sendBookingEmail, sendOTPEmail };