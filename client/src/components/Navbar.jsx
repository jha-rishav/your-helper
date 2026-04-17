import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'Track Booking', to: '/track' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="container-custom flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🛠️</span>
          <span className="font-bold text-xl gradient-text">Your Helper</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button onClick={() => setDropdown(!dropdown)} className="flex items-center gap-2 glass px-4 py-2 rounded-full text-sm">
                <User size={16} /> {user.name}
              </button>
              {dropdown && (
                <div className="absolute right-0 mt-2 w-48 glass rounded-xl p-2 shadow-xl">
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setDropdown(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm">
                      <LayoutDashboard size={14} /> Admin Panel
                    </Link>
                  )}
                  <Link to="/dashboard" onClick={() => setDropdown(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm">
                    <User size={14} /> My Bookings
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 text-sm w-full">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-outline text-sm py-2 px-5">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-gray-300 hover:text-white text-sm">
              {l.label}
            </Link>
          ))}
          {!user ? (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setOpen(false)} className="btn-outline text-sm py-2 px-4">Login</Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-sm py-2 px-4">Sign Up</Link>
            </div>
          ) : (
            <button onClick={handleLogout} className="text-red-400 text-sm text-left">Logout</button>
          )}
        </div>
      )}
    </nav>
  );
}
