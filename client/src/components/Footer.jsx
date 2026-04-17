import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-20">
      <div className="container-custom py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🛠️</span>
            <span className="font-bold text-xl gradient-text">Your Helper</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your one-stop solution for college, office, events, travel, internships, accommodation and more.
          </p>
          <div className="flex gap-3 mt-4">
            <a href="#" className="glass p-2 rounded-lg hover:bg-white/10 transition-colors"><Instagram size={16} /></a>
            <a href="#" className="glass p-2 rounded-lg hover:bg-white/10 transition-colors"><Twitter size={16} /></a>
            <a href="#" className="glass p-2 rounded-lg hover:bg-white/10 transition-colors"><Linkedin size={16} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white">Services</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {['College Services', 'Office Services', 'Event Management', 'Tatkal Booking', 'Internships', 'Accommodation'].map(s => (
              <li key={s}><Link to="/services" className="hover:text-white transition-colors">{s}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {[['Home', '/'], ['About', '/about'], ['Track Booking', '/track'], ['Contact', '/contact'], ['Login', '/login']].map(([l, t]) => (
              <li key={t}><Link to={t} className="hover:text-white transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white">Contact</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2"><Mail size={14} /> support@yourhelper.in</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Your Helper. All rights reserved.
      </div>
    </footer>
  );
}
