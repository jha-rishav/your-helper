import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Phone, Lock, ArrowRight, RefreshCw } from 'lucide-react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('password'); // 'password' | 'otp'
  const [otpStep, setOtpStep] = useState(1); // 1=enter contact, 2=enter otp
  const [form, setForm] = useState({ email: '', password: '' });
  const [contact, setContact] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const ic = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm';

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', form);
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/send-otp', { contact });
      setDemoOtp(data.otp); // demo only
      setOtpStep(2);
      toast.success('OTP sent! Check console (demo mode)');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP. Make sure you have an account.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/verify-otp', { contact, otp });
      login(data.token, data.user);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Login - Your Helper</title></Helmet>
      <div className="min-h-screen flex items-center justify-center pt-16 px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-4xl">🛠️</span>
            <h1 className="text-3xl font-black mt-3 mb-1">Welcome Back</h1>
            <p className="text-gray-400 text-sm">Login to your Your Helper account</p>
          </div>

          {/* Mode Toggle */}
          <div className="flex glass rounded-xl p-1 mb-6">
            <button onClick={() => { setMode('password'); setOtpStep(1); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'password' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>
              <Lock size={14} className="inline mr-1" /> Password
            </button>
            <button onClick={() => { setMode('otp'); setOtpStep(1); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'otp' ? 'bg-purple-600 text-white' : 'text-gray-400'}`}>
              <Phone size={14} className="inline mr-1" /> OTP Login
            </button>
          </div>

          {/* Password Login */}
          {mode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={ic} />
              <input type="password" placeholder="Password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={ic} />
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Logging in...' : 'Login'}</button>
            </form>
          )}

          {/* OTP Login */}
          {mode === 'otp' && (
            <>
              {otpStep === 1 && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Email or Phone Number</label>
                    <input type="text" placeholder="Enter email or 10-digit phone" required value={contact} onChange={e => setContact(e.target.value)} className={ic} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    {loading ? 'Sending...' : 'Send OTP'} <ArrowRight size={14} className="inline ml-1" />
                  </button>
                </form>
              )}
              {otpStep === 2 && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-sm text-gray-400 text-center">OTP sent to <span className="text-white font-medium">{contact}</span></p>
                  {demoOtp && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-center">
                      <p className="text-xs text-yellow-400">Demo Mode — Your OTP is:</p>
                      <p className="text-2xl font-black text-yellow-300 tracking-widest mt-1">{demoOtp}</p>
                    </div>
                  )}
                  <input type="text" placeholder="Enter 6-digit OTP" required maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className={ic + ' text-center text-xl tracking-widest'} />
                  <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Verifying...' : 'Verify OTP & Login'}</button>
                  <button type="button" onClick={() => setOtpStep(1)} className="w-full text-gray-400 text-sm flex items-center justify-center gap-1">
                    <RefreshCw size={12} /> Change contact
                  </button>
                </form>
              )}
            </>
          )}

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account? <Link to="/register" className="text-purple-400 hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
