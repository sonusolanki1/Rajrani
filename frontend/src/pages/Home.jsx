import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import TrustBar from '../components/TrustBar';
import useCartStore from '../store/useCartStore';
import { Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const addToCart = useCartStore((state) => state.addToCart);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/800x1000?text=No+Image';
    if (img.startsWith('http')) return img;
    return `${apiUrl.replace(/\/$/, '')}/${img.replace(/^\//, '')}`;
  };

  const heroSlides = [
    {
      title: "BEYOND STYLE.",
      subtitle: "Spring Collection 2026",
      desc: "Curated premium essentials for the modern lifestyle. Quality that speaks for itself.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
    },
    {
      title: "PURE HERITAGE.",
      subtitle: "Handcrafted Luxury",
      desc: "Experience the timeless elegance of premium craftsmanship in every stitch.",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1600&q=80"
    },
    {
      title: "MODERN ESSENCE.",
      subtitle: "The New Standard",
      desc: "Redefining everyday wear with a touch of royal sophistication.",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, testRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/categories`),
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products`), // Removed ?isFeatured=true
          axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/testimonials`)
        ]);

        setCategories(catRes.data);
        // Show up to 8 products on the home page (preferably the newest or featured if available)
        const displayProducts = prodRes.data.filter(p => p.isFeatured).length > 0
          ? prodRes.data.filter(p => p.isFeatured)
          : prodRes.data;

        setFeaturedProducts(displayProducts.slice(0, 8));
        setTestimonials(testRes.data.slice(0, 3));

      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Slider */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-black">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={heroSlides[activeSlide].image}
              alt="Hero"
              className="w-full h-full object-cover scale-105"
            />
          </motion.div>
        </AnimatePresence>

        <div className="container mx-auto px-6 relative z-20">
          <motion.div
            key={activeSlide + "-content"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="max-w-3xl text-white"
          >
            <span className="text-white/80 font-black uppercase tracking-[0.4em] text-[10px] mb-6 block">
              {heroSlides[activeSlide].subtitle}
            </span>
            <h1 className="text-6xl md:text-9xl font-black leading-none mb-8 tracking-tighter uppercase">
              {heroSlides[activeSlide].title.split('.')[0]} <br />
              <span className="text-white/40 italic">{heroSlides[activeSlide].title.split('.')[1] || ''}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-12 max-w-lg leading-relaxed font-medium">
              {heroSlides[activeSlide].desc}
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/products">
                <button className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-2xl">
                  Explore Catalog
                </button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Slider Nav */}
        <div className="absolute bottom-10 right-10 z-20 flex gap-4">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSlide(i)}
              className={`h-1 transition-all duration-500 ${activeSlide === i ? 'w-12 bg-white' : 'w-6 bg-white/30'}`}
            />
          ))}
        </div>
      </section>

      {/* Categories Slider UI (Horizontal on Mobile) */}
      <section className="pt-24 pb-10 container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black tracking-tighter mb-2 text-black uppercase leading-none">Collections</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Curated by Our Experts</p>
          </div>
          <Link to="/products" className="text-black font-black tracking-widest text-[9px] uppercase border-b-2 border-black pb-1">All Pieces</Link>
        </div>

        <div className="flex overflow-x-auto gap-3 md:gap-4 pb-10 scrollbar-hide snap-x">
          {categories.map((category) => (
            <div key={category._id} className="min-w-[120px] md:min-w-[160px] snap-start">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="pb-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center mb-20 text-center">
            <span className="text-[10px] font-black tracking-[0.5em] text-gray-400 uppercase mb-4">The Selection</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-black uppercase">Most Wanted</h2>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} addToCart={addToCart} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Awaiting new arrivals...</p>
            </div>
          )}

          <div className="mt-20 text-center">
            <Link to="/products">
              <button className="px-12 py-5 border-2 border-black text-black font-black hover:bg-black hover:text-white transition-all rounded-full tracking-[0.2em] text-[10px] uppercase">
                View Entire Archive
              </button>
            </Link>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-32 bg-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              {testimonials.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative p-10 bg-gray-50 rounded-[2.5rem]"
                >
                  <Quote className="text-black/5 absolute top-10 right-10" size={100} />
                  <div className="relative z-10">
                    <p className="text-lg font-bold leading-relaxed mb-8 text-gray-800 italic">
                      "{t.content}"
                    </p>
                    <div className="flex items-center gap-5">
                      <img src={getImageUrl(t.image)} alt={t.name} className="w-14 h-14 rounded-2xl object-cover grayscale" />
                      <div>
                        <h4 className="font-black text-black uppercase tracking-widest text-xs">{t.name}</h4>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-32 container mx-auto px-6">
        <div className="bg-black rounded-[3.5rem] p-12 md:p-24 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

          <h2 className="text-4xl md:text-7xl font-black text-white mb-6 relative z-10 leading-none uppercase tracking-tighter">
            JOIN THE <br /> <span className="text-white/20 italic">INNER CIRCLE</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-lg max-w-xl mb-12 relative z-10 leading-relaxed font-bold uppercase tracking-widest">
            Exclusive access to our archives.
          </p>
          <div className="flex flex-col md:flex-row w-full max-w-md relative z-10 gap-3">
            <input
              type="email"
              placeholder="Email address"
              className="flex-grow bg-white/10 border border-white/10 text-white px-8 py-5 rounded-3xl focus:outline-none focus:bg-white/20 transition-all text-sm font-black uppercase tracking-widest"
            />
            <button className="bg-white text-black px-10 py-5 rounded-3xl font-black text-[10px] tracking-widest uppercase hover:bg-gray-200 transition-colors">
              Access
            </button>
          </div>
        </div>
      </section>

      <style jsx="true">{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;

