import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) setAuth(true);
  }, []);

  return (
    <div className="App">
      {!auth ? <Login setAuth={setAuth} /> : <Dashboard />}
    </div>
  );
}

export default App;