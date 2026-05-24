import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`, { email, password });
      localStorage.setItem('adminToken', data.token);
      setAuth(true);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="max-w-md w-full p-8 md:p-12 bg-white rounded-[2.5rem] shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-center mb-8 uppercase">Admin Access</h1>
        {error && <p className="text-red-500 text-sm text-center mb-6">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
              placeholder="master@admin.com"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-50 border-none px-6 py-4 rounded-2xl focus:ring-2 focus:ring-black outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button className="w-full py-5 bg-black text-white font-black rounded-2xl hover:scale-[1.02] transition-transform uppercase tracking-widest text-sm shadow-xl">
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;