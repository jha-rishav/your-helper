import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import AdminLayout from './AdminLayout';

const EMPTY_FORM = { title: '', slug: '', category: 'college', shortDesc: '', description: '', icon: '🛠️', price: 0, priceLabel: 'Starting from', features: '', tags: '', isFeatured: false };

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchServices = () => API.get('/services').then(res => setServices(res.data));
  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        features: form.features.split('\n').filter(Boolean),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        price: Number(form.price)
      };
      if (editId) {
        await API.put(`/services/${editId}`, payload);
        toast.success('Service updated!');
      } else {
        await API.post('/services', payload);
        toast.success('Service created!');
      }
      setShowForm(false); setForm(EMPTY_FORM); setEditId(null);
      fetchServices();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving service');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (s) => {
    setForm({ ...s, features: s.features?.join('\n') || '', tags: s.tags?.join(', ') || '' });
    setEditId(s._id); setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return;
    await API.delete(`/services/${id}`);
    toast.success('Service deleted');
    fetchServices();
  };

  return (
    <AdminLayout>
      <Helmet><title>Manage Services - Admin</title></Helmet>
      <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black">Manage <span className="gradient-text">Services</span></h1>
            <button onClick={() => { setShowForm(true); setForm(EMPTY_FORM); setEditId(null); }} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Add Service
            </button>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">{editId ? 'Edit Service' : 'Add New Service'}</h2>
                  <button onClick={() => setShowForm(false)}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Service Title" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 text-sm" />
                    <input placeholder="slug (e.g. college-docs)" required value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-purple-500 text-sm">
                      {['college', 'office', 'event', 'travel', 'internship', 'accommodation', 'other'].map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                    </select>
                    <input placeholder="Icon (emoji)" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 text-sm" />
                  </div>
                  <input placeholder="Short Description (shown on card)" required value={form.shortDesc} onChange={e => setForm({ ...form, shortDesc: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 text-sm" />
                  <textarea placeholder="Full Description" rows={3} required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 text-sm resize-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" placeholder="Price (0 = Free)" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 text-sm" />
                    <input placeholder="Price Label" value={form.priceLabel} onChange={e => setForm({ ...form, priceLabel: e.target.value })} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 text-sm" />
                  </div>
                  <textarea placeholder="Features (one per line)" rows={3} value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 text-sm resize-none" />
                  <input placeholder="Tags (comma separated)" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 text-sm" />
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} className="accent-purple-500" />
                    Mark as Featured
                  </label>
                  <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                    <Check size={16} /> {loading ? 'Saving...' : editId ? 'Update Service' : 'Create Service'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}

          {/* Services Table */}
          <div className="glass rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="text-left p-4">Service</th>
                  <th className="text-left p-4">Category</th>
                  <th className="text-left p-4">Price</th>
                  <th className="text-left p-4">Featured</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {services.map(s => (
                  <tr key={s._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{s.icon}</span>
                        <div>
                          <p className="font-medium">{s.title}</p>
                          <p className="text-gray-500 text-xs">{s.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 capitalize text-gray-300">{s.category}</td>
                    <td className="p-4 text-green-400">{s.price > 0 ? `₹${s.price}` : 'Free'}</td>
                    <td className="p-4">{s.isFeatured ? <span className="text-yellow-400">⭐ Yes</span> : <span className="text-gray-500">No</span>}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(s)} className="glass p-2 rounded-lg hover:bg-blue-500/20 text-blue-400 transition-colors"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(s._id)} className="glass p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {services.length === 0 && <p className="text-center text-gray-500 py-12">No services yet. Add your first service!</p>}
          </div>
      </div>
    </AdminLayout>
  );
}
