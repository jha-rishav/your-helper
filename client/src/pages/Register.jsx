import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowRight, RefreshCw } from 'lucide-react';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=form, 2=otp
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [otp, setOtp] = useState('');
  const [demoOtp, setDemoOtp] = useState('');
  const [tempToken, setTempToken] = useState('');
  const [loading, setLoading] = useState(false);

  const ic = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm';

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      // After register, send OTP to email
      const otpRes = await API.post('/auth/send-otp', { contact: form.email }, {
        headers: { Authorization: `Bearer ${data.token}` }
      });
      setDemoOtp(otpRes.data.otp);
      setTempToken(data.token);
      setStep(2);
      toast.success('Account created! Verify with OTP.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/verify-otp', { contact: form.email, otp });
      login(data.token, data.user);
      toast.success('Account verified! Welcome to Your Helper 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Helmet><title>Sign Up - Your Helper</title></Helmet>
      <div className="min-h-screen flex items-center justify-center pt-16 px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-4xl">🛠️</span>
            <h1 className="text-3xl font-black mt-3 mb-1">{step === 1 ? 'Create Account' : 'Verify OTP'}</h1>
            <p className="text-gray-400 text-sm">{step === 1 ? 'Join Your Helper for free' : `OTP sent to ${form.email}`}</p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2].map(s => (
              <div key={s} className={`flex-1 h-1.5 rounded-full transition-all ${step >= s ? 'bg-purple-600' : 'bg-white/10'}`} />
            ))}
          </div>

          {step === 1 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <input type="text" placeholder="Full Name" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={ic} />
              <input type="email" placeholder="Email Address" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={ic} />
              <input type="tel" placeholder="Phone Number (10 digits)" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className={ic} />
              <input type="password" placeholder="Password (min 6 chars)" required minLength={6} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={ic} />
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Creating Account...' : <>Continue <ArrowRight size={14} className="inline ml-1" /></>}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {demoOtp && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-center">
                  <p className="text-xs text-yellow-400">Demo Mode — Your OTP is:</p>
                  <p className="text-2xl font-black text-yellow-300 tracking-widest mt-1">{demoOtp}</p>
                </div>
              )}
              <input type="text" placeholder="Enter 6-digit OTP" required maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} className={ic + ' text-center text-xl tracking-widest'} />
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Verifying...' : 'Verify & Complete Signup'}</button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-gray-400 text-sm flex items-center justify-center gap-1">
                <RefreshCw size={12} /> Go back
              </button>
            </form>
          )}

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account? <Link to="/login" className="text-purple-400 hover:underline">Login</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
