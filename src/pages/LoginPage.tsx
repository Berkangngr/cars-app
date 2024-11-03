import LoginImage from '../images/LoginPageİmage-Photoroom.png';
import { Grid, Box, TextField, Button, InputAdornment } from '@mui/material';
import '../css/LoginPage.css';
import Person2Icon from '@mui/icons-material/Person2';
import LockIcon from '@mui/icons-material/Lock';
import { useFormik } from 'formik';
import { loginPageSchema } from '../schemas/LoginPageSchema';
import {  useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';


function LoginPage() {
//  Giriş başarılı olursa bu ekrana gönder.
  const navigate = useNavigate()

  const submit = () => {
    // devam edicez
  }

  const {values, handleSubmit, handleChange, errors , resetForm} = useFormik({
    initialValues: {
     username: "",
     password:"",
    },
    onSubmit: submit,
    validationSchema : loginPageSchema
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
          
          <Button type='submit' variant="contained" color="success">Sign in</Button>

          <div>
          Hesabın yok mu? 
          <Link
      component="button"
      variant="body2"
      onClick={() => {
        navigate("/register")
      }}
    >
      <span style={{color:'red'}}>Kayıt ol.</span>
    </Link>
    </div>

        </Box>
      </Grid>
      <Grid item xs={12} md={6} className="right-side">
        <img src={LoginImage} alt="Register" />
      </Grid>
    </Grid>
  );
}

export default LoginPage;
