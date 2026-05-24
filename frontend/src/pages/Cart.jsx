import React from 'react';
import useCartStore from '../store/useCartStore';
import { motion, AnimatePresence } from 'framer-motion';
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCartStore();
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/800x1000?text=No+Image';
    if (img.startsWith('http')) return img;
    return `${apiUrl.replace(/\/$/, '')}/${img.replace(/^\//, '')}`;
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-4xl font-black mb-10 tracking-tighter uppercase">Your Bag</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
            <FiShoppingBag size={60} className="mx-auto text-gray-200 mb-6" />
            <p className="text-xl font-black text-gray-400 mb-8 uppercase tracking-widest">Your bag is empty.</p>
            <Link to="/products">
              <button className="px-10 py-4 bg-black text-white font-black rounded-full hover:scale-105 transition-transform uppercase tracking-widest text-xs">
                Explore Collection
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex flex-col md:flex-row gap-8 pb-8 border-b border-gray-50 group"
                  >
                    <div className="w-full md:w-48 aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow duration-500">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-black tracking-tight text-black uppercase">{item.title}</h3>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                          {item.category?.name || 'Essential'} • {item.selectedSize} • {item.selectedColor}
                        </p>
                        <p className="text-xl font-black text-black">₹{item.price}</p>
                      </div>

                      <div className="flex items-center gap-6 mt-6">
                        <div className="flex items-center bg-gray-50 rounded-full p-1 border border-gray-100">
                          <button
                            onClick={() => updateQuantity(item._id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-white rounded-full transition-colors"
                          >
                            <FiMinus size={14} />
                          </button>
                          <span className="w-12 text-center font-black text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-2 hover:bg-white rounded-full transition-colors"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-black rounded-[2rem] p-8 sticky top-32 text-white shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                
                <h2 className="text-2xl font-black mb-8 tracking-tight uppercase">Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                    <span>Subtotal</span>
                    <span className="text-white text-sm">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                    <span>Shipping</span>
                    <span className="text-white text-sm italic">Calculated at next step</span>
                  </div>
                  <div className="h-px bg-white/10 my-6" />
                  <div className="flex justify-between items-end">
                    <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Total</span>
                    <span className="text-3xl font-black">₹{totalPrice}</span>
                  </div>
                </div>
                
                <Link to="/checkout">
                  <button className="w-full py-4 bg-white text-black font-black rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-3 text-xs uppercase tracking-widest group">
                    Checkout Now
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <p className="mt-6 text-center text-gray-600 text-[8px] font-black uppercase tracking-widest">
                  Secure WhatsApp Checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;