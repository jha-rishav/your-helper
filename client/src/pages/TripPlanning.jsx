import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const POPULAR_TRIPS = [
  { from: 'Delhi', to: 'Manali', duration: '4 Days', price: 4999, type: 'Hill Station', icon: '🏔️', highlights: ['Rohtang Pass', 'Solang Valley', 'Old Manali'] },
  { from: 'Mumbai', to: 'Goa', duration: '3 Days', price: 3999, type: 'Beach', icon: '🏖️', highlights: ['Baga Beach', 'Dudhsagar Falls', 'Old Goa'] },
  { from: 'Bangalore', to: 'Coorg', duration: '2 Days', price: 2999, type: 'Nature', icon: '🌿', highlights: ['Abbey Falls', 'Raja\'s Seat', 'Coffee Estates'] },
  { from: 'Kolkata', to: 'Darjeeling', duration: '3 Days', price: 3499, type: 'Hill Station', icon: '🚂', highlights: ['Tiger Hill', 'Toy Train', 'Tea Gardens'] },
  { from: 'Chennai', to: 'Ooty', duration: '2 Days', price: 2499, type: 'Hill Station', icon: '🌸', highlights: ['Botanical Garden', 'Ooty Lake', 'Doddabetta Peak'] },
  { from: 'Hyderabad', to: 'Warangal', duration: '1 Day', price: 999, type: 'Heritage', icon: '🏛️', highlights: ['Warangal Fort', 'Thousand Pillar Temple', 'Ramappa Temple'] },
];

export default function TripPlanning() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    fromCity: '', toCity: '', travelDate: '',
    returnDate: '', groupSize: '', tripType: 'leisure',
    budget: '', requirements: ''
  });
  const [booking, setBooking] = useState(false);

  const ic = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm';

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setBooking(true);
    try {
      const { data: serviceData } = await API.get('/services/trip-planning');
      const { data } = await API.post('/bookings', {
        serviceId: serviceData._id,
        details: form,
        amount: 499
      });
      toast.success(`🗺️ Trip request submitted! ID: ${data.bookingId}. We'll contact you within 2 hours.`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setBooking(false); }
  };

  const fillTrip = (trip) => {
    setForm(prev => ({ ...prev, fromCity: trip.from, toCity: trip.to }));
    window.scrollTo({ top: document.getElementById('booking-form').offsetTop - 100, behavior: 'smooth' });
    toast.success(`${trip.from} → ${trip.to} selected!`);
  };

  return (
    <>
      <Helmet>
        <title>Trip Planning - Your Helper</title>
        <meta name="description" content="Plan your perfect trip — group tours, college trips, family holidays. We handle everything." />
      </Helmet>

      <div className="pt-24 section-pad">
        <div className="container-custom">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="glass px-4 py-2 rounded-full text-sm text-blue-300 font-medium inline-block mb-4">🗺️ Travel Made Easy</span>
            <h1 className="text-5xl font-black mb-4">Trip <span className="gradient-text">Planning</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              From college trips to family holidays — tell us where you want to go and we'll plan everything. Hotels, transport, itinerary & on-trip support.
            </p>
          </motion.div>

          {/* What's Included */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[
              { icon: '🏨', title: 'Hotel Booking', desc: 'Budget to luxury stays' },
              { icon: '🚌', title: 'Transport', desc: 'Bus, train or flight' },
              { icon: '📅', title: 'Itinerary', desc: 'Day-wise plan' },
              { icon: '📞', title: 'On-Trip Support', desc: '24/7 assistance' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Popular Trips */}
          <div className="mb-16">
            <h2 className="text-3xl font-black mb-8 text-center">Popular <span className="gradient-text">Destinations</span></h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {POPULAR_TRIPS.map((trip, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="glass rounded-2xl p-6 card-hover">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">{trip.icon}</span>
                    <span className="text-xs glass px-2 py-1 rounded-full text-purple-300">{trip.type}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-gray-400" />
                    <span className="font-bold">{trip.from} → {trip.to}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {trip.duration}</span>
                    <span className="text-green-400 font-bold">₹{trip.price}/person</span>
                  </div>
                  <div className="space-y-1 mb-4">
                    {trip.highlights.map((h, j) => (
                      <div key={j} className="flex items-center gap-2 text-xs text-gray-300">
                        <CheckCircle size={12} className="text-green-400" /> {h}
                      </div>
                    ))}
                  </div>
                  <button onClick={() => fillTrip(trip)}
                    className="w-full glass py-2 rounded-xl text-sm text-purple-300 hover:bg-purple-600/20 transition-all flex items-center justify-center gap-2">
                    Plan This Trip <ArrowRight size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div id="booking-form" className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-black mb-4">Plan Your <span className="gradient-text">Custom Trip</span></h2>
              <p className="text-gray-400 mb-6">Fill in your details and we'll create a personalized trip plan for you within 2 hours.</p>
              <div className="space-y-4">
                {[
                  { icon: '✅', text: 'Best price guarantee' },
                  { icon: '✅', text: 'Group discounts available' },
                  { icon: '✅', text: 'Flexible cancellation' },
                  { icon: '✅', text: 'College & corporate trips' },
                  { icon: '✅', text: '24/7 on-trip support' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                    <span>{item.icon}</span> {item.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">Book Your Trip</h3>
              <form onSubmit={handleBook} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Your Name</label>
                    <input type="text" required placeholder="Full Name" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })} className={ic} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Phone</label>
                    <input type="tel" required placeholder="Phone Number" value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })} className={ic} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Email</label>
                  <input type="email" required placeholder="Email Address" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} className={ic} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">From City</label>
                    <input type="text" required placeholder="Departure City" value={form.fromCity}
                      onChange={e => setForm({ ...form, fromCity: e.target.value })} className={ic} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">To City / Destination</label>
                    <input type="text" required placeholder="Destination" value={form.toCity}
                      onChange={e => setForm({ ...form, toCity: e.target.value })} className={ic} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Travel Date</label>
                    <input type="date" required value={form.travelDate}
                      onChange={e => setForm({ ...form, travelDate: e.target.value })} className={ic} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Return Date</label>
                    <input type="date" value={form.returnDate}
                      onChange={e => setForm({ ...form, returnDate: e.target.value })} className={ic} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Group Size</label>
                    <input type="number" required placeholder="No. of people" value={form.groupSize}
                      onChange={e => setForm({ ...form, groupSize: e.target.value })} className={ic} />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Trip Type</label>
                    <select value={form.tripType} onChange={e => setForm({ ...form, tripType: e.target.value })} className={ic + ' bg-[#0a0a0f]'}>
                      {['leisure', 'college trip', 'family', 'honeymoon', 'corporate', 'pilgrimage', 'adventure'].map(t => (
                        <option key={t} value={t} className="bg-gray-900 capitalize">{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Budget per person (₹)</label>
                  <input type="number" placeholder="e.g. 5000" value={form.budget}
                    onChange={e => setForm({ ...form, budget: e.target.value })} className={ic} />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Special Requirements</label>
                  <textarea rows={3} placeholder="Any special needs, preferences or requests..." value={form.requirements}
                    onChange={e => setForm({ ...form, requirements: e.target.value })} className={ic + ' resize-none'} />
                </div>
                <button type="submit" disabled={booking} className="btn-primary w-full">
                  {booking ? 'Submitting...' : '🗺️ Submit Trip Request (₹499 planning fee)'}
                </button>
                {!user && <p className="text-center text-gray-500 text-xs">You'll be asked to login before booking</p>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
