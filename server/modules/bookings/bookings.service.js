const Booking = require('../../models/Booking');

const create = async ({ userId, serviceId, details, amount }) => {
  return await Booking.create({
    user: userId,
    service: serviceId,
    details,
    amount,
    timeline: [{ status: 'pending', message: 'Booking received successfully' }]
  });
};

const getMyBookings = async (userId) => {
  return await Booking.find({ user: userId })
    .populate('service', 'title icon category slug')
    .sort({ createdAt: -1 });
};

const trackBooking = async (bookingId) => {
  const booking = await Booking.findOne({ bookingId })
    .populate('service', 'title icon')
    .populate('user', 'name email');
  if (!booking) throw new Error('Booking not found');
  return booking;
};

const getAllBookings = async () => {
  return await Booking.find()
    .populate('user', 'name email phone')
    .populate('service', 'title category')
    .sort({ createdAt: -1 });
};

const updateStatus = async (id, status, message) => {
  const booking = await Booking.findById(id);
  if (!booking) throw new Error('Booking not found');
  booking.status = status;
  booking.timeline.push({ status, message: message || `Status updated to ${status}` });
  await booking.save();
  return booking;
};

module.exports = { create, getMyBookings, trackBooking, getAllBookings, updateStatus };
