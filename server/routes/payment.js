const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

// Demo payment — create order
router.post('/create-order', protect, async (req, res) => {
  const { amount, bookingId } = req.body;
  res.json({ orderId: 'demo_order_' + Date.now(), amount: amount * 100, currency: 'INR', demo: true });
});

// Demo payment — auto verify
router.post('/verify', protect, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.paymentStatus = 'paid';
    booking.paymentId = 'demo_pay_' + Date.now();
    booking.status = 'confirmed';
    booking.timeline.push({ status: 'confirmed', message: 'Payment received. Booking confirmed!' });
    await booking.save();
    res.json({ message: 'Payment verified successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
