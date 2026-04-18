import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, ArrowRight, Star, Users, CheckCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import ServiceCard from '../components/ServiceCard';

const CATEGORIES = ['all', 'college', 'office', 'event', 'travel', 'internship', 'accommodation', 'other'];

const STATS = [
  { icon: <Users size={24} />, value: '5000+', label: 'Happy Clients' },
  { icon: <CheckCircle size={24} />, value: '10000+', label: 'Tasks Completed' },
  { icon: <Star size={24} />, value: '4.9/5', label: 'Average Rating' },
  { icon: <Zap size={24} />, value: '24/7', label: 'Support Available' },
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma', role: 'College Student', text: 'Your Helper made my college documentation so easy! Got everything done in a day.', rating: 5 },
  { name: 'Priya Mehta', role: 'HR Manager', text: 'We use Your Helper for all our office event management. Absolutely professional!', rating: 5 },
  { name: 'Amit Kumar', role: 'Job Seeker', text: 'Got my internship through Your Helper. The process was smooth and fast.', rating: 5 },
];

export default function Home() {
  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/services').then(res => setServices(res.data)).catch(() => {});
  }, []);

  const filtered = services.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/services?search=${search}`);
  };

  return (
    <>
      <Helmet>
        <title>Your Helper - College, Office, Event & More Services</title>
        <meta name="description" content="Your Helper provides services for college students, office professionals, events, tatkal train booking, internships, accommodation and more across India." />
        <meta name="keywords" content="your helper, college services, office services, event management, tatkal booking, internship, accommodation India" />
      </Helmet>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-500" />
        </div>

        <div className="container-custom text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="glass px-4 py-2 rounded-full text-sm text-purple-300 font-medium inline-block mb-6">
              🚀 India's All-in-One Service Platform
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              Your <span className="gradient-text">Helper</span><br />
              For Everything
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              From college documentation to office management, event planning to tatkal train booking —
              we handle it all so you can focus on what matters.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center gap-3 max-w-xl mx-auto glass rounded-full px-4 py-2 mb-8">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search for a service..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
              />
              <button type="submit" className="btn-primary text-sm py-2 px-5">Search</button>
            </form>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Link to="/services" className="btn-primary">Explore Services <ArrowRight size={16} className="inline ml-1" /></Link>
              <Link to="/register" className="btn-outline">Get Started Free</Link>
            </div>

            {/* Login Options Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {/* Customer Login */}
              <Link to="/login" className="glass rounded-2xl p-6 text-center hover:border-purple-500/50 transition-all group card-hover">
                <div className="text-4xl mb-3">👤</div>
                <h3 className="font-bold text-white mb-1">Customer Login</h3>
                <p className="text-gray-400 text-xs mb-4">Access your bookings & track services</p>
                <span className="text-xs bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full">Login →</span>
              </Link>

              {/* Sign Up */}
              <Link to="/register" className="glass rounded-2xl p-6 text-center hover:border-green-500/50 transition-all group card-hover" style={{ background: 'rgba(108,99,255,0.08)' }}>
                <div className="text-4xl mb-3">🚀</div>
                <h3 className="font-bold text-white mb-1">New User? Sign Up</h3>
                <p className="text-gray-400 text-xs mb-4">Create a free account in 30 seconds</p>
                <span className="text-xs bg-green-600/20 text-green-300 px-3 py-1 rounded-full">Register Free →</span>
              </Link>

              {/* Admin Login */}
              <Link to="/admin/login" className="glass rounded-2xl p-6 text-center hover:border-yellow-500/50 transition-all group card-hover">
                <div className="text-4xl mb-3">🛡️</div>
                <h3 className="font-bold text-white mb-1">Admin Portal</h3>
                <p className="text-gray-400 text-xs mb-4">Manage bookings, users & insights</p>
                <span className="text-xs bg-yellow-600/20 text-yellow-300 px-3 py-1 rounded-full">Admin Login →</span>
              </Link>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* Festival Offers & Promo Codes */}
      <section className="section-pad border-t border-white/10">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="glass px-4 py-2 rounded-full text-sm text-orange-300 font-medium inline-block mb-4">🎊 Limited Time Offers</span>
            <h2 className="text-4xl font-black mb-4">Festival <span className="gradient-text">Offers</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">Celebrate with exclusive discounts. Use promo codes at checkout!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { festival: '🎃 Halloween Special', discount: '20% OFF', code: 'HALLOWEEN20', desc: 'On all college & internship services', expiry: 'Oct 31, 2025', color: 'from-orange-600/20 to-yellow-600/10', border: 'border-orange-500/30' },
              { festival: '🪔 Diwali Dhamaka', discount: '30% OFF', code: 'DIWALI30', desc: 'On all bookings above ₹499', expiry: 'Nov 5, 2025', color: 'from-yellow-600/20 to-orange-600/10', border: 'border-yellow-500/30', hot: true },
              { festival: '🎄 Christmas Offer', discount: '25% OFF', code: 'XMAS25', desc: 'On event & party planning services', expiry: 'Dec 25, 2025', color: 'from-green-600/20 to-blue-600/10', border: 'border-green-500/30' },
            ].map((offer, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`glass rounded-2xl p-6 relative overflow-hidden border ${offer.border}`}
                style={{ background: `linear-gradient(135deg, ${offer.color.split(' ')[0].replace('from-', 'rgba(').replace('/20', ',0.2)')} , transparent)` }}>
                {offer.hot && <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">🔥 HOT</span>}
                <p className="text-2xl mb-2">{offer.festival}</p>
                <p className="text-3xl font-black gradient-text mb-1">{offer.discount}</p>
                <p className="text-gray-400 text-sm mb-4">{offer.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="glass px-4 py-2 rounded-xl">
                    <p className="text-xs text-gray-400 mb-0.5">Promo Code</p>
                    <p className="font-black text-purple-300 tracking-widest text-sm">{offer.code}</p>
                  </div>
                  <button onClick={() => { navigator.clipboard.writeText(offer.code); }} className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                    📋 Copy
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-3">⏰ Valid till {offer.expiry}</p>
              </motion.div>
            ))}
          </div>

          {/* Promo Code Input */}
          <div className="glass rounded-2xl p-8 max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold mb-2">Have a Promo Code?</h3>
            <p className="text-gray-400 text-sm mb-6">Enter your code while booking a service to get instant discount</p>
            <div className="flex gap-3">
              <input type="text" placeholder="Enter promo code (e.g. DIWALI30)" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm uppercase" />
              <button className="btn-primary text-sm py-3 px-6">Apply</button>
            </div>
            <p className="text-xs text-gray-500 mt-3">Promo codes are applied automatically during service booking</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-pad border-y border-white/10">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 text-center">
              <div className="text-purple-400 flex justify-center mb-3">{s.icon}</div>
              <div className="text-3xl font-black gradient-text">{s.value}</div>
              <div className="text-gray-400 text-sm mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="section-pad">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">Our <span className="gradient-text">Services</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">Everything you need, all in one place. Browse our wide range of services.</p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${activeCategory === cat ? 'bg-purple-600 text-white' : 'glass text-gray-400 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s, i) => (
                <motion.div key={s._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <ServiceCard service={s} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-5xl mb-4">🔍</p>
              <p>No services found. Check back soon!</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/services" className="btn-outline">View All Services</Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-pad border-t border-white/10">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">How It <span className="gradient-text">Works</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose a Service', desc: 'Browse our wide range of services and pick what you need.', icon: '🔍' },
              { step: '02', title: 'Book & Pay', desc: 'Fill in your details, make a secure payment via Razorpay/UPI.', icon: '💳' },
              { step: '03', title: 'Track & Relax', desc: 'Track your request in real-time. We handle everything for you.', icon: '✅' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} className="glass rounded-2xl p-8 text-center relative">
                <span className="absolute top-4 right-4 text-purple-500/30 font-black text-4xl">{item.step}</span>
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-pad border-t border-white/10">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4">What Our <span className="gradient-text">Clients Say</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-white">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-pad">
        <div className="container-custom">
          <div className="glass rounded-3xl p-12 text-center" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,101,132,0.1))' }}>
            <h2 className="text-4xl font-black mb-4">Ready to Get <span className="gradient-text">Started?</span></h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">Join thousands of happy clients. Sign up free and book your first service today.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary">Create Free Account</Link>
              <Link to="/contact" className="btn-outline">Talk to Us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
