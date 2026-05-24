import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/100';
    if (img.startsWith('http')) return img;
    return `${apiUrl.replace(/\/$/, '')}/${img.replace(/^\//, '')}`;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/orders`);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders', error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 font-medium text-sm text-gray-600">Order ID</th>
              <th className="px-6 py-4 font-medium text-sm text-gray-600">Customer</th>
              <th className="px-6 py-4 font-medium text-sm text-gray-600">Total</th>
              <th className="px-6 py-4 font-medium text-sm text-gray-600">Status</th>
              <th className="px-6 py-4 font-medium text-sm text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No orders found.</td>
              </tr>
            ) : (
              orders.map(order => (
                <tr key={order._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{order.orderId}</td>
                  <td className="px-6 py-4 text-sm">
                    <p className="font-bold">{order.customer.name}</p>
                    <p className="text-gray-400 text-xs">{order.customer.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter">Order Overview</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">ID: {selectedOrder.orderId}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">✕</button>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[70vh]">
              {/* Customer Info */}
              <div className="mb-10">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Customer Details</h4>
                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl">
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Name</p>
                    <p className="font-bold">{selectedOrder.customer.name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Phone</p>
                    <p className="font-bold">{selectedOrder.customer.phone}</p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Order Items</h4>
                <div className="space-y-4">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-6 p-4 border border-gray-100 rounded-2xl">
                      <img src={getImageUrl(item.image)} className="w-16 h-20 object-cover rounded-xl bg-gray-50" />
                      <div className="flex-grow">
                        <p className="font-black uppercase text-sm tracking-tight">{item.name}</p>
                        <div className="flex gap-4 mt-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Qty: {item.quantity}</p>
                          {item.size && <p className="text-[10px] font-bold text-gray-400 uppercase">Size: {item.size}</p>}
                          {item.color && <p className="text-[10px] font-bold text-gray-400 uppercase">Color: {item.color}</p>}
                        </div>
                      </div>
                      <p className="font-black text-sm">₹{item.price}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="mt-10 pt-6 border-t border-dashed border-gray-200 flex justify-between items-center">
                <p className="text-sm font-bold text-gray-400 uppercase">Total Amount Paid</p>
                <p className="text-2xl font-black">₹{selectedOrder.totalAmount}</p>
              </div>
            </div>
            
            <div className="p-8 bg-gray-50 text-right">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-8 py-3 bg-black text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-800"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;