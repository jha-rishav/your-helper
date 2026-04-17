const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { protect, adminOnly } = require('../middleware/auth');

// Dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalBookings, totalServices, recentBookings] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Booking.find().sort({ createdAt: -1 }).limit(5)
        .populate('user', 'name email')
        .populate('service', 'title')
    ]);
    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({ totalUsers, totalBookings, totalServices, totalRevenue: revenue[0]?.total || 0, recentBookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all users
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete('/users/:id', protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
