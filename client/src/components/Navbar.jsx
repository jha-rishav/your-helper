import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, User, LogOut, LayoutDashboard, Shield, Sun, Moon, ChevronDown } from 'lucide-react';

const NAV = [
  { label: 'Home', to: '/' },
  {
    label: 'Services', to: '/services',
    children: [
      { label: '🎓 College Services', to: '/college' },
      { label: '🚂 Train Booking', to: '/services/tatkal-train-booking' },
      { label: '✈️ Flight Booking', to: '/services/flight-booking' },
      { label: '🗺️ Trip Planning', to: '/services/trip-planning' },
      { label: '🏢 Office Events', to: '/services/office-event-management' },
      { label: '🎉 Party Planning', to: '/services/birthday-party-planning' },
      { label: '🏠 Accommodation', to: '/services/accommodation-finder' },
      { label: '🛂 Visa Help', to: '/services/visa-assistance' },
    ]
  },
  { label: 'Track Order', to: '/track' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); setUserDropdown(false); };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="container-custom flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl">🛠️</span>
          <span className="font-bold text-lg gradient-text">Your Helper</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {NAV.map(item => (
            item.children ? (
              <div key={item.label} className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}>
                <button className={`flex items-center gap-1 text-sm font-medium transition-colors ${location.pathname.startsWith('/services') || location.pathname.startsWith('/college') ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                  {item.label} <ChevronDown size={14} />
                </button>
                {servicesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 glass rounded-xl p-2 shadow-2xl">
                    {item.children.map(child => (
                      <Link key={child.to} to={child.to}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm text-gray-300 hover:text-white transition-colors">
                        {child.label}
                      </Link>
                    ))}
                    <div className="border-t border-white/10 mt-1 pt-1">
                      <Link to="/services" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-600/20 text-sm text-purple-400">
                        View All Services →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.to} to={item.to}
                className={`text-sm font-medium transition-colors ${location.pathname === item.to ? 'text-purple-400' : 'text-gray-300 hover:text-white'}`}>
                {item.label}
              </Link>
            )
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Theme Toggle */}
          <button onClick={toggle} className="p-2 rounded-full hover:bg-white/10 transition-all" title="Toggle theme">
            {dark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-purple-400" />}
          </button>

          {user ? (
            <div className="relative">
              <button onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 glass px-4 py-2 rounded-full text-sm hover:bg-white/10 transition-all">
                <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                {user.name.split(' ')[0]}
                <ChevronDown size={12} />
              </button>
              {userDropdown && (
                <div className="absolute right-0 mt-2 w-48 glass rounded-xl p-2 shadow-xl">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs font-semibold">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-purple-600/20 text-sm text-purple-300">
                      <Shield size={14} /> Admin Panel
                    </Link>
                  )}
                  <Link to="/dashboard" onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm">
                    <LayoutDashboard size={14} /> My Bookings
                  </Link>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-500/20 text-red-400 text-sm w-full">
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-300 hover:text-white px-3 py-2 transition-colors">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5">Sign Up Free</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-full hover:bg-white/10">
            {dark ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-purple-400" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden glass border-t border-white/10 px-4 py-4 flex flex-col gap-1">
          <Link to="/" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10">Home</Link>
          <Link to="/services" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10">All Services</Link>
          <Link to="/college" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 pl-6">🎓 College Services</Link>
          <Link to="/services/trip-planning" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 pl-6">🗺️ Trip Planning</Link>
          <Link to="/track" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10">Track Order</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10">Contact</Link>
          <div className="border-t border-white/10 mt-2 pt-2 flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10">My Bookings</Link>
                {user.role === 'admin' && <Link to="/admin" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-lg text-sm text-purple-300 hover:bg-purple-600/20">Admin Panel</Link>}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="px-3 py-2 rounded-lg text-sm text-red-400 text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm py-2 text-center">Sign Up Free</Link>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline text-sm py-2 text-center">Login</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
