const bookingsService = require('./bookings.service');

const create = async (req, res) => {
  try {
    const booking = await bookingsService.create({
      userId: req.user._id,
      serviceId: req.body.serviceId,
      details: req.body.details,
      amount: req.body.amount
    });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingsService.getMyBookings(req.user._id);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const trackBooking = async (req, res) => {
  try {
    const booking = await bookingsService.trackBooking(req.params.bookingId);
    res.json(booking);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingsService.getAllBookings();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const booking = await bookingsService.updateStatus(
      req.params.id, req.body.status, req.body.message
    );
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { create, getMyBookings, trackBooking, getAllBookings, updateStatus };
