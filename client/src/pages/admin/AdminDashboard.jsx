import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Users, ShoppingBag, Layers, IndianRupee, Clock, CheckCircle } from 'lucide-react';
import API from '../../utils/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats').then(res => { setStats(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const STAT_CARDS = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users size={22} />, color: 'text-blue-400' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: <ShoppingBag size={22} />, color: 'text-purple-400' },
    { label: 'Active Services', value: stats.totalServices, icon: <Layers size={22} />, color: 'text-green-400' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: <IndianRupee size={22} />, color: 'text-yellow-400' },
  ] : [];

  return (
    <>
      <Helmet><title>Admin Dashboard - Your Helper</title></Helmet>
      <div className="pt-24 section-pad">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-black mb-1">Admin <span className="gradient-text">Dashboard</span></h1>
              <p className="text-gray-400">Manage your entire platform from here</p>
            </div>
            <div className="flex gap-3">
              <Link to="/admin/services" className="btn-primary text-sm py-2 px-5">Manage Services</Link>
              <Link to="/admin/bookings" className="btn-outline text-sm py-2 px-5">View Bookings</Link>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[...Array(4)].map((_, i) => <div key={i} className="glass rounded-2xl h-28 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {STAT_CARDS.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6">
                  <div className={`${s.color} mb-3`}>{s.icon}</div>
                  <div className="text-2xl font-black">{s.value}</div>
                  <div className="text-gray-400 text-sm mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Recent Bookings */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-purple-400 text-sm hover:underline">View All</Link>
            </div>
            {stats?.recentBookings?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-white/10">
                      <th className="text-left pb-3">Booking ID</th>
                      <th className="text-left pb-3">Customer</th>
                      <th className="text-left pb-3">Service</th>
                      <th className="text-left pb-3">Status</th>
                      <th className="text-left pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stats.recentBookings.map(b => (
                      <tr key={b._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 text-purple-400 font-mono">#{b.bookingId}</td>
                        <td className="py-3">{b.user?.name}</td>
                        <td className="py-3">{b.service?.title}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs capitalize ${b.status === 'completed' ? 'bg-green-400/10 text-green-400' : b.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-purple-400/10 text-purple-400'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400">{new Date(b.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No bookings yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
