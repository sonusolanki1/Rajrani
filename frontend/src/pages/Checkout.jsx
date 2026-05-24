import React from 'react';
import useCartStore from '../store/useCartStore';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import useSettingsStore from '../store/useSettingsStore';
import axios from 'axios';

const Checkout = () => {
  const { cartItems, clearCart } = useCartStore();
  const settings = useSettingsStore((state) => state.settings);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleWhatsAppOrder = async () => {
    if (cartItems.length === 0) return alert('Your cart is empty');

    try {
      // 1. Create Order in Database
      const orderData = {
        customer: {
          name: 'WhatsApp Customer', // Default since we don't have a form yet
          phone: settings.whatsappNumber || 'N/A',
          address: 'WhatsApp Order Flow',
          city: 'Online',
          pincode: '000000'
        },
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.title,
          quantity: item.quantity,
          price: item.price,
          image: item.images?.[0] || item.image
        })),
        totalAmount: totalPrice
      };

      const { data: savedOrder } = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders`, orderData);

      // 2. Prepare WhatsApp Message with the new Order ID
      const message = `*NEW ORDER - ${savedOrder.orderId}*\n\n` +
        cartItems.map(item => `• ${item.title} (x${item.quantity}) - ₹${item.price * item.quantity}`).join('\n') +
        `\n\n*Total Amount:* ₹${totalPrice}\n\n_Please confirm my order with ID: ${savedOrder.orderId}_`;
      
      const encodedMessage = encodeURIComponent(message);
      const whatsappNumber = settings.whatsappNumber || '91XXXXXXXXXX';
      
      // 3. Redirect to WhatsApp
      window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
      
      // 4. Clear cart after successful handoff
      clearCart();
    } catch (error) {
      console.error('Order handoff failed', error);
      alert('Could not process order. Please try again.');
    }
  };

  return (
    <div className="bg-white min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link to="/cart" className="inline-flex items-center gap-2 text-gray-400 font-black uppercase tracking-[0.2em] text-xs mb-12 hover:text-black transition-colors group">
          <FiArrowLeft className="group-hover:-translate-x-2 transition-transform" /> Back to Bag
        </Link>
        
        <h1 className="text-6xl font-black mb-16 tracking-tighter">FINAL STEP</h1>

        <div className="bg-gray-50 rounded-[3rem] p-12 md:p-20 border border-gray-100">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white mb-8 shadow-2xl">
              <FiCheckCircle size={48} />
            </div>
            <h2 className="text-4xl font-black mb-6">READY TO ORDER?</h2>
            <p className="text-gray-500 text-lg max-w-md leading-relaxed">
              We process all orders manually through WhatsApp to ensure the most personalized service and secure payment handling.
            </p>
          </div>

          <div className="space-y-6 mb-16">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8 border-b border-gray-200 pb-4">Order Review</h3>
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center py-2">
                <div>
                  <p className="font-black text-black">{item.title}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</p>
                </div>
                <p className="font-black">₹{item.price * item.quantity}</p>
              </div>
            ))}
            <div className="pt-8 mt-8 border-t-2 border-black flex justify-between items-end">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">Total Payable</span>
              <span className="text-5xl font-black">₹{totalPrice}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWhatsAppOrder}
            className="w-full py-8 bg-[#25D366] text-white font-black rounded-full shadow-2xl hover:shadow-[#25D366]/40 transition-all text-xl flex items-center justify-center gap-4 uppercase tracking-[0.1em]"
          >
            Order via WhatsApp
          </motion.button>
          
          <p className="mt-10 text-center text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
            By clicking above, you'll be redirected to WhatsApp <br /> with your order details pre-filled.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
