import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, User, LogOut, LayoutDashboard, Shield, Sun, Moon, ChevronDown } from 'lucide-react';

const SERVICES_MENU = [
  { label: '🎓 College', to: '/college' },
  { label: '🚂 Train Ticket', to: '/services/tatkal-train-booking' },
  { label: '🗺️ Trip Planning', to: '/services/trip-planning' },
  { label: '🏢 Office Events', to: '/services/office-event-management' },
  { label: '🎉 Party & Events', to: '/services/birthday-party-planning' },
  { label: '🏠 Accommodation', to: '/services/accommodation-finder' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDrop, setUserDrop] = useState(false);
  const [servicesDrop, setServicesDrop] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setUserDrop(false); };
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10" style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(16px)' }}>
      <div className="container-custom flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xl">🛠️</span>
          <span className="font-black text-lg gradient-text">Your Helper</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-1">
          <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/') && location.pathname === '/' ? 'text-purple-400' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
            Home
          </Link>

          {/* Services Dropdown */}
          <div className="relative" onMouseEnter={() => setServicesDrop(true)} onMouseLeave={() => setServicesDrop(false)}>
            <button className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/services') || isActive('/college') ? 'text-purple-400' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
              Services <ChevronDown size={14} className={`transition-transform ${servicesDrop ? 'rotate-180' : ''}`} />
            </button>

            {servicesDrop && (
              <div className="absolute top-full left-0 mt-1 w-64 rounded-2xl shadow-2xl overflow-hidden z-50"
                style={{ background: '#16162a', border: '1px solid rgba(108,99,255,0.3)' }}>
                <div className="p-2">
                  {SERVICES_MENU.map(item => (
                    <Link key={item.to} to={item.to}
                      onClick={() => setServicesDrop(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-200 hover:bg-purple-600/20 hover:text-white transition-all">
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-white/10 mt-1 pt-1">
                    <Link to="/services" onClick={() => setServicesDrop(false)}
                      className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold text-purple-400 hover:bg-purple-600/20 transition-all">
                      View All Services <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link to="/track" className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/track') ? 'text-purple-400' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
            Track Order
          </Link>
          <Link to="/contact" className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isActive('/contact') ? 'text-purple-400' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}>
            Contact
          </Link>
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-white/10 transition-all">
            {dark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-purple-400" />}
          </button>

          {user ? (
            <div className="relative">
              <button onClick={() => setUserDrop(!userDrop)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold hover:bg-white/10 transition-all border border-white/10">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                {user.name.split(' ')[0]}
                <ChevronDown size={12} />
              </button>
              {userDrop && (
                <div className="absolute right-0 mt-1 w-52 rounded-2xl shadow-2xl overflow-hidden z-50"
                  style={{ background: '#16162a', border: '1px solid rgba(108,99,255,0.3)' }}>
                  <div className="p-2">
                    <div className="px-4 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs font-bold">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserDrop(false)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-purple-300 hover:bg-purple-600/20 transition-all">
                        <Shield size={14} /> Admin Panel
                      </Link>
                    )}
                    <Link to="/dashboard" onClick={() => setUserDrop(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-200 hover:bg-white/10 transition-all">
                      <LayoutDashboard size={14} /> My Bookings
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all w-full">
                      <LogOut size={14} /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/10 transition-all border border-white/10">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5">Sign Up</Link>
              <Link to="/admin/login"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-purple-400 hover:bg-purple-600/10 transition-all border border-white/5"
                title="Admin Login">
                <Shield size={12} /> Admin
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-white/10">
            {dark ? <Sun size={15} className="text-yellow-400" /> : <Moon size={15} className="text-purple-400" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-white/10">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 px-4 py-3 flex flex-col gap-1"
          style={{ background: '#0d0d1a' }}>
          <Link to="/" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/10">🏠 Home</Link>
          <Link to="/services" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/10">📋 All Services</Link>
          <Link to="/college" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/10 ml-3">🎓 College</Link>
          <Link to="/services/tatkal-train-booking" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/10 ml-3">🚂 Train Ticket</Link>
          <Link to="/services/trip-planning" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/10 ml-3">🗺️ Trip Planning</Link>
          <Link to="/track" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/10">📦 Track Order</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/10">📞 Contact</Link>
          <div className="border-t border-white/10 mt-2 pt-2 flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:bg-white/10">My Bookings</Link>
                {user.role === 'admin' && <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-semibold text-purple-300 hover:bg-purple-600/20">Admin Panel</Link>}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 text-left hover:bg-red-500/10">Logout</button>
              </>
            ) : (
              <>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm py-2.5 text-center">Sign Up Free</Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline text-sm py-2.5 text-center">Login</Link>
                <Link to="/admin/login" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 border border-white/10 hover:text-purple-400">
                  <Shield size={12} /> Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
