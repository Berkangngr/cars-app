/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { TodoApp } from '../components/Todo/TodoApp';
import { Box, Paper, Typography } from '@mui/material';
import { ReminderApp } from '../components/Reminder/ReminderApp';

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
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      p: 2, // padding
      gap: 2 // bileşenler arası boşluk
    }}>
      {/* ÜST KISIM - TABLO */}
      <Paper elevation={3} sx={{ 
        flex: '0 0 auto', 
        height: '55%', 
        overflow: 'auto',
        mb: 1 
      }}>
        <Dashboard />
      </Paper>

      {/* ALT KISIM - YAN YANA BİLEŞENLER */}
      <Box sx={{ 
        display: 'flex', 
        flex: 1, 
        gap: 2,
        height: '40%'
      }}>
        {/* SOL BÖLÜM - TODO APP */}
        <Paper elevation={3} sx={{ 
          flex: 1, 
          p: 2,
          overflow: 'auto'
        }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
          
          </Box>
          <TodoApp />
        </Paper>

        
        <Paper elevation={3} sx={{ 
          flex: 1, 
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        }}>
          <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
          </Typography>
         <ReminderApp />
        
        </Paper>
      </Box>
    </Box>
   
   </>
  );
}

export default HomePage;
