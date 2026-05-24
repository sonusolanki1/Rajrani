import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Star, ShieldCheck, Truck, RefreshCcw, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import useCartStore from '../store/useCartStore';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState({ name: '', phone: '' });

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/800x1000?text=No+Image';
    if (img.startsWith('http')) return img;
    return `${apiUrl.replace(/\/$/, '')}/${img.replace(/^\//, '')}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products/${id}`);
        setProduct(data);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
        
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsWishlisted(wishlist.some(item => item._id === data._id));
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let newWishlist;
    if (isWishlisted) {
      newWishlist = wishlist.filter(item => item._id !== product._id);
    } else {
      newWishlist = [...wishlist, product];
    }
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    setIsWishlisted(!isWishlisted);
  };

  const handleWhatsAppOrder = async (e) => {
    e.preventDefault();
    if (!selectedSize || !selectedColor) {
      alert('Please select size and color');
      return;
    }

    if (!buyerInfo.name || !buyerInfo.phone) {
      setShowBuyerModal(true);
      return;
    }

    try {
      // Create order entry in DB first
      const orderData = {
        customer: {
          name: buyerInfo.name,
          phone: buyerInfo.phone,
          address: 'WhatsApp Order',
          city: 'N/A',
          pincode: 'N/A'
        },
        orderItems: [{
          product: product._id,
          name: product.title,
          quantity: 1,
          price: product.price,
          image: product.images[0],
          size: selectedSize,
          color: selectedColor
        }],
        totalAmount: product.price
      };

      const { data: savedOrder } = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders`, orderData);

      const message = `*NEW ORDER - ${savedOrder.orderId}*\n\n` +
        `*Customer Detail:*\n` +
        `• Name: ${buyerInfo.name}\n` +
        `• Phone: ${buyerInfo.phone}\n\n` +
        `*Product Detail:*\n` +
        `• ${product.title}\n` +
        `• Size: ${selectedSize}\n` +
        `• Color: ${selectedColor}\n` +
        `• Price: ₹${product.price}\n\n` +
        `_Please confirm my order._`;
      
      const encodedMessage = encodeURIComponent(message);
      // Replace with your actual WhatsApp number
      window.open(`https://wa.me/917891897812?text=${encodedMessage}`, '_blank');
      setShowBuyerModal(false);
    } catch (error) {
      console.error('Order creation failed', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleZoom = (e) => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center text-2xl font-black uppercase tracking-widest">Product Not Found</div>;

  const originalPrice = product.discountPrice || product.price + 500; // Fallback
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="min-h-screen bg-white pt-10 pb-20">
      <div className="container mx-auto px-6 lg:px-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-10 hover:gap-4 transition-all">
          <ArrowLeft size={16} /> Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Image Gallery Slider */}
          <div className="lg:col-span-7">
            <div className="relative aspect-[4/5] bg-gray-50 rounded-[3rem] overflow-hidden group touch-none">
              <div className="absolute inset-0 flex items-center justify-center">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.div
                    key={activeImage}
                    initial={{ x: '100%' }}
                    animate={{ x: 0, scale: scale, x: position.x, y: position.y }}
                    exit={{ x: '-100%' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    drag={scale > 1 ? true : "x"}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={scale > 1 ? 0.2 : 1}
                    onDragEnd={(e, info) => {
                      if (scale === 1) {
                        const swipeThreshold = 50;
                        if (info.offset.x > swipeThreshold) {
                          setActiveImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1));
                        } else if (info.offset.x < -swipeThreshold) {
                          setActiveImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1));
                        }
                      }
                    }}
                    onDoubleClick={handleZoom}
                    className="absolute inset-0 w-full h-full cursor-zoom-in active:cursor-grabbing flex items-center justify-center"
                  >
                    <img
                      src={getImageUrl(product.images[activeImage])}
                      className="w-full h-full object-cover pointer-events-none"
                      alt={product.title}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {product.images.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`h-1.5 transition-all duration-500 rounded-full ${activeImage === i ? 'w-8 bg-black' : 'w-2 bg-black/20'}`}
                    />
                  ))}
                </div>
              )}

              {product.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                    className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setActiveImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              <button 
                onClick={toggleWishlist}
                className="absolute top-8 right-8 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform"
              >
                <Heart size={24} className={isWishlisted ? "fill-red-500 text-red-500" : "text-black"} />
              </button>

              {discount > 0 && (
                <div className="absolute top-8 left-8 bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {discount}% OFF
                </div>
              )}
            </div>

            <div className="flex lg:grid lg:grid-cols-4 gap-4 mt-6 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide snap-x">
              {product.images.map((img, i) => (
                <div 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`min-w-[80px] lg:min-w-0 aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all snap-start ${activeImage === i ? 'border-black' : 'border-transparent opacity-50'}`}
                >
                  <img src={getImageUrl(img)} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5 space-y-12">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4">{product.category?.name}</p>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-tight mb-6">{product.title}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-black">₹{product.price}</span>
                <span className="text-xl text-gray-400 line-through font-bold">₹{originalPrice}</span>
                <span className="text-green-600 text-sm font-black uppercase tracking-widest">{discount}% OFF</span>
              </div>
            </div>

            <p className="text-gray-500 text-lg leading-relaxed font-medium">{product.description}</p>

            {/* Size Selector */}
            {product.sizes?.length > 0 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Size</h4>
                  <button className="text-[10px] font-black uppercase underline tracking-widest">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-16 h-16 rounded-2xl border-2 font-black transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors?.length > 0 && (
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Select Color</h4>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-8 py-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${selectedColor === color ? 'border-black bg-black text-white' : 'border-gray-100 hover:border-gray-300'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => {
                  if (!selectedSize || !selectedColor) return alert('Select size and color');
                  addItem({ ...product, selectedSize, selectedColor });
                }}
                className="w-full py-4 bg-gray-100 text-black rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
              >
                <ShoppingBag size={18} /> Add to bag
              </button>
              <button 
                onClick={handleWhatsAppOrder}
                className="w-full py-4 bg-black text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:translate-y-[-4px] transition-all shadow-2xl flex items-center justify-center gap-3"
              >
                Order via WhatsApp
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-8 pt-12 border-t border-gray-100">
              <div className="text-center">
                <div className="flex justify-center mb-4 text-gray-400"><ShieldCheck size={24}/></div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-900 mb-1">Authentic</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 leading-tight">100% Original <br /> Pieces</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4 text-gray-400"><Truck size={24}/></div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-900 mb-1">Express</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 leading-tight">Secure <br /> Global Delivery</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4 text-gray-400"><RefreshCcw size={24}/></div>
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-900 mb-1">Flexible</p>
                <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 leading-tight">Easy Returns <br /> & Exchanges</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Buyer Info Modal */}
      <AnimatePresence>
        {showBuyerModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowBuyerModal(false)} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden p-10">
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Almost There</h3>
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-8">Please provide your details to proceed to WhatsApp</p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={buyerInfo.name}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, name: e.target.value })}
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="Enter WhatsApp number" 
                    value={buyerInfo.phone}
                    onChange={(e) => setBuyerInfo({ ...buyerInfo, phone: e.target.value })}
                    className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold"
                  />
                </div>
                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 mt-4"
                >
                  Continue to WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetail;


