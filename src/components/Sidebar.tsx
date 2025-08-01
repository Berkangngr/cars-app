import React, { useState } from "react";
import BarChartIcon from "@mui/icons-material/BarChart";
import BuildIcon from "@mui/icons-material/Build";
import HomeIcon from "@mui/icons-material/Home";
import RecentActorsIcon from "@mui/icons-material/RecentActors";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  IconButton,
  Box,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";

const drawerWidth = 240;
const collapsedWidth = 60;

function Sidebar({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        // width: open ? drawerWidth : collapsedWidth,
        flexShrink: 0,
        whiteSpace: "nowrap",
        "& .MuiDrawer-paper": {
          width: open ? drawerWidth : collapsedWidth,
          overflowX: "hidden",
          backgroundColor: "#faf8fd",
          boxShadow: "none",
          position: "fixed",
          top: "0",
          height: `100%`,
          transition: "width 0.3s",
          borderRight: "1px solid #ddd",
          zIndex: 1000,
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: open ? "flex-end" : "center",
          p: 1.9,
          borderBottom: "1px solid #ddd",
        }}
      >
        <IconButton onClick={onToggle} size="small" sx={{ color: "#333" }}>
          {open ? <ChevronLeftIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <List>
        <Divider />
        <ListItem  component={Link} to="/home" sx={{ px: 2.5 }}>
          <Tooltip title="Ana Sayfa" placement="right" disableHoverListener={open}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center", color: "#333" }}>
              <HomeIcon />
            </ListItemIcon>
          </Tooltip>
          {open && <ListItemText primary="Ana Sayfa" sx={{ color: "#333" }} />}
        </ListItem>
        <Divider />
        <ListItem  component={Link} to="/newRepair" sx={{ px: 2.5 }}>
          <Tooltip title="Yeni Tamirat" placement="right" disableHoverListener={open}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center", color: "#333" }}>
              <BuildIcon />
            </ListItemIcon>
          </Tooltip>
          {open && <ListItemText primary="Yeni Tamirat" sx={{ color: "#333" }} />}
        </ListItem>
        <Divider />
        <ListItem  component={Link} to="/customers" sx={{ px: 2.5 }}>
          <Tooltip title="Müşteriler" placement="right" disableHoverListener={open}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center", color: "#333" }}>
              <RecentActorsIcon />
            </ListItemIcon>
          </Tooltip>
          {open && <ListItemText primary="Müşteriler" sx={{ color: "#333" }} />}
        </ListItem>
        <ListItem  component={Link} to="/cars" sx={{ px: 2.5 }}>
          <Tooltip title="Araçlar" placement="right" disableHoverListener={open}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center", color: "#333" }}>
              <TimeToLeaveIcon />
            </ListItemIcon>
          </Tooltip>
          {open && <ListItemText primary="Araçlar" sx={{ color: "#333" }} />}
        </ListItem>
        <Divider />
      </List>
      <Divider />
      <List
        subheader={
          open ? (
            <ListSubheader sx={{ backgroundColor: "#efedf1", fontWeight: "bold", color: "#333" }}>
              Raporlar
            </ListSubheader>
          ) : null
        }
      > <ListItem  component={Link} to="/report2" sx={{ px: 2.5 }}>
          <Tooltip title="Report2 '" placement="right" disableHoverListener={open}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center", color: "#333" }}>
              <BarChartIcon />
            </ListItemIcon>
          </Tooltip>
          {open && <ListItemText primary="İşlem Raporu" sx={{ color: "#333" }} />}
        </ListItem>
        <ListItem  component={Link} to="/report/stockReport" sx={{ px: 2.5 }}>
          <Tooltip title="Stok Raporu" placement="right" disableHoverListener={open}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center", color: "#333" }}>
              <WarehouseIcon />
            </ListItemIcon>
          </Tooltip>
          {open && <ListItemText primary="Stok Raporu" sx={{ color: "#333" }} />}
        </ListItem>
        <ListItem  component={Link} to="/report" sx={{ px: 2.5 }}>
          <Tooltip title="Rapor İsim2" placement="right" disableHoverListener={open}>
            <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center", color: "#333" }}>
              <BarChartIcon />
            </ListItemIcon>
          </Tooltip>
          {open && <ListItemText primary="Rapor İsim2" sx={{ color: "#333" }} />}
        </ListItem>
      </List>
    </Drawer>
  );
}

// Sidebar wrapper component that manages open state and margin for content
export function SidebarWrapper({ children, setDrawerOpen }: { children: React.ReactNode, setDrawerOpen: (open: boolean) => any })
 {
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => {
    setOpen(!open);
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar open={open} onToggle={toggleSidebar} />
      <Box
        // component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          // ml: open ? `${drawerWidth}px` : `80px`,
          transition: "margin-left 0.3s",
          mt: '64px', // navbar yüksekliği kadar boşluk bırak
          minHeight: "calc(100vh - 64px)",
          bgcolor: "#fff",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default SidebarWrapper;
