import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from '../images/Logo-Photoroom.png';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Divider } from '@mui/material';
import axios from '../config/AxiosConfig';
import {toast} from 'react-toastify';
import {UserType} from '../types/Types';
import { AxiosError } from 'axios';




interface userApiResponse {
  username:string,
  userImage:string,
}

function Navbar() {
const [userData, setUserData] = useState<userApiResponse | null>(null);

const navigate = useNavigate();

const fetchPost = async() => {
  try {
    const response = await axios('/member/UserSetting/Setting');
    setUserData(response.data);
  } catch (error: unknown) {
  if (error instanceof AxiosError) {
    console.log(error.response?.data?.message || 'Kullanıcı Bilgisi alınamadı!');
  } else {
    toast.error('Bilinmeyen bir hata oluştu!')
  }  
  }
}

useEffect(() => {
  fetchPost();
},[])
  
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
            to="/home"
            edge="start"
            sx={{ mr: 2 }}
        >
        <img src={userData?.userImage || logo} alt="logo"
            style={{width:'40px',height:'40px'}}
        />
        </IconButton>
        
        {/* Ortada başlık */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333333e1', fontWeight:'bold' }}>
          {/* //Apiden bilgiyi aldıktan sonra buraya usurname gelicek. */}
          {userData?.username}
        </Typography>
        
        {/* Logout butonu*/}
        <div>
            <IconButton
            onClick={() => {
              toast.info('Başarıyla çıkış yapıldı!');
              localStorage.removeItem('authToken');
              navigate('/');
            }}
                aria-label='Logout'
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
