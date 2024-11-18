import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';

function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = true; // Burada gerçek oturum kontrolünü yapmalısınız

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Kullanıcı giriş yapmadıysa login sayfasına yönlendir
    }
  }, [isAuthenticated, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', margin: 0 }}>
      
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 1000,
        }}
      >
        <Navbar />
      </div>
      <div style={{ display: 'flex', flex: 1, marginTop: '64px' }}>
        {/* Sidebar sabit */}
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            height: 'calc(100vh - 64px)', 
            width: '200px', 
            zIndex: 1000,
            backgroundColor: '#f5f5f5',
          }}
        >
          <Sidebar />
        </div>

        
        <div
          style={{
            marginLeft: '200px', 
            padding: '16px',
            width: 'calc(100% - 200px)', 
            height: 'calc(100vh - 64px)', 
          }}
        >
          
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
