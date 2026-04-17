import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', form);
      login(data.token, data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Sign Up - Your Helper</title></Helmet>
      <div className="min-h-screen flex items-center justify-center pt-16 px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-3xl p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <span className="text-4xl">🛠️</span>
            <h1 className="text-3xl font-black mt-3 mb-1">Create Account</h1>
            <p className="text-gray-400 text-sm">Join Your Helper for free</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text" placeholder="Full Name" required
              value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm"
            />
            <input
              type="email" placeholder="Email Address" required
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm"
            />
            <input
              type="tel" placeholder="Phone Number" required
              value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm"
            />
            <input
              type="password" placeholder="Password (min 6 chars)" required minLength={6}
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm"
            />
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account? <Link to="/login" className="text-purple-400 hover:underline">Login</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
