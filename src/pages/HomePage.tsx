import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = true; // Burada gerçek oturum kontrolünü yapmalısınız

  // Yönlendirme işlemi için useEffect kullanalım
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login"); // Kullanıcı giriş yapmadıysa login sayfasına yönlendir
    }
  }, [isAuthenticated, navigate]); // isAuthenticated veya navigate değiştiğinde bu effect çalışacak

  return (
    <div>
      <h1>Hoş Geldiniz!</h1>
    </div>
  );
}

export default HomePage;
