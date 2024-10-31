import React from 'react';
import RegisterImages from '../images/LoginPageİmage-Photoroom.png';
import { Grid, Box, TextField, Button, InputAdornment } from '@mui/material';
import '../css/RegisterPage.css';
import Person2Icon from '@mui/icons-material/Person2';
import LockIcon from '@mui/icons-material/Lock';
import { useFormik } from 'formik';
import { registerPageSchemas } from '../schemas/RegisterPageSchema';
import registerPageService from '../services/RegisterPageService';
import { UserType } from '../types/Types';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function RegisterPage() {
//  Giriş başarılı olursa bu ekrana gönder.
  const navigate = useNavigate()

  const submit = async (values :any , actions : any) => {
    try {
      const payload : UserType = {
        username : values.username,
        password : values.password
      }
   const response =   await registerPageService.register(payload)
   if (response) {
    clear();
    toast.success("Kullanıcı kaydedildi.")
    navigate("/login")

   }
    } catch (error) {
      toast.error("Kullanıcı kaydedilirken hata oluştu.")
    }
  }

  const {values, handleSubmit, handleChange, errors , resetForm} = useFormik({
    initialValues: {
     username: "",
     password:"",
    },
    onSubmit: submit,
    validationSchema : registerPageSchemas
  });


  const clear = () => {
    resetForm();
  }
  
  return (
    <Grid container className="container" spacing={0}>
      <Grid item xs={12} md={6} className="left-side">

        <Box onSubmit={handleSubmit} component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>

         {/* Kullanıcı Adı Kısmı */}
          <TextField
          id='username'
          value={values.username}
          onChange={handleChange}
          placeholder='Kullanıcı Adı' 
          variant="standard"
          helperText = {errors.username && <span style={{color:'red', fontSize:'10px'}}>{errors.username}</span>
          }
           fullWidth
           InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Person2Icon />
              </InputAdornment>
            ),
          }}
          />
            

          {/* Şifre Kısmı */}
          <TextField 
          id='password'
          value={values.password}
          onChange={handleChange}
          placeholder='Şifre' 
          type="password" 
          variant="standard"
          helperText = {errors.password && <span style={{color:'red',fontSize:'10px'}}>{errors.password}</span>}
          fullWidth
          InputProps={{
            startAdornment:(
              <InputAdornment position='start'>
              <LockIcon />
            </InputAdornment>
            ),
          }}
          />
          
          <Button type='submit' variant="contained" color="success">Kaydol</Button>

        </Box>
      </Grid>
      <Grid item xs={12} md={6} className="right-side">
        <img src={RegisterImages} alt="Register" />
      </Grid>
    </Grid>
  );
}

export default RegisterPage;