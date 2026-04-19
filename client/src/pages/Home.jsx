import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Search, ArrowRight, Star, Users, CheckCircle, Zap, Phone, Shield } from 'lucide-react';
import API from '../utils/api';

const CATEGORIES = [
  { label: 'College', icon: '🎓', to: '/college' },
  { label: 'Train Ticket', icon: '🚂', to: '/services/tatkal-train-booking' },
  { label: 'Trip Plan', icon: '🗺️', to: '/services/trip-planning' },
  { label: 'Party & Events', icon: '🎉', to: '/services/birthday-party-planning' },
  { label: 'Office Events', icon: '🏢', to: '/services/office-event-management' },
  { label: 'PG & Hostel', icon: '🏠', to: '/services/accommodation-finder' },
  { label: 'Resume', icon: '📄', to: '/services/resume-building' },
  { label: 'Internship', icon: '💼', to: '/services/internship-placement' },
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma', role: 'College Student, Delhi', text: 'Got my bonafide certificate done in a day. Super fast and easy!', rating: 5 },
  { name: 'Priya Mehta', role: 'HR Manager, Mumbai', text: 'We use Your Helper for all our office events. Absolutely professional!', rating: 5 },
  { name: 'Amit Kumar', role: 'Job Seeker, Bangalore', text: 'Got my internship through Your Helper. The process was smooth and fast.', rating: 5 },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/services?search=${search}`);
  };

  return (
    <>
      <Helmet>
        {/* Primary SEO */}
        <title>Your Helper — College Docs, Train Tickets, Trip Planning & More | India</title>
        <meta name="description" content="Your Helper is India's trusted service platform. Get help with college documents, tatkal train tickets, trip planning, internships, resume building, office events and more. Available 24x7." />
        <meta name="keywords" content="your helper, yourhelper, college documentation help, tatkal train ticket booking, trip planning india, internship placement, resume building, office event management, pg accommodation finder, student services india, your helper club" />
        <meta name="author" content="Your Helper" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://your-helper-ten.vercel.app/" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Your Helper — College, Travel, Events & More Services" />
        <meta property="og:description" content="India's trusted platform for college documents, train tickets, trip planning, internships and more. Available 24x7." />
        <meta property="og:url" content="https://your-helper-ten.vercel.app/" />
        <meta property="og:site_name" content="Your Helper" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Your Helper — India's All-in-One Service Platform" />
        <meta name="twitter:description" content="College docs, train tickets, trip planning, internships and more. Available 24x7." />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Your Helper",
          "description": "India's trusted service platform for college students, travel booking, events, internships and more.",
          "url": "https://your-helper-ten.vercel.app",
          "telephone": "+917050813928",
          "email": "yourhelperclub@gmail.com",
          "address": { "@type": "PostalAddress", "addressCountry": "IN" },
          "openingHours": "Mo-Su 00:00-23:59",
          "priceRange": "₹",
          "sameAs": []
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="min-h-[88vh] flex items-center justify-center relative overflow-hidden pt-16">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
        </div>

        <div className="container-custom text-center relative z-10 px-4">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block glass px-4 py-1.5 rounded-full text-xs font-semibold text-purple-300 mb-5 tracking-wide">
              🇮🇳 India's All-in-One Service Platform
            </span>

            <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
              <span className="gradient-text">Your Helper</span><br />
              <span className="text-white text-3xl md:text-4xl font-bold">For Everything You Need</span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
              College documents, train tickets, trip planning, internships, events — <strong className="text-white">Your Helper</strong> gets it done for you.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-lg mx-auto glass rounded-full px-4 py-2 mb-3">
              <Search size={17} className="text-gray-400 flex-shrink-0" />
              <input type="text" placeholder="Search — college docs, train ticket, trip..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm" />
              <button type="submit" className="btn-primary text-sm py-2 px-5 flex-shrink-0">Search</button>
            </form>
            <p className="text-gray-600 text-xs mb-10">Popular: College Docs · Tatkal Ticket · Trip Planning · Resume · Internship</p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <Link to="/services" className="btn-primary flex items-center gap-2">
                Browse Services <ArrowRight size={15} />
              </Link>
              <a href="https://wa.me/917050813928?text=Hi! I need help with a service from Your Helper."
                target="_blank" rel="noopener noreferrer"
                className="btn-outline flex items-center gap-2">
                <Phone size={15} /> WhatsApp Us
              </a>
            </div>

            {/* Auth Options Row */}
            <div className="flex flex-wrap justify-center items-center gap-3 mt-2">
              <Link to="/login"
                className="flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                <Users size={14} /> Login
              </Link>
              <Link to="/register"
                className="flex items-center gap-2 glass px-5 py-2.5 rounded-full text-sm font-semibold text-purple-300 hover:text-white hover:bg-purple-600/20 transition-all border border-purple-500/30">
                ✨ Sign Up Free
              </Link>
              <Link to="/admin/login"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-gray-600 hover:text-purple-400 hover:bg-purple-600/10 transition-all border border-white/5"
                title="Admin Portal">
                <Shield size={12} /> Admin
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Category Icons */}
      <section className="py-10 border-y border-white/10">
        <div className="container-custom">
          <p className="text-center text-xs text-gray-500 mb-6 uppercase tracking-widest font-semibold">What can Your Helper do for you?</p>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={cat.to} className="flex flex-col items-center gap-2 group">
                  <div className="glass w-14 h-14 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-purple-600/20 group-hover:border-purple-500/40 transition-all">
                    {cat.icon}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white transition-colors text-center leading-tight font-medium">{cat.label}</span>
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
            <h2 className="text-3xl font-black mb-2">How <span className="gradient-text">Your Helper</span> Works</h2>
            <p className="text-gray-400 text-sm">3 simple steps — done!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: '1', icon: '🔍', title: 'Pick a Service', desc: 'Browse and choose what you need.' },
              { step: '2', icon: '📋', title: 'Share Details', desc: 'Fill a quick form — takes 2 minutes.' },
              { step: '3', icon: '✅', title: 'Your Helper Does It', desc: 'We handle everything. Track in real-time.' },
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

      {/* College Hub Highlight */}
      <section className="py-16 border-t border-white/10">
        <div className="container-custom">
          <div className="glass rounded-3xl p-8 md:p-12" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(255,101,132,0.05))' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs text-purple-300 font-bold uppercase tracking-widest">For Students</span>
                <h2 className="text-3xl font-black mt-2 mb-3">
                  <span className="gradient-text">Your Helper</span> College Hub
                </h2>
                <p className="text-gray-400 mb-5 text-sm leading-relaxed">
                  Documents, resume, internships, college products & student forum — everything a student needs, all in one place.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {['📋 Documents', '📄 Resume', '💼 Internship', '🛍️ Products', '💬 Forum', '🏛️ Govt Schemes'].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-300 font-medium">{item}</div>
                  ))}
                </div>
                <Link to="/college" className="btn-primary flex items-center gap-2 w-fit text-sm">
                  Open College Hub <ArrowRight size={14} />
                </Link>
              </div>
              <div className="text-center text-8xl hidden md:block">🎓</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 border-t border-white/10">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">What People Say About <span className="gradient-text">Your Helper</span></h2>
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
                  <p className="font-bold text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container-custom">
          <div className="glass rounded-3xl p-10 text-center" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.2), rgba(255,101,132,0.08))' }}>
            <h2 className="text-3xl font-black mb-3">
              Let <span className="gradient-text">Your Helper</span> Handle It
            </h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm">
              Join 5,000+ happy clients. Sign up free and book your first service in under 2 minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="btn-primary">Create Free Account</Link>
              <Link to="/services" className="btn-outline">Browse Services</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
