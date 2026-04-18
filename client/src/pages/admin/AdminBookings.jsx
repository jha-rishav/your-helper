import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import AdminLayout from './AdminLayout';

const STATUSES = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ status: '', message: '' });

  const fetchBookings = () => {
    API.get('/bookings').then(res => { setBookings(res.data); setLoading(false); }).catch(() => setLoading(false));
  };
  useEffect(() => { fetchBookings(); }, []);

  const handleStatusUpdate = async (id) => {
    try {
      await API.put(`/bookings/${id}/status`, statusMsg);
      toast.success('Status updated!');
      setSelected(null);
      fetchBookings();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <AdminLayout>
      <Helmet><title>Manage Bookings - Admin</title></Helmet>
      <div>
          <h1 className="text-3xl font-black mb-8">Manage <span className="gradient-text">Bookings</span></h1>

          {/* Filter */}
          <div className="flex flex-wrap gap-3 mb-6">
            {['all', ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-full text-sm capitalize transition-all ${filter === s ? 'bg-purple-600 text-white' : 'glass text-gray-400 hover:text-white'}`}>
                {s}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bookings List */}
            <div className="lg:col-span-2 glass rounded-2xl overflow-hidden">
              {loading ? (
                <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />)}</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400">
                      <th className="text-left p-4">Booking</th>
                      <th className="text-left p-4">Customer</th>
                      <th className="text-left p-4">Amount</th>
                      <th className="text-left p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filtered.map(b => (
                      <tr key={b._id} onClick={() => { setSelected(b); setStatusMsg({ status: b.status, message: '' }); }} className="hover:bg-white/5 cursor-pointer transition-colors">
                        <td className="p-4">
                          <p className="font-mono text-purple-400 text-xs">#{b.bookingId}</p>
                          <p className="text-gray-300 text-xs mt-1">{b.service?.title}</p>
                        </td>
                        <td className="p-4">
                          <p className="text-sm">{b.user?.name}</p>
                          <p className="text-gray-500 text-xs">{b.user?.phone}</p>
                        </td>
                        <td className="p-4 text-green-400 font-semibold">₹{b.amount || 0}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs capitalize ${b.status === 'completed' ? 'bg-green-400/10 text-green-400' : b.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' : b.status === 'cancelled' ? 'bg-red-400/10 text-red-400' : 'bg-purple-400/10 text-purple-400'}`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!loading && filtered.length === 0 && <p className="text-center text-gray-500 py-12">No bookings found</p>}
            </div>

            {/* Update Panel */}
            <div>
              {selected ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
                  <h3 className="font-bold mb-4">Update Booking</h3>
                  <p className="text-gray-400 text-xs mb-1">Booking ID</p>
                  <p className="font-mono text-purple-400 mb-4">#{selected.bookingId}</p>
                  <p className="text-gray-400 text-xs mb-1">Customer</p>
                  <p className="font-semibold mb-1">{selected.user?.name}</p>
                  <p className="text-gray-400 text-xs mb-4">{selected.user?.email}</p>

                  <div className="space-y-3">
                    <select
                      value={statusMsg.status}
                      onChange={e => setStatusMsg({ ...statusMsg, status: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 text-sm"
                    >
                      {STATUSES.map(s => <option key={s} value={s} className="bg-gray-900 capitalize">{s}</option>)}
                    </select>
                    <input
                      placeholder="Status message for customer"
                      value={statusMsg.message}
                      onChange={e => setStatusMsg({ ...statusMsg, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 text-sm"
                    />
                    <button onClick={() => handleStatusUpdate(selected._id)} className="btn-primary w-full text-sm">
                      Update Status
                    </button>
                  </div>

                  {/* Timeline */}
                  <div className="mt-6">
                    <h4 className="font-semibold text-sm mb-3">Timeline</h4>
                    <div className="space-y-3 max-h-48 overflow-y-auto">
                      {selected.timeline?.map((t, i) => (
                        <div key={i} className="text-xs">
                          <p className="font-medium capitalize text-purple-300">{t.status}</p>
                          <p className="text-gray-400">{t.message}</p>
                          <p className="text-gray-600">{new Date(t.time).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="glass rounded-2xl p-6 text-center text-gray-500">
                  <p className="text-3xl mb-2">👈</p>
                  <p className="text-sm">Click a booking to manage it</p>
                </div>
              )}
            </div>
          </div>
      </div>
    </AdminLayout>
  );
}
