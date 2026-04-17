import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function ServiceDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', phone: '', email: '', details: '' });
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    API.get(`/services/${slug}`).then(res => { setService(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [slug]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setBooking(true);
    try {
      const { data } = await API.post('/bookings', {
        serviceId: service.id || service._id,
        details: form,
        amount: service.price
      });

      if (service.price > 0) {
        // Demo payment — auto verify without Razorpay
        await API.post('/payment/create-order', { amount: service.price, bookingId: data.bookingId });
        await API.post('/payment/verify', { bookingId: data.id || data._id });
        toast.success('🎉 Payment successful! Booking confirmed. (Demo Mode)');
      } else {
        toast.success(`✅ Booking confirmed! ID: ${data.bookingId}`);
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="pt-24 text-center py-20 text-gray-400">Loading...</div>;
  if (!service) return <div className="pt-24 text-center py-20 text-gray-400">Service not found</div>;

  return (
    <>
      <Helmet>
        <title>{service.title} - Your Helper</title>
        <meta name="description" content={service.shortDesc} />
      </Helmet>

      <div className="pt-24 section-pad">
        <div className="container-custom max-w-5xl">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Service Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="text-6xl mb-4">{service.icon}</div>
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 capitalize">
                {service.category}
              </span>
              <h1 className="text-4xl font-black mt-4 mb-4">{service.title}</h1>
              <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>

              {service.features?.length > 0 && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold mb-4">What's Included</h3>
                  <ul className="space-y-3">
                    {service.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle size={16} className="text-green-400 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {service.price > 0 && (
                <div className="mt-6 glass rounded-2xl p-4">
                  <p className="text-gray-400 text-sm">{service.priceLabel}</p>
                  <p className="text-3xl font-black gradient-text">₹{service.price}</p>
                  <p className="text-xs text-yellow-400 mt-1">⚡ Demo Mode — no real payment needed</p>
                </div>
              )}
            </motion.div>

            {/* Booking Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Book This Service</h2>
                <form onSubmit={handleBook} className="space-y-4">
                  <input
                    type="text" placeholder="Your Name" required
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                  <input
                    type="tel" placeholder="Phone Number" required
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                  <input
                    type="email" placeholder="Email Address" required
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                  <textarea
                    placeholder="Describe your requirement in detail..." rows={4} required
                    value={form.details} onChange={e => setForm({ ...form, details: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm resize-none"
                  />
                  <button type="submit" disabled={booking} className="btn-primary w-full">
                    {booking ? 'Processing...' : service.price > 0 ? `Book & Pay ₹${service.price} (Demo)` : 'Book Now (Free)'}
                  </button>
                  {!user && <p className="text-center text-gray-500 text-xs">You'll be asked to login before booking</p>}
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
