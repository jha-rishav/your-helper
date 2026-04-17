import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../../utils/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => API.get('/admin/users').then(res => { setUsers(res.data); setLoading(false); });
  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    await API.delete(`/admin/users/${id}`);
    toast.success('User deleted');
    fetchUsers();
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Manage Users - Admin</title></Helmet>
      <div className="pt-24 section-pad">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black">Manage <span className="gradient-text">Users</span></h1>
            <div className="flex items-center gap-2 glass rounded-full px-4 py-2">
              <Search size={16} className="text-gray-400" />
              <input
                type="text" placeholder="Search users..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="bg-transparent outline-none text-white placeholder-gray-500 text-sm w-48"
              />
            </div>
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />)}</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="text-left p-4">User</th>
                    <th className="text-left p-4">Phone</th>
                    <th className="text-left p-4">Joined</th>
                    <th className="text-left p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map(u => (
                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <p className="font-medium">{u.name}</p>
                        <p className="text-gray-400 text-xs">{u.email}</p>
                      </td>
                      <td className="p-4 text-gray-300">{u.phone}</td>
                      <td className="p-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <button onClick={() => handleDelete(u._id)} className="glass p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {!loading && filtered.length === 0 && <p className="text-center text-gray-500 py-12">No users found</p>}
          </div>
        </div>
      </div>
    </>
  );
}
