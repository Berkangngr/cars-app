import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
   <>
   <Dashboard />
   </>
  );
}

export default HomePage;
