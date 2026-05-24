import React, { useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PromoBanner from './components/PromoBanner';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import Contact from './pages/Contact';
import Sale from './pages/Sale';
import Wishlist from './pages/Wishlist';
import NotFound from './pages/NotFound';
import useSettingsStore from './store/useSettingsStore';

function App() {
  const setSettings = useSettingsStore((state) => state.setSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/settings`);
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings', error);
      }
    };
    fetchSettings();
  }, [setSettings]);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col pt-[130px]"> {/* Added offset for fixed nav + banner */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <PromoBanner />
          <Navbar />
        </div>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/sale" element={<Sale />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTopButton />
      </div>
    </Router>
  );
}

export default App;

