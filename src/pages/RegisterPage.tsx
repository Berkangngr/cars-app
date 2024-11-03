import React from 'react';
import { Grid, Box, TextField, Button, InputAdornment } from '@mui/material';
import '../css/RegisterPage.css';
import Person2Icon from '@mui/icons-material/Person2';
import LockIcon from '@mui/icons-material/Lock';
import { useFormik } from 'formik';
import { registerPageSchemas } from '../schemas/RegisterPageSchema';
import registerPageService from '../services/RegisterPageService';
import { UserType } from '../types/Types';
import { toast } from 'react-toastify';
import {  useNavigate } from 'react-router-dom';



function RegisterPage() {
//  Giriş başarılı olursa bu ekrana gönder.
  const navigate = useNavigate()

  const submit = async (values :any , actions : any) => {
    try {
      const payload : UserType = {
        username : values.username,
        password : values.password,
        name: values.name,
        lastName:values.lastName,
        confirPassword:values.confirmPassword
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
     confirmPassword:"",
     name: "",
     lastName:"",
    },
    onSubmit: submit,
    validationSchema : registerPageSchemas
  });


  const clear = () => {
    resetForm();
  }
  
  return (
    <Grid container className="container" 
    spacing={0}>
      <Grid item xs={12}  className="left-side">

        <Box onSubmit={handleSubmit} component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>

          {/* İsim */}

          <TextField
          id='name'
          value={values.name}
          onChange={handleChange}
          placeholder='Name' 
          variant="standard"
          helperText = {errors.name && <span style={{color:'red', fontSize:'10px'}}>{errors.name}</span>
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

          {/* Soyisim */}

          <TextField
          id='lastName'
          value={values.lastName}
          onChange={handleChange}
          placeholder='Last Name' 
          variant="standard"
          helperText = {errors.lastName && <span style={{color:'red', fontSize:'10px'}}>{errors.lastName}</span>
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

          {/* Şifre tekrarı */}

          <TextField 
          id='confirmPassword'
          value={values.confirmPassword}
          onChange={handleChange}
          placeholder='Şifre' 
          type="password" 
          variant="standard"
          helperText = {errors.confirmPassword && <span style={{color:'red',fontSize:'10px'}}>{errors.confirmPassword}</span>}
          fullWidth
          InputProps={{
            startAdornment:(
              <InputAdornment position='start'>
              <LockIcon />
            </InputAdornment>
            ),
          }}
          />
          
          <Button type='submit' variant="contained" color="success">sign up</Button>

        </Box>
      </Grid>
    </Grid>
  );
}

export default RegisterPage;
