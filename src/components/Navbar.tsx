import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../images/Logo.png';
import { Link } from 'react-router-dom';
import { Divider } from '@mui/material';
import axios from '../config/AxiosConfig';
import {toast} from 'react-toastify';
import {UserType} from '../types/Types';


interface ApiResponse {
  data:any;
}

function Navbar() {
const [userData, setUserData] = useState<string>();
const [error, setError] = useState<string>("");


useEffect(() => {
  const fetchData = async () => {

  }

})
  

  return (
    <>
    <AppBar 
    position="static"
    sx={{
        backgroundColor: '#faf8fd',
        boxShadow:'none',
        backdropFilter: 'blur(10px)',
    }}
    >
      <Toolbar>
        {/* Sol tarafta bir logo */}
        <IconButton
            component={Link}
            to="/"
            edge="start"
            sx={{ mr: 2 }}
        >
        <img src={logo} alt="logo"
            style={{width:'40px',height:'40px'}}
        />
        </IconButton>
        
        {/* Ortada başlık */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333333e1', fontWeight:'bold' }}>
          Servislerin İsmi
        </Typography>
        
        {/* Logout butonu*/}
        <div>
            <IconButton
                component={Link}
                to="/login"
                aria-label='Go to home'
                sx={{color: '#333333e1', fontWeight:'bold'}}
            >
                <LogoutIcon />
            </IconButton>
        </div>
      </Toolbar>
    </AppBar>
     <Divider  />
     </>
  );
}

export default Navbar;
