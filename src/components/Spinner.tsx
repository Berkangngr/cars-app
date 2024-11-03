import React from 'react'
import store from '../zustand/Store';

// Burada loading ikonunu oluşturacağız.

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
function Spinner() {
  return (
    <>
    <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={false}
        
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  )
}

export default Spinner