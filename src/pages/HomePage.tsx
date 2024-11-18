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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Navbar üstte, position: fixed ile sabit tutuyoruz */}
      <Navbar />
      <div style={{ display: 'flex', flex: 1, marginTop: '64px' }}> {/* Navbar'ın yüksekliği kadar boşluk ekledik */}
        {/* Sidebar solda */}
        <Sidebar />
        
        {/* Dashboard içerik sağda */}
        <div style={{ flex: 1, padding: '20px' }}>
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
