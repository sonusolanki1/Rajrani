import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[12rem] font-black tracking-tighter leading-none text-gray-100"
        >
          404
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative -mt-20"
        >
          <h2 className="text-5xl font-black mb-6">LOST IN STYLE?</h2>
          <p className="text-gray-500 text-xl mb-12 max-w-md mx-auto">
            The collection you are looking for has been moved or no longer exists.
          </p>
          <Link to="/">
            <button className="px-12 py-5 bg-black text-white font-black rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-4 mx-auto uppercase tracking-widest text-sm shadow-2xl">
              <Home size={20} /> Back to Home
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;