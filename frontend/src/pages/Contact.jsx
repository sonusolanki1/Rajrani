import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-white min-h-screen pt-40 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-6 block">
              Get in touch
            </span>
            <h1 className="text-7xl font-black mb-12 tracking-tighter">LET'S START A <br /> CONVERSATION.</h1>

            <div className="space-y-12">
              <div className="flex gap-8">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email Us</h4>
                  <p className="text-2xl font-black">Rajraniposhak89@gmail.com</p>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Call Us</h4>
                  <p className="text-2xl font-black">+91 72228 22283</p>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Visit Us</h4>
                  <p className="text-2xl font-black">Bhilwara</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-black text-white rounded-[3rem] p-12 md:p-20 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

            <form className="space-y-10 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Name</label>
                  <input type="text" className="w-full bg-transparent border-b border-gray-800 py-4 focus:outline-none focus:border-white transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Email</label>
                  <input type="email" className="w-full bg-transparent border-b border-gray-800 py-4 focus:outline-none focus:border-white transition-colors" placeholder="john@example.com" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Subject</label>
                <input type="text" className="w-full bg-transparent border-b border-gray-800 py-4 focus:outline-none focus:border-white transition-colors" placeholder="How can we help?" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Message</label>
                <textarea rows="4" className="w-full bg-transparent border-b border-gray-800 py-4 focus:outline-none focus:border-white transition-colors resize-none" placeholder="Your message..."></textarea>
              </div>

              <button className="w-full py-6 bg-white text-black font-black rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-4 text-sm uppercase tracking-widest group">
                Send Message
                <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;