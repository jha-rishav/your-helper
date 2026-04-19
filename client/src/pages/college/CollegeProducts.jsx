import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../../utils/api';

const CATEGORIES = ['all', 'stationery', 'uniform', 'books', 'electronics', 'accessories', 'other'];

export default function CollegeProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    API.get('/products').then(res => { setProducts(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = products.filter(p => {
    const matchCat = category === 'all' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    toast.success(`${product.name} added to cart!`);
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <>
      <Helmet><title>College Products - Your Helper</title></Helmet>
      <div className="pt-24 section-pad">
        <div className="container-custom">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link to="/college" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-3 transition-colors">
                <ArrowLeft size={14} /> Back to College Services
              </Link>
              <h1 className="text-4xl font-black">College <span className="gradient-text">Products</span></h1>
              <p className="text-gray-400 mt-1">Stationery, uniforms, books & more for students</p>
            </div>
            {cartCount > 0 && (
              <div className="glass rounded-2xl p-4 text-center">
                <ShoppingCart size={20} className="text-purple-400 mx-auto mb-1" />
                <p className="text-sm font-bold">{cartCount} items</p>
                <p className="text-xs text-green-400">₹{cartTotal}</p>
                <button onClick={() => toast.success('Order placed! We will contact you shortly.')}
                  className="btn-primary text-xs py-1.5 px-4 mt-2">Order Now</button>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="flex items-center gap-3 max-w-lg glass rounded-full px-4 py-3 mb-6">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="Search products..." value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm" />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${category === cat ? 'bg-purple-600 text-white' : 'glass text-gray-400 hover:text-white'}`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => <div key={i} className="glass rounded-2xl h-48 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((p, i) => (
                <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-4 card-hover">
                  <div className="text-4xl mb-3 text-center">{p.icon}</div>
                  {p.isFeatured && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">⭐ Popular</span>}
                  <h3 className="font-semibold text-sm mt-2 mb-1">{p.name}</h3>
                  <p className="text-gray-400 text-xs mb-3 leading-relaxed">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-purple-400 font-black">₹{p.price}</span>
                      {p.originalPrice && <span className="text-gray-500 text-xs line-through ml-1">₹{p.originalPrice}</span>}
                    </div>
                    <button onClick={() => addToCart(p)}
                      className="glass px-3 py-1.5 rounded-xl text-xs text-purple-300 hover:bg-purple-600/20 transition-all">
                      + Add
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-5xl mb-4">🔍</p>
              <p>No products found</p>
            </div>
          )}

          {/* Cart Summary */}
          {cart.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 mt-10">
              <h3 className="font-bold mb-4 flex items-center gap-2"><ShoppingCart size={18} /> Your Cart</h3>
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item._id} className="flex items-center justify-between text-sm">
                    <span>{item.icon} {item.name} × {item.qty}</span>
                    <span className="text-green-400 font-semibold">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <span className="font-bold">Total: <span className="gradient-text text-xl">₹{cartTotal}</span></span>
                <button onClick={() => toast.success('Order placed! We will contact you on WhatsApp shortly.')}
                  className="btn-primary text-sm py-2 px-6">Place Order</button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
