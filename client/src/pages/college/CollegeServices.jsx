import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, FileText, Briefcase, ShoppingBag, MessageCircle, BookOpen } from 'lucide-react';

const SUB_SERVICES = [
  {
    icon: '📋', title: 'Document Help',
    desc: 'Bonafide, NOC, migration, scholarship & govt certificates.',
    link: '/services/college-documentation',
    border: 'border-blue-500/30', badge: '₹299 onwards'
  },
  {
    icon: '📄', title: 'Resume Building',
    desc: 'ATS-friendly professional resume crafted by experts in 24 hours.',
    link: '/services/resume-building',
    border: 'border-green-500/30', badge: '₹199'
  },
  {
    icon: '💼', title: 'Internship Services',
    desc: 'Get placed in top internships — company matching, interview prep & more.',
    link: '/services/internship-placement',
    border: 'border-purple-500/30', badge: '₹499'
  },
  {
    icon: '🛍️', title: 'College Products',
    desc: 'Stationery, uniforms, books, electronics & accessories for students.',
    link: '/college/products',
    border: 'border-orange-500/30', badge: 'Shop Now'
  },
  {
    icon: '💬', title: 'Student Query Forum',
    desc: 'Ask questions, get answers from students & admin. Solve problems together.',
    link: '/college/forum',
    border: 'border-pink-500/30', badge: 'Free'
  },
];

export default function CollegeServices() {
  return (
    <>
      <Helmet>
        <title>College Student Services - Your Helper</title>
        <meta name="description" content="Complete college support hub — documents, resume, internship, products and student forum." />
      </Helmet>

      <div className="pt-24 section-pad">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="glass px-4 py-2 rounded-full text-sm text-purple-300 font-medium inline-block mb-4">🎓 Student Support Hub</span>
            <h1 className="text-5xl font-black mb-4">College <span className="gradient-text">Services</span></h1>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">Everything a college student needs — documents, internships, products & peer support. All in one place.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {SUB_SERVICES.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Link to={s.link} className={`glass rounded-2xl p-6 block card-hover border ${s.border} h-full`}>
                  <div className="text-5xl mb-4">{s.icon}</div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold">{s.title}</h3>
                    <span className="text-xs glass px-2 py-1 rounded-full text-purple-300 ml-2 whitespace-nowrap">{s.badge}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
                    Explore <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <FileText size={20} />, value: '500+', label: 'Documents Processed' },
              { icon: <BookOpen size={20} />, value: '200+', label: 'Resumes Built' },
              { icon: <Briefcase size={20} />, value: '150+', label: 'Internships Placed' },
              { icon: <MessageCircle size={20} />, value: '1000+', label: 'Queries Resolved' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-5 text-center">
                <div className="text-purple-400 flex justify-center mb-2">{s.icon}</div>
                <div className="text-2xl font-black gradient-text">{s.value}</div>
                <div className="text-gray-400 text-xs mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
