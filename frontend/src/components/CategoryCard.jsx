import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/800x1000?text=No+Image';
    if (img.startsWith('http')) return img;
    return `${apiUrl.replace(/\/$/, '')}/${img.replace(/^\//, '')}`;
  };

  return (
    <Link to={`/products?category=${category.name}`}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="group relative h-[140px] md:h-[180px] rounded-2xl overflow-hidden bg-gray-100 shadow-sm"
      >
        <img 
          src={getImageUrl(category.image)} 
          alt={category.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
          <h3 className="text-sm md:text-lg font-black text-white uppercase tracking-wider text-center drop-shadow-md">{category.name}</h3>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
