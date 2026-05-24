import React from 'react';
import { Shield, Truck, RefreshCcw, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const TrustBar = () => {
  const features = [
    { icon: <Truck size={32} />, title: 'EXPRESS DELIVERY', desc: 'Ships within 24 hours' },
    { icon: <Shield size={32} />, title: 'SECURE CHECKOUT', desc: 'Verified WhatsApp processing' },
    { icon: <RefreshCcw size={32} />, title: 'EASY RETURNS', desc: '7-day hassle-free policy' },
    { icon: <Headphones size={32} />, title: '24/7 SUPPORT', desc: 'Dedicated personal concierge' },
  ];

  return (
    <section className="py-24 bg-white border-y border-gray-100">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center group"
            >
              <div className="mb-6 text-gray-300 group-hover:text-black transition-colors duration-500">
                {f.icon}
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest mb-2">{f.title}</h3>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBar;