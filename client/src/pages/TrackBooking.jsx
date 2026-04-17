import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, CheckCircle, Clock, Loader, XCircle } from 'lucide-react';
import API from '../utils/api';

const STATUS_ICONS = {
  pending: <Clock size={16} className="text-yellow-400" />,
  confirmed: <CheckCircle size={16} className="text-blue-400" />,
  'in-progress': <Loader size={16} className="text-purple-400" />,
  completed: <CheckCircle size={16} className="text-green-400" />,
  cancelled: <XCircle size={16} className="text-red-400" />,
};

export default function TrackBooking() {
  const [bookingId, setBookingId] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setBooking(null);
    try {
      const { data } = await API.get(`/bookings/track/${bookingId.trim()}`);
      setBooking(data);
    } catch {
      setError('Booking not found. Please check your Booking ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Track Booking - Your Helper</title></Helmet>
      <div className="pt-24 section-pad">
        <div className="container-custom max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4">Track Your <span className="gradient-text">Booking</span></h1>
            <p className="text-gray-400">Enter your Booking ID to see real-time status updates</p>
          </div>

          <form onSubmit={handleTrack} className="flex gap-3 mb-8">
            <input
              type="text" placeholder="Enter Booking ID (e.g. YH12345678)" required
              value={bookingId} onChange={e => setBookingId(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm"
            />
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              <Search size={16} /> {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {error && <div className="glass rounded-xl p-4 text-red-400 text-sm text-center mb-6">{error}</div>}

          {booking && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{booking.service?.icon}</span>
                <div>
                  <h2 className="text-xl font-bold">{booking.service?.title}</h2>
                  <p className="text-gray-400 text-sm">#{booking.bookingId}</p>
                </div>
                <div className="ml-auto flex items-center gap-2 glass px-3 py-1 rounded-full text-sm capitalize">
                  {STATUS_ICONS[booking.status]} {booking.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="glass rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Customer</p>
                  <p className="font-semibold text-sm">{booking.user?.name}</p>
                </div>
                <div className="glass rounded-xl p-4">
                  <p className="text-gray-400 text-xs mb-1">Amount</p>
                  <p className="font-semibold text-sm">₹{booking.amount || 'Free'}</p>
                </div>
              </div>

              <h3 className="font-bold mb-4">Live Timeline</h3>
              <div className="space-y-4">
                {booking.timeline?.map((t, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mt-1 flex-shrink-0" />
                      {i < booking.timeline.length - 1 && <div className="w-0.5 flex-1 bg-purple-500/30 mt-1" />}
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
          )}
        </div>
      </div>
    </>
  );
}
