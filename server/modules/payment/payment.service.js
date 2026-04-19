const Booking = require('../../models/Booking');

const createOrder = async (amount, bookingId) => ({
  orderId: 'demo_order_' + Date.now(),
  amount: amount * 100,
  currency: 'INR',
  demo: true
});

const verifyPayment = async (bookingId) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error('Booking not found');
  booking.paymentStatus = 'paid';
  booking.paymentId = 'demo_pay_' + Date.now();
  booking.status = 'confirmed';
  booking.timeline.push({ status: 'confirmed', message: 'Payment received. Booking confirmed!' });
  await booking.save();
  return { message: 'Payment verified successfully' };
};

module.exports = { createOrder, verifyPayment };
