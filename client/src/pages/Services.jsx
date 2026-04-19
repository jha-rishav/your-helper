import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../utils/api';
import ServiceCard from '../components/ServiceCard';

const CATEGORIES = ['all', 'college', 'travel', 'office', 'event', 'accommodation'];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  useEffect(() => {
    API.get('/services').then(res => { setServices(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = services.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <>
      <Helmet>
        <title>All Services — Your Helper | College, Travel, Events & More</title>
        <meta name="description" content="Browse all Your Helper services — college documents, tatkal train tickets, trip planning, internships, resume building, office events, accommodation and more across India." />
        <meta name="keywords" content="your helper services, college documents, tatkal ticket, trip planning, internship, resume building, office events, pg accommodation" />
      </Helmet>

      <div className="pt-24 section-pad">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black mb-3">All <span className="gradient-text">Services</span></h1>
            <p className="text-gray-400 text-sm">Everything <strong>Your Helper</strong> offers — pick what you need</p>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 max-w-lg mx-auto glass rounded-full px-4 py-3 mb-8">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm"
            />
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

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="glass rounded-2xl h-64 animate-pulse" />)}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s, i) => (
                <motion.div key={s._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <ServiceCard service={s} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              <p className="text-5xl mb-4">🔍</p>
              <p>No services found for "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
