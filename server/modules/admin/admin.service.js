const User = require('../../models/User');
const Booking = require('../../models/Booking');
const Service = require('../../models/Service');

const getStats = async () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1); startOfMonth.setHours(0, 0, 0, 0);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const [totalUsers, totalBookings, totalServices, recentBookings,
    newUsersThisMonth, newBookingsThisMonth] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Booking.countDocuments(),
    Service.countDocuments({ isActive: true }),
    Booking.find().sort({ createdAt: -1 }).limit(5)
      .populate('user', 'name email').populate('service', 'title'),
    User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
    Booking.countDocuments({ createdAt: { $gte: startOfMonth } })
  ]);

  const [revenue, statusCounts, monthlyRevenue, topServices] = await Promise.all([
    Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]),
    Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]),
    Booking.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]),
    Booking.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 }, revenue: { $sum: '$amount' } } },
      { $sort: { count: -1 } }, { $limit: 5 },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $project: { title: '$service.title', icon: '$service.icon', count: 1, revenue: 1 } }
    ])
  ]);

  return {
    totalUsers, totalBookings, totalServices,
    totalRevenue: revenue[0]?.total || 0,
    recentBookings, statusCounts, monthlyRevenue, topServices,
    newUsersThisMonth, newBookingsThisMonth
  };
};

const getAllUsers = async () => {
  return await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
};

const deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
};

module.exports = { getStats, getAllUsers, deleteUser };
