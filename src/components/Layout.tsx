import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const drawerWidth = 240;

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Navbar */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '64px', zIndex: 1000, backgroundColor: '#fff', borderBottom: '1px solid #ddd' }}>
        <Navbar />
      </div>

      {/* Ana İçerik (Sidebar ve Sayfa İçeriği) */}
      <div style={{ display: 'flex', flexGrow: 1, marginTop: '64px', overflow: 'hidden' }}>
        {/* Sidebar */}
        <div style={{ width: drawerWidth, flexShrink: 0, backgroundColor: '#f5f5f5', borderRight: '1px solid #ddd', overflowY: 'auto', height: 'calc(100vh - 64px)' }}>
          <Sidebar />
        </div>

        {/* Sayfa İçeriği (Dinamik) - KRİTİK NOKTA: position: relative */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '10px', backgroundColor: '#fafafa', position: 'relative' }}>
          {children} {/* Dinamik sayfalar buraya render edilecek */}
        </div>
      </div>
    </div>
  );
};

export default Layout;