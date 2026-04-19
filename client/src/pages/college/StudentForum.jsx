import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MessageCircle, CheckCircle, Eye, ArrowLeft, Send, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CATEGORIES = ['all', 'documents', 'internship', 'academics', 'hostel', 'fees', 'placement', 'general'];

const CAT_COLORS = {
  documents: 'bg-blue-500/20 text-blue-300',
  internship: 'bg-purple-500/20 text-purple-300',
  academics: 'bg-green-500/20 text-green-300',
  hostel: 'bg-orange-500/20 text-orange-300',
  fees: 'bg-red-500/20 text-red-300',
  placement: 'bg-yellow-500/20 text-yellow-300',
  general: 'bg-gray-500/20 text-gray-300',
};

export default function StudentForum() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newQuery, setNewQuery] = useState({ title: '', content: '', category: 'general', tags: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchQueries = () => {
    const params = {};
    if (category !== 'all') params.category = category;
    if (search) params.search = search;
    API.get('/queries', { params }).then(res => { setQueries(res.data); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchQueries(); }, [category, search]);

  const handleSelectQuery = async (q) => {
    const { data } = await API.get(`/queries/${q._id}`);
    setSelected(data);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!reply.trim()) return;
    try {
      const { data } = await API.post(`/queries/${selected._id}/reply`, { content: reply });
      setSelected(data);
      setReply('');
      toast.success('Reply posted!');
      fetchQueries();
    } catch { toast.error('Failed to post reply'); }
  };

  const handleSubmitQuery = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      await API.post('/queries', {
        ...newQuery,
        tags: newQuery.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      toast.success('Query posted successfully!');
      setShowForm(false);
      setNewQuery({ title: '', content: '', category: 'general', tags: '' });
      fetchQueries();
    } catch { toast.error('Failed to post query'); }
    finally { setSubmitting(false); }
  };

  const handleResolve = async (id) => {
    await API.put(`/queries/${id}/resolve`);
    toast.success('Marked as resolved!');
    setSelected(prev => ({ ...prev, isResolved: true }));
    fetchQueries();
  };

  const ic = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 transition-colors text-sm';

  return (
    <>
      <Helmet><title>Student Query Forum - Your Helper</title></Helmet>
      <div className="pt-24 section-pad">
        <div className="container-custom">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link to="/college" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-3 transition-colors">
                <ArrowLeft size={14} /> Back to College Services
              </Link>
              <h1 className="text-4xl font-black">Student <span className="gradient-text">Forum</span></h1>
              <p className="text-gray-400 mt-1">Ask questions, get answers from students & admin</p>
            </div>
            <button onClick={() => user ? setShowForm(true) : navigate('/login')}
              className="btn-primary flex items-center gap-2 text-sm">
              <Plus size={16} /> Ask a Question
            </button>
          </div>

          {/* Ask Question Modal */}
          <AnimatePresence>
            {showForm && (
              <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="glass rounded-2xl p-8 w-full max-w-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Ask a Question</h2>
                    <button onClick={() => setShowForm(false)}><X size={20} /></button>
                  </div>
                  <form onSubmit={handleSubmitQuery} className="space-y-4">
                    <input placeholder="Question title (be specific)" required value={newQuery.title}
                      onChange={e => setNewQuery({ ...newQuery, title: e.target.value })} className={ic} />
                    <textarea placeholder="Describe your problem in detail..." rows={4} required value={newQuery.content}
                      onChange={e => setNewQuery({ ...newQuery, content: e.target.value })} className={ic + ' resize-none'} />
                    <select value={newQuery.category} onChange={e => setNewQuery({ ...newQuery, category: e.target.value })}
                      className={ic + ' bg-[#0a0a0f]'}>
                      {CATEGORIES.filter(c => c !== 'all').map(c => (
                        <option key={c} value={c} className="bg-gray-900 capitalize">{c}</option>
                      ))}
                    </select>
                    <input placeholder="Tags (comma separated, e.g. bonafide, fees)" value={newQuery.tags}
                      onChange={e => setNewQuery({ ...newQuery, tags: e.target.value })} className={ic} />
                    <button type="submit" disabled={submitting} className="btn-primary w-full">
                      {submitting ? 'Posting...' : 'Post Question'}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left — Query List */}
            <div className="lg:col-span-1 space-y-4">
              {/* Search */}
              <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
                <Search size={14} className="text-gray-400" />
                <input type="text" placeholder="Search queries..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-xs" />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${category === cat ? 'bg-purple-600 text-white' : 'glass text-gray-400 hover:text-white'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Queries */}
              {loading ? (
                [...Array(4)].map((_, i) => <div key={i} className="glass rounded-xl h-20 animate-pulse" />)
              ) : queries.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">No queries yet. Be the first to ask!</div>
              ) : (
                queries.map((q, i) => (
                  <motion.div key={q._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    onClick={() => handleSelectQuery(q)}
                    className={`glass rounded-xl p-4 cursor-pointer transition-all hover:border-purple-500/50 ${selected?._id === q._id ? 'border-purple-500' : ''}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="text-sm font-medium leading-tight line-clamp-2">{q.title}</p>
                      {q.isResolved && <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${CAT_COLORS[q.category]}`}>{q.category}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1"><MessageCircle size={10} /> {q.replies?.length || 0}</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1"><Eye size={10} /> {q.views}</span>
                      <span className="text-xs text-gray-600">{q.user?.name}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Right — Query Detail */}
            <div className="lg:col-span-2">
              {selected ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-2xl p-6">
                  {/* Question */}
                  <div className="mb-6">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2 className="text-xl font-bold">{selected.title}</h2>
                      {selected.isResolved
                        ? <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-3 py-1 rounded-full whitespace-nowrap"><CheckCircle size={12} /> Resolved</span>
                        : (user?.role === 'admin' || user?._id === selected.user?._id) && (
                          <button onClick={() => handleResolve(selected._id)}
                            className="text-xs glass px-3 py-1 rounded-full text-gray-400 hover:text-green-400 transition-colors whitespace-nowrap">
                            Mark Resolved
                          </button>
                        )
                      }
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${CAT_COLORS[selected.category]}`}>{selected.category}</span>
                      <span className="text-xs text-gray-500">by {selected.user?.name}</span>
                      <span className="text-xs text-gray-500">{new Date(selected.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{selected.content}</p>
                    {selected.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selected.tags.map(t => <span key={t} className="text-xs glass px-2 py-0.5 rounded-full text-gray-400">#{t}</span>)}
                      </div>
                    )}
                  </div>

                  {/* Replies */}
                  <div className="border-t border-white/10 pt-6 mb-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <MessageCircle size={16} className="text-purple-400" />
                      {selected.replies?.length || 0} Replies
                    </h3>
                    {selected.replies?.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-6">No replies yet. Be the first to help!</p>
                    ) : (
                      <div className="space-y-4">
                        {selected.replies.map((r, i) => (
                          <div key={i} className={`glass rounded-xl p-4 ${r.isAdmin ? 'border-purple-500/40' : ''}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-7 h-7 rounded-full bg-purple-600/30 flex items-center justify-center text-xs font-bold">
                                {r.user?.name?.[0]?.toUpperCase()}
                              </div>
                              <span className="text-sm font-medium">{r.user?.name}</span>
                              {r.isAdmin && <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">Admin</span>}
                              <span className="text-xs text-gray-500 ml-auto">{new Date(r.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{r.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reply Form */}
                  {user ? (
                    <form onSubmit={handleReply} className="flex gap-3">
                      <input type="text" placeholder="Write your reply..." value={reply}
                        onChange={e => setReply(e.target.value)} required
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 text-sm" />
                      <button type="submit" className="btn-primary flex items-center gap-2 text-sm py-3 px-5">
                        <Send size={14} /> Reply
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-4 glass rounded-xl">
                      <p className="text-gray-400 text-sm mb-3">Login to reply to this query</p>
                      <Link to="/login" className="btn-primary text-sm py-2 px-6">Login</Link>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="glass rounded-2xl p-12 text-center text-gray-500">
                  <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">Select a question</p>
                  <p className="text-sm">Click any question from the list to view details and replies</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
