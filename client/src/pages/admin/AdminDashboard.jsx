import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Layers, IndianRupee, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import API from '../../utils/api';
import AdminLayout from './AdminLayout';

const STATUS_COLORS = {
  pending: 'bg-yellow-400/10 text-yellow-400',
  confirmed: 'bg-blue-400/10 text-blue-400',
  'in-progress': 'bg-purple-400/10 text-purple-400',
  completed: 'bg-green-400/10 text-green-400',
  cancelled: 'bg-red-400/10 text-red-400',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats').then(res => { setStats(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { label: 'Total Users', value: stats.totalUsers, sub: `+${stats.newUsersThisMonth} this month`, icon: <Users size={22} />, color: 'text-blue-400', bg: 'bg-blue-400/10', trend: stats.newUsersThisMonth > 0 },
    { label: 'Total Bookings', value: stats.totalBookings, sub: `+${stats.newBookingsThisMonth} this month`, icon: <ShoppingBag size={22} />, color: 'text-purple-400', bg: 'bg-purple-400/10', trend: stats.newBookingsThisMonth > 0 },
    { label: 'Active Services', value: stats.totalServices, sub: 'Currently live', icon: <Layers size={22} />, color: 'text-green-400', bg: 'bg-green-400/10', trend: true },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, sub: 'From paid bookings', icon: <IndianRupee size={22} />, color: 'text-yellow-400', bg: 'bg-yellow-400/10', trend: stats.totalRevenue > 0 },
  ] : [];

  // Build monthly revenue chart data
  const chartData = stats?.monthlyRevenue?.map(m => ({
    label: MONTHS[m._id.month - 1],
    revenue: m.revenue,
    count: m.count
  })) || [];
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);

  return (
    <AdminLayout>
      <Helmet><title>Admin Dashboard - Your Helper</title></Helmet>

      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1">Dashboard <span className="gradient-text">Overview</span></h1>
        <p className="text-gray-400 text-sm">All your business insights in one place</p>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <div key={i} className="glass rounded-2xl h-28 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STAT_CARDS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-5">
              <div className={`inline-flex p-2 rounded-xl ${s.bg} ${s.color} mb-3`}>{s.icon}</div>
              <div className="text-2xl font-black mb-1">{s.value}</div>
              <div className="text-gray-400 text-xs mb-2">{s.label}</div>
              <div className={`flex items-center gap-1 text-xs ${s.trend ? 'text-green-400' : 'text-gray-500'}`}>
                {s.trend ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {s.sub}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 glass rounded-2xl p-6">
          <h2 className="font-bold mb-6">Revenue — Last 6 Months</h2>
          {chartData.length > 0 ? (
            <div className="flex items-end gap-3 h-40">
              {chartData.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-xs text-gray-400">₹{d.revenue}</span>
                  <div className="w-full rounded-t-lg bg-purple-600/30 hover:bg-purple-600/60 transition-all relative group" style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-xs px-2 py-1 rounded hidden group-hover:block whitespace-nowrap">
                      {d.count} bookings
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{d.label}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-500 text-sm">No revenue data yet</div>
          )}
        </div>

        {/* Booking Status Breakdown */}
        <div className="glass rounded-2xl p-6">
          <h2 className="font-bold mb-6">Bookings by Status</h2>
          {stats?.statusCounts?.length > 0 ? (
            <div className="space-y-3">
              {stats.statusCounts.map((s, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs capitalize ${STATUS_COLORS[s._id] || 'bg-gray-400/10 text-gray-400'}`}>{s._id}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(s.count / stats.totalBookings) * 100}%` }} />
                    </div>
                    <span className="text-sm font-bold">{s.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">No bookings yet</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold">Top Services</h2>
            <Link to="/admin/services" className="text-purple-400 text-xs flex items-center gap-1 hover:underline">Manage <ArrowRight size={12} /></Link>
          </div>
          {stats?.topServices?.length > 0 ? (
            <div className="space-y-4">
              {stats.topServices.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{s.title}</p>
                    <p className="text-xs text-gray-500">{s.count} bookings</p>
                  </div>
                  <span className="text-green-400 text-sm font-bold">₹{s.revenue}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">No bookings yet</p>
          )}
        </div>

        {/* Recent Bookings */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-purple-400 text-xs flex items-center gap-1 hover:underline">View All <ArrowRight size={12} /></Link>
          </div>
          {stats?.recentBookings?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentBookings.map(b => (
                <div key={b._id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{b.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{b.service?.title}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${STATUS_COLORS[b.status] || ''}`}>{b.status}</span>
                    <p className="text-xs text-gray-500 mt-1">{new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-8">No bookings yet</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
