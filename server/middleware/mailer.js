const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendBookingEmail = async (toEmail, booking) => {
  try {
    await transporter.sendMail({
      from: `"Your Helper" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: `Booking Confirmed - ${booking.bookingId}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;border:1px solid #eee;border-radius:10px">
          <h2 style="color:#6C63FF">Your Helper 🛠️</h2>
          <p>Hi there! Your booking has been received.</p>
          <div style="background:#f9f9f9;padding:15px;border-radius:8px;margin:15px 0">
            <p><strong>Booking ID:</strong> ${booking.bookingId}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
            <p><strong>Amount:</strong> ₹${booking.amount}</p>
          </div>
          <p>Track your booking at: <a href="${process.env.CLIENT_URL}/track/${booking.bookingId}">Click here</a></p>
          <p style="color:#888;font-size:12px">Your Helper Team</p>
        </div>
      `
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

module.exports = { sendBookingEmail };
