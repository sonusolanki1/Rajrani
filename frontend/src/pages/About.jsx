import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Vision Section */}
      <section className="container mx-auto px-6 lg:px-12 py-32 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-5xl"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 mb-8 block">
            Our Legacy
          </span>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mb-20">
            WE BELIEVE IN <br /> <span className="text-gray-300 italic">PERFECTION.</span>
          </h1>
          <p className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900 mb-20">
            Our brand is more than just a name. It is a commitment to timeless elegance, exceptional craftsmanship, and the art of fine living.
          </p>
        </motion.div>
      </section>

      {/* Image Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 h-[80vh] mb-40">
        <div className="overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2s]" 
            alt="Craftsmanship"
          />
        </div>
        <div className="overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200&q=80" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-[2s]" 
            alt="Store"
          />
        </div>
      </section>

      {/* Philosophy */}
      <section className="container mx-auto px-6 lg:px-12 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div>
            <h3 className="text-2xl font-black mb-6">CRAFTSMANSHIP</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              Every piece in our collection is meticulously crafted by master artisans who have dedicated their lives to their trade. We use only the finest materials sourced responsibly from around the globe.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-black mb-6">SUSTAINABILITY</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              We believe luxury shouldn't come at the cost of the planet. Our production processes are designed to minimize waste and support fair labor practices in every community we touch.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-black mb-6">INNOVATION</h3>
            <p className="text-gray-500 leading-relaxed font-medium">
              While we honor tradition, we never stop looking forward. By integrating modern technology into classic designs, we create products that are both nostalgic and revolutionary.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;