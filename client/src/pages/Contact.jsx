import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending
    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you within 24 hours.');
      setForm({ name: '', email: '', phone: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Your Helper</title>
        <meta name="description" content="Get in touch with Your Helper for any queries about our services." />
      </Helmet>

      <div className="pt-24 section-pad">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-4">Get In <span className="gradient-text">Touch</span></h1>
            <p className="text-gray-400">Have a question or need a custom service? We're here to help!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-2xl font-bold mb-6">Contact Info</h2>
              <div className="space-y-6">
                {[
                  { icon: <Mail size={20} />, label: 'Email', value: 'support@yourhelper.in' },
                  { icon: <Phone size={20} />, label: 'Phone / WhatsApp', value: '+91 98765 43210' },
                  { icon: <MapPin size={20} />, label: 'Location', value: 'India (Pan India Services)' },
                ].map((item, i) => (
                  <div key={i} className="glass rounded-2xl p-5 flex items-center gap-4">
                    <div className="text-purple-400">{item.icon}</div>
                    <div>
                      <p className="text-gray-400 text-xs">{item.label}</p>
                      <p className="font-semibold text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass rounded-2xl p-6 mt-6">
                <h3 className="font-bold mb-3">Business Hours</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between"><span>Monday - Saturday</span><span className="text-green-400">9 AM - 9 PM</span></div>
                  <div className="flex justify-between"><span>Sunday</span><span className="text-yellow-400">10 AM - 6 PM</span></div>
                  <div className="flex justify-between"><span>WhatsApp Support</span><span className="text-green-400">24/7</span></div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text" placeholder="Your Name" required
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                  <input
                    type="email" placeholder="Email Address" required
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                  <input
                    type="tel" placeholder="Phone Number"
                    value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm"
                  />
                  <textarea
                    placeholder="Your message or service requirement..." rows={5} required
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm resize-none"
                  />
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    <Send size={16} /> {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
