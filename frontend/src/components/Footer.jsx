import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from 'react-icons/fi';
import axios from 'axios';

import useSettingsStore from '../store/useSettingsStore';

const Footer = () => {
  const settings = useSettingsStore((state) => state.settings);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    return `${apiUrl.replace(/\/$/, '')}/${img.replace(/^\//, '')}`;
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/subscribers`, { email });
      setStatus({ type: 'success', message: data.message });
      setEmail('');
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.message || 'Subscription failed' 
      });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    }
  };

  return (
    <footer className="bg-black text-white pt-32 pb-12">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
          {/* Brand Section */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-10">
              <img 
                src={settings.siteLogo ? getImageUrl(settings.siteLogo) : "/logobg.png"} 
                alt={settings.siteName || "Logo"} 
                style={{ height: settings.logoHeight || '80px', width: settings.logoWidth || 'auto' }} 
                className="object-contain" 
              />
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed mb-10">
              Defining the future of luxury essentials. Crafted with precision, delivered with passion.
            </p>
            <div className="flex gap-6">
              <FiInstagram size={20} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
              <FiTwitter size={20} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
              <FiFacebook size={20} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
              <FiYoutube size={20} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-10">Collections</h4>
            <ul className="space-y-6">
              {['New Arrivals', 'Best Sellers', 'Sale', 'Accessories'].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-lg font-bold hover:text-gray-400 transition-colors flex items-center gap-2 group">
                    {item}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-10">Support</h4>
            <ul className="space-y-6">
              {['Shipping Policy', 'Returns & Exchanges', 'Contact Us', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <Link to="/" className="text-lg font-bold hover:text-gray-400 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-10">Newsletter</h4>
            <p className="text-gray-500 mb-8 font-medium">Join our mailing list for exclusive updates.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-gray-800 py-4 focus:outline-none focus:border-white transition-colors"
                required
              />
              <button 
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-widest hover:text-gray-400 transition-colors"
              >
                Subscribe
              </button>
            </form>
            {status.message && (
              <p className={`text-[10px] font-black uppercase tracking-widest mt-4 ${status.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {status.message}
              </p>
            )}
          </div>
        </div>

        <div className="pt-12 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">
            © 2026 LUXURY LTD. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-10">
            <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Terms</span>
            <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Privacy</span>
            <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest cursor-pointer hover:text-white transition-colors">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
