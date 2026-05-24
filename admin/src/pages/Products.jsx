import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getImageUrl = (img) => {
    if (!img) return 'https://via.placeholder.com/400?text=No+Image';
    if (img.startsWith('http')) return img;
    return `${apiUrl.replace(/\/$/, '')}/${img.replace(/^\//, '')}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products`);
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <button className="px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
          + Add Product
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <img src={getImageUrl(product.images[0])} alt={product.title} className="w-full h-40 object-cover rounded-xl mb-4" />
              <h3 className="font-medium text-lg truncate">{product.title}</h3>
              <p className="text-gray-500 mt-1">₹{product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;