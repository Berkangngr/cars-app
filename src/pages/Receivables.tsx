import React from 'react'
import gif from '../images/Under-constructıon.gif';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

function Receivables() {
  const navigate = useNavigate();

  return (
    <>
    <div>
      <div>
      <ArrowBackIosIcon
           onClick={() => {
            navigate('/home');
          }}
          aria-label='BackHomePage'
                sx={{
                  position: "absolute",
                  top:'20px',
                  left:'20px',
                  color:'#333333e1',
                  fontWeight:'bold',
                  cursor:'pointer',
                  zIndex:10,
                }}
        >
        </ArrowBackIosIcon>
      </div>
      <img style={{
        position:'absolute',
        top: 0,
        left: 0,
        width: '100vw', 
        height: '100vh', 
        objectFit: 'cover', 
        }} src={gif}
        alt="Under construction animation"
        />
        </div>
    </>
  )
}

export default Receivables