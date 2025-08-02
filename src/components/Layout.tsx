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
              left: 0,
              width: '100%',
              height: '64px',
              zIndex: 1000,
              backgroundColor: '#fff',
              borderBottom: '1px solid #ddd',
            }}
          >
            <Navbar />
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
              style={{
                width: drawerOpen ? 60 : drawerWidth,
                flexShrink: 0,
                backgroundColor: '#f5f5f5',
                borderRight: '1px solid #ddd',
                position: 'fixed',
                top: 64,
                left: 0,
                height: 'calc(100vh - 64px)',
                transition: 'width 0.3s',
                zIndex: 999,
                overflowY: 'auto',
              }}
            >
              <Sidebar setDrawerOpen={setDrawerOpen} />
            </div>


        {/* Sayfa İçeriği */}
        <div
  style={{
    flexGrow: 1,
   // marginTop: '64px',
    marginLeft: drawerOpen ? 60 : drawerWidth,
    padding: '16px',
    overflowY: 'auto',
    height: 'calc(100vh - 64px)',
    backgroundColor: '#fafafa',
    transition: 'margin-left 0.3s',
  }}
>
  {children}
</div>
      </div>
    </div>
  );
};

export default Layout;
