import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, User, LogOut, LayoutDashboard, Shield, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { dark, toggle } = useTheme();
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
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button onClick={() => setDropdown(!dropdown)} className="flex items-center gap-2 glass px-4 py-2 rounded-full text-sm">
                <User size={16} /> {user.name}
              </button>
              {dropdown && (
                <div className="absolute right-0 mt-2 w-48 glass rounded-xl p-2 shadow-xl">
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setDropdown(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm">
                      <Shield size={14} className="text-purple-400" /> Admin Panel
                    </Link>
                  )}
                  <Link to="/dashboard" onClick={() => setDropdown(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm">
                    <LayoutDashboard size={14} /> My Bookings
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 text-sm w-full">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/admin/login" className="flex items-center gap-1.5 glass px-4 py-2 rounded-full text-sm text-purple-300 hover:text-white hover:bg-purple-600/20 transition-all">
                <Shield size={14} /> Admin
              </Link>
              <Link to="/login" className="btn-outline text-sm py-2 px-5">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5">Sign Up</Link>
              <button onClick={toggle} className="glass p-2 rounded-full hover:bg-white/10 transition-all" title="Toggle theme">
                {dark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-purple-400" />}
              </button>
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
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary text-sm py-2 px-4 text-center">Sign Up Free</Link>
              <Link to="/login" onClick={() => setOpen(false)} className="btn-outline text-sm py-2 px-4 text-center">Customer Login</Link>
              <Link to="/admin/login" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 glass text-sm py-2 px-4 rounded-full text-purple-300">
                <Shield size={14} /> Admin Login
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 text-purple-300 text-sm">
                  <Shield size={14} /> Admin Panel
                </Link>
              )}
              <Link to="/dashboard" onClick={() => setOpen(false)} className="text-gray-300 text-sm">My Bookings</Link>
              <button onClick={handleLogout} className="text-red-400 text-sm text-left">Logout</button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
