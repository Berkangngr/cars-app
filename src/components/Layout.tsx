import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const drawerWidth = 240;

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          height: '64px',
          zIndex: 1000,
          backgroundColor: '#fff',
          borderBottom: '1px solid #ddd',
          transition: 'left 0.3s, width 0.3s',
        }}
      >
        <div style={{ marginLeft: drawerOpen ? '60px' : '240px' }}>
          <Navbar />
        </div>
      </div>

      {/* Ana İçerik */}
      <div
        style={{
          display: 'flex',
          flexGrow: 1,
          marginTop: '64px',
          overflow: 'hidden',
          height: `calc(100vh - 64px)`,
        }}
      >
        {/* Sidebar */}
        <div
          // style={{
          //   width: drawerWidth,
          //   flexShrink: 0,
          //   backgroundColor: '#f5f5f5',
          //   borderRight: '1px solid #ddd',
          //   overflowY: 'auto',
          //   height: '100vh', 
          //   position: 'fixed',
          //   top: 0,
          //   left: drawerOpen ? 0 : `-${drawerWidth}px`,
          //   zIndex: 999,
          //   transition: 'left 0.3s',
          // }}
        >
          <Sidebar setDrawerOpen={setDrawerOpen} />
        </div>

        {/* Sayfa İçeriği */}
        <div
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            paddingLeft: drawerOpen ? '20px' : '200px',
            backgroundColor: '#fafafa',
            position: 'relative',
            // paddingLeft: "30px",
            // paddingLeft: drawerOpen ? 0 : 100,
            transition: 'margin-left 0.3s',
            height: 'calc(100vh - 64px)',
          }}
        >
          {drawerOpen}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
