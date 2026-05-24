import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import useCartStore from '../store/useCartStore';

const Sale = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products`);
        setProducts(data.filter(p => p.discountPrice && p.discountPrice < p.price));
      } catch (error) {
        console.error('Error fetching sale products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <header className="mb-32 relative py-40 px-12 md:px-24 rounded-[4rem] bg-black text-white flex flex-col items-center text-center overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.8em] text-red-500 mb-8 block">
              Archive Sale 2026
            </span>
            <h1 className="text-[8rem] md:text-[14rem] font-black leading-none tracking-tighter mb-12 italic">
              OFF<span className="text-red-600">ER.</span>
            </h1>
            <p className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-gray-400 max-w-2xl mx-auto leading-tight">
              Exceptional pieces. <br /> Unrepeatable prices.
            </p>
          </motion.div>
        </header>

        <div className="flex justify-between items-center mb-16 px-4">
           <h2 className="text-2xl font-black uppercase tracking-tighter">Available Pieces ({products.length})</h2>
           <div className="h-px flex-grow mx-10 bg-gray-100 hidden md:block" />
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Limited Stock Remaining</p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-40">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-24">
            <AnimatePresence mode='popLayout'>
              {products.map((product) => (
                <motion.div 
                  key={product._id} 
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative group"
                >
                   {/* Discount Tag */}
                   <div className="absolute top-8 right-8 z-20 pointer-events-none">
                      <span className="bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-full shadow-2xl scale-110">
                        -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                      </span>
                   </div>
                   <ProductCard 
                    product={product} 
                    addToCart={addToCart} 
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-60 border-2 border-dashed border-gray-100 rounded-[4rem]">
            <p className="text-3xl text-gray-200 font-black uppercase tracking-tighter">The archive is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sale;
