import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const message = encodeURIComponent(`Hi! I'm ${form.name}.\n\n${form.message}\n\nEmail: ${form.email}\nPhone: ${form.phone}`);
    window.open(`https://wa.me/917050813928?text=${message}`, '_blank');
    toast.success('Redirecting to WhatsApp!');
    setForm({ name: '', email: '', phone: '', message: '' });
    setLoading(false);
  };

  const ic = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm';

  return (
    <>
      <Helmet>
        <title>Contact Us - Your Helper</title>
        <meta name="description" content="Get in touch with Your Helper for any queries about our services." />
      </Helmet>

      <div className="pt-24 section-pad">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-black mb-3">Get In <span className="gradient-text">Touch</span></h1>
            <p className="text-gray-400">Have a question or need help? We're available 24×7.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="space-y-4 mb-6">
                {[
                  { icon: <Mail size={18} />, label: 'Email', value: 'yourhelperclub@gmail.com', href: 'mailto:yourhelperclub@gmail.com' },
                  { icon: <Phone size={18} />, label: 'Phone / WhatsApp', value: '+91 7050813928', href: 'https://wa.me/917050813928' },
                  { icon: <MapPin size={18} />, label: 'Location', value: 'India — Pan India Services', href: null },
                ].map((item, i) => (
                  <div key={i} className="glass rounded-2xl p-4 flex items-center gap-4">
                    <div className="text-purple-400 flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-gray-400 text-xs">{item.label}</p>
                      {item.href
                        ? <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm hover:text-purple-400 transition-colors">{item.value}</a>
                        : <p className="font-semibold text-sm">{item.value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass rounded-2xl p-5 mb-6">
                <h3 className="font-bold mb-3 text-sm">Support Hours</h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">All Days (Mon - Sun)</span>
                  <span className="text-green-400 font-bold">24 × 7</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-400">WhatsApp Response</span>
                  <span className="text-green-400 font-bold">Within 30 mins</span>
                </div>
              </div>

              <a href="https://wa.me/917050813928?text=Hi! I need help with a service."
                target="_blank" rel="noopener noreferrer"
                className="btn-primary w-full flex items-center justify-center gap-2">
                <MessageCircle size={16} /> Chat on WhatsApp Now
              </a>
            </motion.div>

            {/* Message Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="glass rounded-2xl p-7">
                <h2 className="text-xl font-bold mb-5">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Your Name" required value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} className={ic} />
                  <input type="email" placeholder="Email Address" required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} className={ic} />
                  <input type="tel" placeholder="Phone Number" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })} className={ic} />
                  <textarea placeholder="Your message or service requirement..." rows={5} required
                    value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                    className={ic + ' resize-none'} />
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    <Send size={15} /> {loading ? 'Sending...' : 'Send via WhatsApp'}
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
