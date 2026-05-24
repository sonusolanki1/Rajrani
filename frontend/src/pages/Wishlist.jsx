import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowLeft, HeartOff } from 'lucide-react';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/200';
    if (img.startsWith('http')) return img;
    return `${apiUrl.replace(/\/$/, '')}/${img.replace(/^\//, '')}`;
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(items);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item._id !== id);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    setWishlist(updated);
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="min-h-screen bg-white pt-20 pb-32">
      <div className="container mx-auto px-6 lg:px-12">
        <header className="mb-20 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-4 block">Your Selection</span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase">Wishlist</h1>
        </header>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {wishlist.map((item) => (
                <motion.div 
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="group relative"
                >
                  <div className="aspect-[4/5] bg-gray-50 rounded-[2.5rem] overflow-hidden mb-6">
                    <img src={getImageUrl(item.images?.[0] || item.image)} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <button 
                      onClick={() => removeFromWishlist(item._id)}
                      className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500"
                    >
                      <HeartOff size={20} />
                    </button>
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight mb-1">{item.title}</h3>
                      <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{item.category?.name || 'Heritage'}</p>
                    </div>
                    <p className="text-xl font-black">₹{item.price}</p>
                  </div>
                  <Link to={`/product/${item._id}`} className="mt-6 w-full py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                    View Product
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-300 font-black uppercase tracking-widest mb-10">Your wishlist is empty</p>
            <Link to="/products" className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
              <ArrowLeft size={16} /> Explore Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
