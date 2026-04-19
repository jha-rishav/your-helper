import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="container-custom py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🛠️</span>
            <span className="font-bold gradient-text">Your Helper</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            India's trusted platform for college, travel, events, internships and more.
          </p>
          <div className="flex gap-3">
            <a href="#" className="glass p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"><Instagram size={15} /></a>
            <a href="#" className="glass p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"><Twitter size={15} /></a>
            <a href="#" className="glass p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"><Linkedin size={15} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Services</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              ['College Services', '/college'],
              ['Train Booking', '/services/tatkal-train-booking'],
              ['Trip Planning', '/services/trip-planning'],
              ['Office Events', '/services/office-event-management'],
              ['Accommodation', '/services/accommodation-finder'],
              ['Visa Help', '/services/visa-assistance'],
            ].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              ['Home', '/'],
              ['All Services', '/services'],
              ['Track Order', '/track'],
              ['Student Forum', '/college/forum'],
              ['Contact Us', '/contact'],
              ['Login', '/login'],
            ].map(([label, to]) => (
              <li key={to}><Link to={to} className="hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3 text-sm">Contact</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li className="flex items-center gap-2"><Mail size={13} /> yourhelperclub@gmail.com</li>
            <li className="flex items-center gap-2"><Phone size={13} /> +91 7050813928</li>
            <li className="flex items-center gap-2"><MapPin size={13} /> India (Pan India Services)</li>
          </ul>
          <div className="mt-4 glass rounded-xl p-3">
            <p className="text-xs text-gray-400 mb-1">Support Hours</p>
            <p className="text-sm font-semibold text-green-400">24 × 7 — Always Available</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-gray-500 text-xs">
        © {new Date().getFullYear()} Your Helper. All rights reserved.
      </div>
    </footer>
  );
}
