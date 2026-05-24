import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import useCartStore from '../store/useCartStore';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';
  const initialSearch = queryParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products`),
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/categories`)
        ]);
        setProducts(prodRes.data);
        setCategories(['All', ...catRes.data.map(c => c.name)]);
      } catch (error) {
        console.error('Error fetching products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Sync with URL changes
  useEffect(() => {
    setSelectedCategory(queryParams.get('category') || 'All');
    setSearchQuery(queryParams.get('search') || '');
  }, [location.search]);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category?.name === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <header className="mb-24 text-center">
          <motion.span 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-6 block"
          >
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Curated Excellence'}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-black mb-16 tracking-tighter"
          >
            {selectedCategory === 'All' ? 'PRODUCTS' : selectedCategory.toUpperCase()}<span className="text-gray-200">.</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-6"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-10 py-4 rounded-full text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-500 border ${
                  selectedCategory === cat 
                    ? 'bg-black text-white border-black shadow-2xl scale-110' 
                    : 'bg-white text-gray-400 border-gray-100 hover:border-black hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </header>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-60">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-black mb-8" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-10 gap-y-12 md:gap-y-20">
            <AnimatePresence mode='popLayout'>
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} addToCart={addToCart} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-60 bg-gray-50 rounded-[4rem]">
            <p className="text-4xl text-gray-300 font-black uppercase tracking-tighter">No pieces found.</p>
            <button onClick={() => {setSelectedCategory('All'); setSearchQuery('');}} className="mt-10 px-10 py-4 bg-black text-white rounded-full font-black text-xs uppercase tracking-widest">Reset Discovery</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
