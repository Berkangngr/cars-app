import React from 'react';
import { Drawer, List, ListItem, ListItemText, Divider, ListSubheader } from '@mui/material';
import { Link } from 'react-router-dom';
import BuildIcon from '@mui/icons-material/Build';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CurrencyLiraIcon from '@mui/icons-material/CurrencyLira';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import BarChartIcon from '@mui/icons-material/BarChart';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import TimeToLeaveIcon from '@mui/icons-material/TimeToLeave';
import HomeIcon from '@mui/icons-material/Home';

function Sidebar() {
  return (
    <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          backgroundColor: '#faf8fd',
          boxShadow: 'none',
          position: 'fixed',
          top: '64px', 
          zIndex: 1000, 
        },
      }}
      variant="permanent"  // Kalıcı sidebar
      anchor="left"
    >
      <List>
      <ListItem  component={Link} to="/home">
        <HomeIcon sx={{color:'#333333e1' , marginRight:'10px'}}/>
          <ListItemText sx={{color:'#333333e1'}} primary="Ana Sayfa" />
        </ListItem>
        <Divider />
        <ListItem  component={Link} to="/newRepair">
          <BuildIcon sx={{color:'#333333e1' , marginRight:'10px'}}/>
          <ListItemText sx={{color:'#333333e1'}} primary="Yeni Tamirat" />
        </ListItem>
        <Divider />
        <ListItem  component={Link} to="/service">
        <HourglassTopIcon sx={{color:'#333333e1' , marginRight:'10px'}}/>
          <ListItemText sx={{color:'#333333e1'}} primary="Servistekiler" />
        </ListItem>
        <Divider />
        <ListItem  component={Link} to="/receivables">
        <CurrencyLiraIcon sx={{color:'#333333e1' , marginRight:'10px'}}/>
          <ListItemText sx={{color:'#333333e1'}} primary="Alacaklar" />
        </ListItem>
        <Divider />
        <ListItem  component={Link} to="/customers">
        <RecentActorsIcon sx={{color:'#333333e1' , marginRight:'10px'}}/>
          <ListItemText sx={{color:'#333333e1'}} primary="Müşteriler" />
        </ListItem>
        <ListItem  component={Link} to="/cars">
        <TimeToLeaveIcon sx={{color:'#333333e1' , marginRight:'10px'}}/>
          <ListItemText sx={{color:'#333333e1'}} primary="Araçlar" />
        </ListItem>
      </List>
      <Divider />
      
      <List subheader={<ListSubheader sx={{ backgroundColor: '#efedf1', fontWeight: 'bold', color: '#333' }}>Raporlar</ListSubheader>}>
          <ListItem component={Link} to="/report/stockReport">
          <WarehouseIcon sx={{color:'#333333e1' , marginRight:'10px'}}/>
            <ListItemText sx={{color:'#333333e1'}} primary="Stok Raporu"  />
          </ListItem>
          <ListItem component={Link} to="/report">
          <BarChartIcon sx={{color:'#333333e1' , marginRight:'10px'}}/>
            <ListItemText sx={{color:'#333333e1'}} primary="Rapor İsim2"  />
          </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;
