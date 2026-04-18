import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TrackBooking from './pages/TrackBooking';
import Contact from './pages/Contact';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading...</div>;
  return user?.role === 'admin' ? children : <Navigate to="/admin/login" />;
};

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/track" element={<TrackBooking />} />
        <Route path="/track/:bookingId" element={<TrackBooking />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
        <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsAppButton />}
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } }} />
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}
