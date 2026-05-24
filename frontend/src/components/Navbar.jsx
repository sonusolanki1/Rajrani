import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useCartStore from '../store/useCartStore';
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiChevronDown, FiHeart } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import useSettingsStore from '../store/useSettingsStore';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsMenuDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);

  const navigate = useNavigate();
  const { cartItems } = useCartStore();
  const settings = useSettingsStore((state) => state.settings);
  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    return `${apiUrl.replace(/\/$/, '')}/${img.replace(/^\//, '')}`;
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/categories`)
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));

    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlistCount(wishlist.length);

    const handleStorage = () => {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlist.length);
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Sale', path: '/sale', color: 'text-red-500 hover:text-red-600' },
  ];

  return (
    <>
      <nav className={`fixed left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-gray-100 transition-all duration-300  top-10`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-8">
              <button onClick={() => setIsMenuOpen(true)} className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors">
                <FiMenu size={24} />
              </button>

              <Link to="/" className="flex items-center gap-3">
                <img 
                  src={settings.siteLogo ? getImageUrl(settings.siteLogo) : "/logobg.png"} 
                  alt={settings.siteName || "Logo"} 
                  style={{ height: settings.logoHeight || '80px', width: settings.logoWidth || 'auto' }} 
                  className="object-contain" 
                />
              </Link>

              <div className="hidden lg:flex items-center gap-10 ml-10">
                {/* Products Dropdown */}
                <div
                  className="relative group"
                  onMouseEnter={() => setIsMenuDropdownOpen(true)}
                  onMouseLeave={() => setIsMenuDropdownOpen(false)}
                >
                  <Link to="/products" className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-black transition-colors flex items-center gap-1">
                    Products <FiChevronDown className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </Link>

                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 pt-4 w-64"
                      >
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 overflow-hidden">
                          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Collections</p>
                          <div className="flex flex-col gap-4">
                            <Link to="/products" className="text-sm font-bold text-gray-900 hover:translate-x-2 transition-transform">All Products</Link>
                            {categories.map(cat => (
                              <Link key={cat._id} to={`/products?category=${cat.name}`} className="text-sm font-bold text-gray-500 hover:text-black hover:translate-x-2 transition-transform">{cat.name}</Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} className={`text-sm font-black uppercase tracking-widest transition-colors ${link.color || 'text-gray-500 hover:text-black'}`}>
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
              <button onClick={() => setIsSearchOpen(true)} className="p-3 hover:bg-gray-100 rounded-full transition-colors">
                <FiSearch size={22} />
              </button>
              <Link to="/wishlist" className="relative p-3 hover:bg-gray-100 rounded-full transition-colors group">
                <FiHeart size={22} />
                {wishlistCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1 right-1 bg-red-500 text-white text-[8px] font-black rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                    {wishlistCount}
                  </motion.span>
                )}
              </Link>
              <Link to="/cart" className="relative p-3 hover:bg-gray-100 rounded-full transition-colors group">
                <FiShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-1 right-1 bg-black text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {cartItemCount}
                  </motion.span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-white flex flex-col p-10 md:p-20">
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-10 right-10 p-4 hover:bg-gray-50 rounded-full transition-colors"><FiX size={40} /></button>
            <div className="max-w-4xl mx-auto w-full mt-20">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-8 block text-center">Search Store</span>
              <form onSubmit={handleSearchSubmit}>
                <input
                  autoFocus
                  type="text"
                  placeholder="Type to search..."
                  className="w-full text-5xl md:text-8xl font-black tracking-tighter border-none focus:ring-0 placeholder:text-gray-100 uppercase text-center"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <div className="mt-20">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-10 text-center">Quick Discovery</p>
                <div className="flex flex-wrap gap-6 justify-center">
                  {['HERITAGE', 'MODERN', 'WATCHES', 'NEW ARRIVALS'].map(q => (
                    <button key={q} onClick={() => { setSearchQuery(q); navigate(`/products?search=${q}`); setIsSearchOpen(false); }} className="px-10 py-4 rounded-full border border-gray-100 text-sm font-black tracking-widest hover:bg-black hover:text-white transition-all uppercase">{q}</button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMenuOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute top-0 left-0 bottom-0 w-[85%] bg-white p-10 flex flex-col">
              <div className="flex justify-between items-center mb-16">
                <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3">
                  <img 
                    src={settings.siteLogo ? getImageUrl(settings.siteLogo) : "/logobg.png"} 
                    alt={settings.siteName || "Logo"} 
                    style={{ height: settings.logoHeight || '80px', width: settings.logoWidth || 'auto' }} 
                    className="object-contain" 
                  />
                </Link>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><FiX size={24} /></button>
              </div>
              <nav className="flex flex-col gap-8">
                <Link to="/products" onClick={() => setIsMenuOpen(false)} className="text-4xl font-black tracking-tighter uppercase">Products</Link>
                {navLinks.map((link) => (
                  <Link key={link.name} to={link.path} onClick={() => setIsMenuOpen(false)} className={`text-4xl font-black tracking-tighter uppercase transition-all hover:translate-x-4 ${link.color || 'text-black'}`}>{link.name}</Link>
                ))}
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

