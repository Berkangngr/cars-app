import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { alpha, Box, Button, Divider, Menu, MenuItem, MenuProps, styled, TextField } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../config/AxiosConfig';
import logo from '../images/Logo-Photoroom.png';
import { newPasswordSchema } from '../schemas/NewPassword';
import { changePassword } from '../services/ChangePasswordService';
import { AxiosError } from 'axios';


//Modal styleı
const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 8,
};

interface userApiResponse {
  FirstName: string
  LastName: string
  Password: string
  Image: null
  ImagePath: string
  Email: string
  UserName: string
  Statu: boolean
}



//Dropdown menu style
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: 'rgb(55, 65, 81)',
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
    ...theme.applyStyles('dark', {
      color: theme.palette.grey[300],
    }),
  },
}));

//Deneme ctyle classes






function Navbar() {
 
const [userData, setUserData] = useState<userApiResponse | null>(null);
const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
const [openModal, setOpenModal] = useState(false);
const handleOpenModal = () => setOpenModal(true);
const handleCloseModal = () => setOpenModal(false)

//const BASE_URL = "http://localhost:56952";
const BASE_URL_PROD = "https://api.aracimhakkinda.com";
const imageUrl = userData?.ImagePath ? `${BASE_URL_PROD}${userData.ImagePath}` : logo;
const navigate = useNavigate();



const fetchPost = async() => {
  try {
     const response = await axios.get(`${BASE_URL_PROD}/api/UserSetting/Setting`);
   // member/UserSetting/Setting
    setUserData(response.data)
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
console.log(imageUrl)
const open = Boolean(anchorEl);
const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  setAnchorEl(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl(null);
};

//Logout fonksiyonu

const handleLogOut = async () => {
  try {
     await axios.post('/api/UserSetting/LogOut');
    localStorage.removeItem('authToken')
    toast.info("Başarı ile çıkış yapıldı!")
    navigate("/");
  } catch (error) {
    console.log("Çıkış yaparken bir sorun oluştu:", error);
  }
  
}

//Admin ekranındaki şifreyi değiştirme

const submit = async (values: any, actions: any) => {
  // FormData nesnesini oluştur ve tüm alanları ekle
  try {
    const response = await changePassword(values.oldPassword, values.newPassword);
    if (response.success) {
      navigate("/");
      // window.location.href = response.redirectUrl;
    } else {
    if (response.NewPassword) {
      actions.setFieldError("newPassword", response.NewPassword)
    }else {
      actions.setErrors({general: "Şifre değiştirme başarısız, lütfen tekrar deneyiniz."});
    }
    }
  } catch (error) {
    console.error("Şifre değiştirme hatası:", error);
    actions.setErrors({ general: "Bir hata oluştu, lütfen tekrar deneyin." });  
  }

}

const { values, handleSubmit, handleChange, errors } = useFormik({
initialValues: {
  oldPassword: "",
  newPassword: "",
},
onSubmit: submit,
validationSchema: newPasswordSchema,
});




  
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
        <img src={ imageUrl || logo} alt="logo"
            style={{width:'40px',height:'40px'}}
        />
        </IconButton>
        
        {/* Ortada başlık */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#333333e1', fontWeight:'bold' }}>
          {/* //Apiden bilgiyi aldıktan sonra buraya usurname gelicek. */}
          {userData?.UserName.toUpperCase()}
        </Typography>
        
      {/* Admin panel butonu */}

      <div>
      <Button
        id="demo-customized-button"
        variant="outlined"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{background:'transparent',color: '#333333e1', fontWeight:'bold', borderColor:'#333333e1'}}
      >
        Admin Panel
      </Button>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {handleOpenModal(); handleClose();}} disableRipple>
          <VpnKeyIcon  />
          Şifre Değiştir
        </MenuItem>
      </StyledMenu>
    </div>

    {/* Modal Yapısı */}

    <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styleModal}>
        <form onSubmit={handleSubmit}>
        <TextField
            id="oldPassword"
            value={values.oldPassword}
            onChange={handleChange}
            type='password'
            placeholder="Eski Şifre"
            variant="standard"
            helperText={errors.oldPassword && <span style={{ color: 'red', fontSize: '10px' }}>{errors.oldPassword}</span>}
            fullWidth
            sx={{
              marginBottom: "16px",
              input: {
                fontSize: "20px",
              },
              "& .MuiInput-underline:before": {
                borderBottomColor: "gray", // Alt çizgi rengi
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "black", // Hover efekti
              },
            }}
          />

        <TextField
            id="newPassword"
            value={values.newPassword}
            onChange={handleChange}
            type='password'
            placeholder="Yeni Şifre"
            variant="standard"
            helperText={errors.newPassword && <span style={{ color: 'red', fontSize: '10px' }}>{errors.newPassword}</span>}
            fullWidth
            sx={{
              marginBottom: "16px",
              marginTop:"10%",
              input: {
                fontSize: "20px",
              },
              "& .MuiInput-underline:before": {
                borderBottomColor: "gray", // Alt çizgi rengi
              },
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "black", // Hover efekti
              },
            }}
          />
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <Button type='submit' variant="contained" color="success">Şifreyi Değiştir</Button>
          </Box>
          </form>
        </Box>
      </Modal>


        {/* Logout butonu*/}
        <div>
            <IconButton
            onClick={handleLogOut}
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
