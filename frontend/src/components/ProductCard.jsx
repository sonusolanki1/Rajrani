import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';

const ProductCard = ({ product, addToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    return wishlist.some(item => item._id === product._id);
  });

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let newWishlist;
    if (isWishlisted) {
      newWishlist = wishlist.filter(item => item._id !== product._id);
    } else {
      newWishlist = [...wishlist, product];
    }
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setIsWishlisted(!isWishlisted);
    window.dispatchEvent(new Event('storage'));
  };

  const originalPrice = product.discountPrice || product.price + 500;
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/800x1000?text=No+Image';
    if (img.startsWith('http')) return img;
    return `${apiUrl.replace(/\/$/, '')}/${img.replace(/^\//, '')}`;
  };

  const getCardImage = () => {
    if (!product.images || product.images.length === 0) return null;
    return (isHovered && product.images.length > 1) ? product.images[1] : product.images[0];
  };

  return (
    <motion.div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product._id}`}>
        <div className="aspect-[4/5] bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden relative mb-6">
          <AnimatePresence mode="wait">
            <motion.img 
              key={isHovered && product.images?.length > 1 ? 1 : 0}
              src={getImageUrl(getCardImage())} 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full object-cover" 
            />
          </AnimatePresence>

          <button 
            onClick={toggleWishlist}
            className="absolute top-6 right-6 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all opacity-0 group-hover:opacity-100"
          >
            <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : "text-black"} />
          </button>

          {discount > 0 && (
            <div className="absolute top-6 left-6 bg-black text-white px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest">
              {discount}% OFF
            </div>
          )}
          
          <div className="absolute bottom-6 left-6 right-6 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
            <button 
              onClick={(e) => { e.preventDefault(); addToCart(product); }}
              className="w-full py-4 bg-white/90 backdrop-blur-md text-black rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white"
            >
              <ShoppingBag size={14} /> Quick Add
            </button>
          </div>
        </div>

        <div className="space-y-1 px-2">
          <div className="flex justify-between items-start">
            <h3 className="text-[11px] md:text-sm font-black uppercase tracking-tight text-gray-900 leading-tight truncate pr-4">{product.title}</h3>
            <p className="text-[11px] md:text-sm font-black text-gray-900 whitespace-nowrap">₹{product.price}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category?.name || 'Heritage'}</p>
            <p className="text-[8px] md:text-[10px] font-bold text-gray-400 line-through tracking-tighter">₹{originalPrice}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
