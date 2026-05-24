import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Grid, DollarSign, Plus, Trash2, Edit2, Upload, X, Settings as SettingsIcon, Menu, LogOut, MessageSquare, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCropper from '../components/ImageCropper';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState({
    siteName: '',
    siteLogo: '',
    logoHeight: '40px',
    logoWidth: 'auto',
    contactEmail: '',
    contactPhone: '',
    address: '',
    whatsappNumber: '',
    socialLinks: { instagram: '', twitter: '', facebook: '', youtube: '' }
  });
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/400?text=No+Image';
    const cleanPath = img.toString().startsWith('/') ? img : `/${img}`;
    return `${apiUrl.replace(/\/$/, '')}${cleanPath}`;
  };

  // Cropping States
  const [cropData, setCropData] = useState({ show: false, image: null, target: null, aspect: 1 });

  // Form States
  const [productForm, setProductForm] = useState({
    title: '', description: '', price: '', discountPrice: '',
    category: '', stock: '', isFeatured: false, images: [],
    sizes: [], colors: []
  });
  const [categoryForm, setCategoryForm] = useState({ name: '', image: '' });
  const [testimonialForm, setTestimonialForm] = useState({ name: '', role: '', content: '', image: '', rating: 5 });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Auto-fetch every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, cRes, sRes, tRes, subRes, oRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products`),
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/categories`),
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/settings`),
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/testimonials`),
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/subscribers`),
        axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders`)
      ]);
      setProducts(pRes.data);
      setCategories(cRes.data);
      setSettings(sRes.data);
      setTestimonials(tRes.data);
      setSubscribers(subRes.data);
      setOrders(oRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e, target) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropData({
        show: true,
        image: reader.result,
        target: target,
        aspect: target === 'product' || target === 'category' ? 4 / 5 : 1
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = async (croppedBlob) => {
    const { target } = cropData;
    const data = new FormData();
    data.append('image', croppedBlob, 'cropped-image.jpg');

    setIsUploading(true);
    setCropData({ show: false, image: null, target: null, aspect: 1 });

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/upload`, data);
      const relativePath = res.data.url; // This is /uploads/filename.jpg from backend
      
      if (target === 'product') {
        setProductForm(prev => ({ ...prev, images: [...prev.images, relativePath] }));
      } else if (target === 'category') {
        setCategoryForm(prev => ({ ...prev, image: relativePath }));
      } else if (target === 'settings') {
        setSettings(prev => ({ ...prev, siteLogo: relativePath }));
      } else if (target === 'testimonial') {
        setTestimonialForm(prev => ({ ...prev, image: relativePath }));
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async (path, target, index = null) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/upload`, { data: { path } });
      if (target === 'product' && index !== null) {
        setProductForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== index) }));
      } else if (target === 'category') {
        setCategoryForm(prev => ({ ...prev, image: '' }));
      } else if (target === 'settings') {
        setSettings(prev => ({ ...prev, siteLogo: '' }));
      } else if (target === 'testimonial') {
        setTestimonialForm(prev => ({ ...prev, image: '' }));
      }
    } catch (err) {
      console.error('Failed to delete image', err);
      // Even if delete fails on server, remove from UI for better UX
      if (target === 'product' && index !== null) {
        setProductForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== index) }));
      }
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders/${id}`, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'products') {
        if (editingItem) await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products/${editingItem._id}`, productForm);
        else await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products`, productForm);
      } else if (activeTab === 'categories') {
        if (editingItem) await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/categories/${editingItem._id}`, categoryForm);
        else await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/categories`, categoryForm);
      } else if (activeTab === 'testimonials') {
        if (editingItem) await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/testimonials/${editingItem._id}`, testimonialForm);
        else await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/testimonials`, testimonialForm);
      }
      closeModal();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id, type) => {
    if (window.confirm(`Delete this ${type}?`)) {
      await axios.delete(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/${type === 'testimonial' ? 'testimonials' : type === 'subscriber' ? 'subscribers' : type === 'order' ? 'orders' : type + 's'}/${id}`);
      fetchData();
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setProductForm({ title: '', description: '', price: '', discountPrice: '', category: '', stock: '', isFeatured: false, images: [], sizes: [], colors: [] });
    setCategoryForm({ name: '', image: '' });
    setTestimonialForm({ name: '', role: '', content: '', image: '', rating: 5 });
  };

  const menuItems = [
    { id: 'products', label: 'Products', icon: <Package size={18} /> },
    { id: 'categories', label: 'Categories', icon: <Grid size={18} /> },
    { id: 'orders', label: 'Orders', icon: <DollarSign size={18} /> },
    { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={18} /> },
    { id: 'subscribers', label: 'Subscribers', icon: <Mail size={18} /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
        <div className="md:hidden bg-white p-5 border-b border-gray-100 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img 
            src={settings.siteLogo ? getImageUrl(settings.siteLogo) : "/logobg.png"} 
            alt={settings.siteName || "Logo"} 
            style={{ height: '80px', width: 'auto' }} 
            className="object-contain" 
          />
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 bg-gray-50 rounded-xl active:scale-95 transition-transform">
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-0 z-40 transition-transform duration-300 transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:w-80 bg-white border-r border-gray-100 p-8 flex flex-col h-screen`}>
        <div className="mb-12">
          <div className="mb-4">
            <img 
              src={settings.siteLogo ? getImageUrl(settings.siteLogo) : "/logobg.png"} 
              alt={settings.siteName || "Logo"} 
              style={{ height: '80px', width: 'auto' }} 
              className="object-contain" 
            />
          </div>
          <p className="hidden md:block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Administrative Control</p>
        </div>

        <nav className="space-y-2 flex-grow">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === item.id ? 'bg-black text-white shadow-xl translate-x-1' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => { localStorage.removeItem('adminToken'); window.location.reload(); }}
          className="mt-auto flex items-center justify-center gap-3 py-4 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-5 md:p-12 overflow-y-auto h-screen w-full scroll-smooth text-gray-900">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2 block">Management Hub</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">{activeTab}</h1>
          </div>
          {activeTab !== 'settings' && activeTab !== 'subscribers' && activeTab !== 'orders' && (
            <button
              onClick={() => { closeModal(); setShowModal(true); }}
              className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-black text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl hover:shadow-black/20"
            >
              <Plus size={18} /> Add New {activeTab.slice(0, -1)}
            </button>
          )}
        </header>

        {activeTab === 'settings' ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 max-w-5xl mx-auto">
            <form onSubmit={async (e) => { e.preventDefault(); await axios.put(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/settings`, settings); alert('Settings Updated Successfully'); }} className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="w-2 h-2 bg-black rounded-full" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-black">General Identity</h3>
                  </div>
                  <div>
                    <label className="label-style">Site Display Name</label>
                    <input type="text" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} className="input-style" placeholder="Enter site name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="label-style">Logo Height</label>
                      <input type="text" value={settings.logoHeight} onChange={(e) => setSettings({ ...settings, logoHeight: e.target.value })} className="input-style" placeholder="40px" />
                    </div>
                    <div>
                      <label className="label-style">Logo Width</label>
                      <input type="text" value={settings.logoWidth} onChange={(e) => setSettings({ ...settings, logoWidth: e.target.value })} className="input-style" placeholder="auto" />
                    </div>
                  </div>
                  <div>
                    <label className="label-style">Brand Logo</label>
                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200 flex items-center gap-8">
                          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm p-2">
                            {settings.siteLogo ? <img src={getImageUrl(settings.siteLogo)} className="w-full h-full object-contain" /> : <SettingsIcon className="text-gray-200" size={32} />}
                          </div>
                          <div className="space-y-2">
                            <label className="inline-block px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-gray-800 transition-colors">
                              Upload New Logo <input type="file" onChange={(e) => handleFileUpload(e, 'settings')} className="hidden" />
                            </label>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Recommended: Transparent PNG or SVG</p>
                          </div>
                        </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="w-2 h-2 bg-black rounded-full" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-black">Contact & Social</h3>
                  </div>
                  <div>
                    <label className="label-style">Primary Business Email</label>
                    <input type="email" value={settings.contactEmail} onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })} className="input-style" placeholder="contact@example.com" />
                  </div>
                  <div>
                    <label className="label-style">WhatsApp Business Number</label>
                    <div className="relative">
                      <input type="text" value={settings.whatsappNumber} onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })} className="input-style" placeholder="91XXXXXXXXXX" />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-green-500 bg-green-50 px-3 py-1 rounded-full border border-green-100 uppercase tracking-tighter">Live Redirect</div>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <label className="label-style mb-4 block">Social Profiles</label>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.keys(settings.socialLinks || {}).map(platform => (
                        <div key={platform}>
                          <label className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1 block ml-1">{platform}</label>
                          <input
                            type="text"
                            value={settings.socialLinks[platform]}
                            onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, [platform]: e.target.value } })}
                            className="w-full bg-white border border-gray-100 px-4 py-2.5 rounded-xl outline-none text-xs"
                            placeholder="@handle"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full py-6 bg-black text-white font-black rounded-3xl hover:translate-y-[-2px] active:translate-y-0 transition-all uppercase tracking-[0.2em] text-sm shadow-2xl shadow-black/20">
                Update Global Settings
              </button>
            </form>
          </motion.div>
        ) : activeTab === 'subscribers' ? (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Subscribed On</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {subscribers.map((sub) => (
                    <tr key={sub._id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <span className="font-black text-sm text-gray-900">{sub.email}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                          {new Date(sub.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => deleteItem(sub._id, 'subscriber')}
                            className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100 shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {subscribers.length === 0 && (
                    <tr>
                      <td colSpan="3" className="px-8 py-20 text-center text-gray-300 font-black uppercase tracking-widest text-xs">No active subscribers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'orders' ? (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Order Information</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Items Purchased</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Total Price</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Workflow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/20 transition-colors align-top">
                      <td className="px-8 py-8">
                        <div className="space-y-1">
                          <span className="bg-black text-white text-[9px] px-2 py-1 rounded font-black tracking-tighter uppercase mb-2 inline-block">{order.orderId}</span>
                          <p className="font-black text-sm text-gray-900">{order.customer?.name || 'WhatsApp Order'}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{order.customer?.phone || 'N/A'}</p>
                          <p className="text-[9px] text-gray-300 font-bold mt-2">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex -space-x-4">
                          {order.orderItems?.map((item, i) => (
                            <div key={i} className="relative group">
                              <img
                                src={getImageUrl(item.image)}
                                className="w-12 h-16 rounded-lg object-cover border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-help"
                                title={`${item.name} x${item.quantity}`}
                              />
                              <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                                {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <span className="font-black text-lg text-gray-900">₹{order.totalAmount}</span>
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex flex-col items-end gap-3">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all outline-none cursor-pointer ${order.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' : order.status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button onClick={() => deleteItem(order._id, 'order')} className="text-red-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="4" className="px-8 py-20 text-center text-gray-300 font-black uppercase tracking-widest text-xs">No orders recorded yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Preview</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Essential Details</th>
                    {activeTab === 'products' && <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Status</th>}
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {(activeTab === 'products' ? products : activeTab === 'categories' ? categories : testimonials).map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className={`relative ${activeTab === 'testimonial' ? 'w-20 h-20' : 'w-20 aspect-[4/5]'} group`}>
                          <img
                            src={getImageUrl(activeTab === 'products' ? item.images[0] : item.image)}
                            alt=""
                            className="w-full h-full rounded-2xl object-cover bg-gray-100 border border-gray-100 shadow-sm transition-transform group-hover:scale-105"
                          />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-black text-sm text-gray-900 mb-1">{activeTab === 'products' ? item.title : item.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          {activeTab === 'products' ? (
                            <>
                              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                              {item.category?.name || 'Uncategorized'}
                            </>
                          ) : activeTab === 'categories' ? (
                            <>
                              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                              Slug: {item.slug}
                            </>
                          ) : (
                            <>
                              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                              {item.role}
                            </>
                          )}
                        </p>
                      </td>
                      {activeTab === 'products' && (
                        <td className="px-8 py-6">
                          <p className="font-black text-sm text-gray-900 mb-1">₹{item.price}</p>
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${item.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`} />
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Stock: {item.stock}</p>
                          </div>
                        </td>
                      )}
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              if (activeTab === 'products') {
                                // Ensure category is set to ID if it's an object
                                const formattedItem = {
                                  ...item,
                                  category: item.category?._id || item.category || '',
                                  sizes: item.sizes || [],
                                  colors: item.colors || []
                                };
                                setProductForm(formattedItem);
                              }
                              else if (activeTab === 'categories') setCategoryForm(item);
                              else setTestimonialForm(item);
                              setShowModal(true);
                            }}
                            className="p-3 bg-gray-50 text-gray-600 hover:bg-black hover:text-white rounded-xl transition-all border border-gray-100 shadow-sm"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteItem(item._id, activeTab.slice(0, -1))}
                            className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-100 shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Unified Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 overflow-y-auto">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal} />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.2)] my-auto overflow-hidden">
              <div className="p-8 md:p-16 max-h-[90vh] overflow-y-auto scrollbar-hide">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-2 block">Creation Wizard</span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">{editingItem ? 'Edit' : 'Create'} {activeTab.slice(0, -1)}</h2>
                  </div>
                  <button onClick={closeModal} className="p-4 bg-gray-50 text-gray-400 rounded-full hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                  {activeTab === 'products' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                      <div className="space-y-8">
                        <div className="space-y-6">
                          <div><label className="label-style">Product Title</label><input type="text" value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} className="input-style" placeholder="e.g. Signature Leather Watch" required /></div>
                          <div>
                            <label className="label-style">Category Assignment</label>
                            <select value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className="input-style appearance-none cursor-pointer" required>
                              <option value="">Select Category</option>
                              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div><label className="label-style">Selling Price (₹)</label><input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} className="input-style" placeholder="0.00" required /></div>
                            <div><label className="label-style">Original Price (₹)</label><input type="number" value={productForm.discountPrice} onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })} className="input-style" placeholder="0.00" /></div>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <label className="label-style">Sizes</label>
                              <input type="text" value={productForm.sizes.join(', ')} onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value.split(',').map(s => s.trim()) })} className="input-style" placeholder="S, M, L" />
                            </div>
                            <div>
                              <label className="label-style">Colors</label>
                              <input type="text" value={productForm.colors.join(', ')} onChange={(e) => setProductForm({ ...productForm, colors: e.target.value.split(',').map(s => s.trim()) })} className="input-style" placeholder="Black, Red" />
                            </div>
                          </div>
                          <div><label className="label-style">Stock Units</label><input type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} className="input-style" placeholder="0" required /></div>
                          <div><label className="label-style">Detailed Description</label><textarea rows="5" value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} className="input-style resize-none leading-relaxed" placeholder="Describe the luxury essence of this product..." required /></div>
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div>
                          <label className="label-style mb-4 block">Visual Assets (Images)</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                            {productForm.images.map((img, i) => (
                              <div key={i} className="relative group aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
                                <img src={getImageUrl(img)} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button type="button" onClick={() => removeImage(img, 'product', i)} className="p-2 bg-white text-red-500 rounded-full shadow-lg active:scale-90 transition-transform"><X size={14} /></button>
                                </div>
                              </div>
                            ))}
                            <label className={`aspect-square border-2 border-dashed border-gray-200 rounded-[1.5rem] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-black transition-all group ${isUploading ? 'opacity-50' : ''}`}>
                              {isUploading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black" /> : <Plus size={24} className="text-gray-300 group-hover:text-black transition-colors" />}
                              <span className="text-[8px] font-black uppercase tracking-widest mt-2 text-gray-300 group-hover:text-black">Add Media</span>
                              <input type="file" onChange={(e) => handleFileUpload(e, 'product')} className="hidden" disabled={isUploading} />
                            </label>
                          </div>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black uppercase tracking-widest text-black mb-1">Featured Highlight</p>
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Pin to Homepage Collections</p>
                          </div>
                          <div className="relative inline-block w-12 h-6 cursor-pointer">
                            <input type="checkbox" checked={productForm.isFeatured} onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })} className="sr-only peer" id="featured-toggle" />
                            <label htmlFor="featured-toggle" className="absolute inset-0 bg-gray-200 rounded-full peer-checked:bg-black transition-colors cursor-pointer" />
                            <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6 cursor-pointer" />
                          </div>
                        </div>
                        <button className="btn-style h-[80px] text-base">{editingItem ? 'Confirm Updates' : 'Publish Product'}</button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'categories' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                      <div className="space-y-6">
                        <div><label className="label-style">Category Name</label><input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} className="input-style" placeholder="e.g. Heritage Collection" required /></div>
                        <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100">
                          <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-4">Live Preview Slug</p>
                          <code className="text-xs font-bold text-black bg-white px-4 py-2 rounded-xl border border-gray-100 block">/products?category={categoryForm.name.toLowerCase().replace(/ /g, '-')}</code>
                        </div>
                      </div>
                      <div className="space-y-8">
                        <div>
                          <label className="label-style mb-4 block">Cover Essence (Image)</label>
                          <div className="flex items-center gap-8 p-8 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                            <div className="w-40 aspect-[4/5] bg-white rounded-[2rem] flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm">
                              {categoryForm.image ? (
                                <div className="relative w-full h-full group">
                                  <img src={getImageUrl(categoryForm.image)} className="w-full h-full object-cover" />
                                  <button type="button" onClick={() => removeImage(categoryForm.image, 'category')} className="absolute top-2 right-2 p-2 bg-white text-red-500 rounded-full shadow-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                                </div>
                              ) : <Plus className="text-gray-100" size={40} />}
                            </div>
                            <div className="space-y-3">
                              <label className="inline-block px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10">
                                {categoryForm.image ? 'Replace Image' : 'Select Image'}
                                <input type="file" onChange={(e) => handleFileUpload(e, 'category')} className="hidden" />
                              </label>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">High quality 4:3 aspect recommended</p>
                            </div>
                          </div>
                        </div>
                        <button className="btn-style h-[80px]">{editingItem ? 'Save Changes' : 'Initialize Category'}</button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'testimonials' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                      <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-6">
                          <div><label className="label-style">Client Name</label><input type="text" value={testimonialForm.name} onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })} className="input-style" placeholder="Full Name" required /></div>
                          <div><label className="label-style">Client Role/Location</label><input type="text" value={testimonialForm.role} onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })} className="input-style" placeholder="e.g. CEO, New York" required /></div>
                        </div>
                        <div><label className="label-style">Authentic Feedback</label><textarea rows="6" value={testimonialForm.content} onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })} className="input-style resize-none leading-relaxed" placeholder="The client's words of appreciation..." required /></div>
                      </div>
                      <div className="space-y-8">
                        <div>
                          <label className="label-style mb-4 block">Client Identity (Image)</label>
                          <div className="flex items-center gap-8 p-8 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-200">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm p-1">
                              {testimonialForm.image ? (
                                <div className="relative w-full h-full group">
                                  <img src={getImageUrl(testimonialForm.image)} className="w-full h-full object-cover rounded-full" />
                                  <button type="button" onClick={() => removeImage(testimonialForm.image, 'testimonial')} className="absolute inset-0 m-auto w-8 h-8 bg-white/80 text-red-500 rounded-full shadow-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><X size={14} /></button>
                                </div>
                              ) : <Plus className="text-gray-100" size={32} />}
                            </div>
                            <div className="space-y-3">
                              <label className="inline-block px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10">
                                {testimonialForm.image ? 'Change Portrait' : 'Upload Portrait'}
                                <input type="file" onChange={(e) => handleFileUpload(e, 'testimonial')} className="hidden" />
                              </label>
                              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Square 1:1 format preferred</p>
                            </div>
                          </div>
                        </div>
                        <button className="btn-style h-[80px]">{editingItem ? 'Update Story' : 'Publish Story'}</button>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Image Cropper Modal */}
      {cropData.show && (
        <ImageCropper
          image={cropData.image}
          aspect={cropData.aspect}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropData({ show: false, image: null, target: null, aspect: 1 })}
        />
      )}
    </div>
  );
};

export default Dashboard;
