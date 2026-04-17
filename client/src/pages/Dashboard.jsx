import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Loader, CreditCard } from 'lucide-react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const STATUS_STYLES = {
  pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: <Clock size={14} /> },
  confirmed: { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: <CheckCircle size={14} /> },
  'in-progress': { color: 'text-purple-400', bg: 'bg-purple-400/10', icon: <Loader size={14} /> },
  completed: { color: 'text-green-400', bg: 'bg-green-400/10', icon: <CheckCircle size={14} /> },
  cancelled: { color: 'text-red-400', bg: 'bg-red-400/10', icon: <XCircle size={14} /> },
};

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get('/bookings/my').then(res => { setBookings(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet><title>My Dashboard - Your Helper</title></Helmet>
      <div className="pt-24 section-pad">
        <div className="container-custom">
          <div className="mb-10">
            <h1 className="text-4xl font-black mb-2">My <span className="gradient-text">Dashboard</span></h1>
            <p className="text-gray-400">Welcome back, {user?.name}! Track all your service requests here.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="glass rounded-2xl h-24 animate-pulse" />)}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl">
              <p className="text-5xl mb-4">📋</p>
              <p className="text-gray-400">No bookings yet. <a href="/services" className="text-purple-400 hover:underline">Browse services</a></p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Booking List */}
              <div className="lg:col-span-1 space-y-4">
                {bookings.map((b, i) => {
                  const s = STATUS_STYLES[b.status] || STATUS_STYLES.pending;
                  return (
                    <motion.div
                      key={b._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      onClick={() => setSelected(b)}
                      className={`glass rounded-2xl p-5 cursor-pointer transition-all hover:border-purple-500/50 ${selected?._id === b._id ? 'border-purple-500' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm">{b.service?.title}</p>
                          <p className="text-gray-500 text-xs mt-1">#{b.bookingId}</p>
                        </div>
                        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${s.color} ${s.bg}`}>
                          {s.icon} {b.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(b.createdAt).toLocaleDateString()}</span>
                        <span className={b.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}>
                          <CreditCard size={12} className="inline mr-1" />{b.paymentStatus}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Booking Detail / Timeline */}
              <div className="lg:col-span-2">
                {selected ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl">{selected.service?.icon}</span>
                      <div>
                        <h2 className="text-xl font-bold">{selected.service?.title}</h2>
                        <p className="text-gray-400 text-sm">Booking ID: #{selected.bookingId}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="glass rounded-xl p-4">
                        <p className="text-gray-400 text-xs mb-1">Amount</p>
                        <p className="font-bold text-lg">₹{selected.amount || 'Free'}</p>
                      </div>
                      <div className="glass rounded-xl p-4">
                        <p className="text-gray-400 text-xs mb-1">Payment</p>
                        <p className={`font-bold text-lg capitalize ${selected.paymentStatus === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {selected.paymentStatus}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <h3 className="font-bold mb-4">Tracking Timeline</h3>
                    <div className="space-y-4">
                      {selected.timeline?.map((t, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-3 h-3 rounded-full bg-purple-500 mt-1" />
                            {i < selected.timeline.length - 1 && <div className="w-0.5 h-full bg-purple-500/30 mt-1" />}
                          </div>
                          <div className="pb-4">
                            <p className="text-sm font-medium capitalize">{t.status}</p>
                            <p className="text-gray-400 text-xs">{t.message}</p>
                            <p className="text-gray-600 text-xs mt-1">{new Date(t.time).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <div className="glass rounded-2xl p-8 text-center text-gray-500">
                    <p className="text-4xl mb-3">👈</p>
                    <p>Select a booking to see details & tracking</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
