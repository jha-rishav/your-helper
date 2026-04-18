const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const { protect, adminOnly } = require('../middleware/auth');

// Full dashboard stats + insights
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalBookings, totalServices, recentBookings, allBookings] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Booking.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email').populate('service', 'title'),
      Booking.find().populate('service', 'title category')
    ]);

    const revenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Bookings by status
    const statusCounts = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Revenue by month (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Booking.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top services by bookings
    const topServices = await Booking.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 }, revenue: { $sum: '$amount' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $project: { title: '$service.title', icon: '$service.icon', count: 1, revenue: 1 } }
    ]);

    // New users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);
    const newUsersThisMonth = await User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } });
    const newBookingsThisMonth = await Booking.countDocuments({ createdAt: { $gte: startOfMonth } });

    res.json({
      totalUsers, totalBookings, totalServices,
      totalRevenue: revenue[0]?.total || 0,
      recentBookings, statusCounts, monthlyRevenue, topServices,
      newUsersThisMonth, newBookingsThisMonth
    });
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
