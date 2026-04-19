import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, ArrowRight, Star, Users, CheckCircle, Zap, Phone } from 'lucide-react';
import API from '../utils/api';

const CATEGORIES = [
  { label: 'College', icon: '🎓', to: '/college' },
  { label: 'Train Booking', icon: '🚂', to: '/services/tatkal-train-booking' },
  { label: 'Trip Planning', icon: '🗺️', to: '/services/trip-planning' },
  { label: 'Flight', icon: '✈️', to: '/services/flight-booking' },
  { label: 'Events', icon: '🎉', to: '/services/birthday-party-planning' },
  { label: 'Office', icon: '🏢', to: '/services/office-event-management' },
  { label: 'Accommodation', icon: '🏠', to: '/services/accommodation-finder' },
  { label: 'Visa Help', icon: '🛂', to: '/services/visa-assistance' },
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma', role: 'College Student', text: 'Got my bonafide certificate done in a day. Super fast and easy!', rating: 5 },
  { name: 'Priya Mehta', role: 'HR Manager', text: 'We use Your Helper for all our office events. Absolutely professional!', rating: 5 },
  { name: 'Amit Kumar', role: 'Job Seeker', text: 'Got my internship through Your Helper. The process was smooth and fast.', rating: 5 },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [featuredServices, setFeaturedServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/services?featured=true').then(res => setFeaturedServices(res.data.slice(0, 6))).catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/services?search=${search}`);
  };

  return (
    <>
      <Helmet>
        <title>Your Helper — College, Travel, Events & More Services</title>
        <meta name="description" content="Your Helper — India's trusted service platform for college students, travel booking, events, internships and more." />
      </Helmet>

      {/* Hero */}
      <section className="min-h-[85vh] flex items-center justify-center relative overflow-hidden pt-16">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom text-center relative z-10 px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-purple-400 font-medium text-sm mb-3 tracking-wide uppercase">India's All-in-One Service Platform</p>
            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              We Handle It.<br />
              <span className="gradient-text">You Relax.</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-8">
              College documents, train tickets, trip planning, internships, events — tell us what you need and we'll get it done.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-lg mx-auto glass rounded-full px-4 py-2 mb-4">
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="What do you need help with?"
                value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm" />
              <button type="submit" className="btn-primary text-sm py-2 px-5 flex-shrink-0">Search</button>
            </form>

            <p className="text-gray-500 text-xs mb-10">Popular: College Docs, Tatkal Ticket, Trip Planning, Resume, Internship</p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/services" className="btn-primary flex items-center gap-2">Browse All Services <ArrowRight size={15} /></Link>
              <a href="https://wa.me/917050813928?text=Hi! I need help with a service."
                target="_blank" rel="noopener noreferrer"
                className="btn-outline flex items-center gap-2">
                <Phone size={15} /> Chat on WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Category Icons */}
      <section className="py-10 border-y border-white/10">
        <div className="container-custom">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={cat.to} className="flex flex-col items-center gap-2 group">
                  <div className="glass w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-purple-600/20 group-hover:border-purple-500/40 transition-all">
                    {cat.icon}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white transition-colors text-center leading-tight">{cat.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="container-custom grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: <Users size={20} />, value: '5,000+', label: 'Happy Clients' },
            { icon: <CheckCircle size={20} />, value: '10,000+', label: 'Tasks Done' },
            { icon: <Star size={20} />, value: '4.9/5', label: 'Rating' },
            { icon: <Zap size={20} />, value: '24/7', label: 'Support' },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-5 text-center">
              <div className="text-purple-400 flex justify-center mb-2">{s.icon}</div>
              <div className="text-2xl font-black gradient-text">{s.value}</div>
              <div className="text-gray-400 text-xs mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 border-t border-white/10">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">How It <span className="gradient-text">Works</span></h2>
            <p className="text-gray-400 text-sm">3 simple steps to get your work done</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', icon: '🔍', title: 'Choose a Service', desc: 'Browse and pick the service you need.' },
              { step: '2', icon: '📋', title: 'Fill Your Details', desc: 'Share your requirements via our simple form or WhatsApp.' },
              { step: '3', icon: '✅', title: 'We Get It Done', desc: 'Sit back and relax. Track progress in real-time.' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className="glass rounded-2xl p-6 text-center relative">
                <span className="absolute top-4 right-4 text-purple-500/20 font-black text-5xl">{item.step}</span>
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* College Services Highlight */}
      <section className="py-16 border-t border-white/10">
        <div className="container-custom">
          <div className="glass rounded-3xl p-8 md:p-12" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.05))' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs text-purple-300 font-medium uppercase tracking-wide">For Students</span>
                <h2 className="text-3xl font-black mt-2 mb-4">Complete <span className="gradient-text">College Hub</span></h2>
                <p className="text-gray-400 mb-6">Documents, resume, internships, college products & student forum — everything a student needs in one place.</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {['📋 Document Help', '📄 Resume Building', '💼 Internship Help', '🛍️ College Products', '💬 Student Forum', '🏛️ Govt Schemes'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Link to="/college" className="btn-primary flex items-center gap-2 w-fit">
                  Explore College Services <ArrowRight size={15} />
                </Link>
              </div>
              <div className="text-center text-8xl">🎓</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 border-t border-white/10">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">What Our <span className="gradient-text">Clients Say</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={13} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-black mb-3">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">Join thousands of happy clients. Book your first service today — it's quick and easy.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary">Create Free Account</Link>
            <Link to="/services" className="btn-outline">Browse Services</Link>
          </div>
        </div>
      </section>
    </>
  );
}
