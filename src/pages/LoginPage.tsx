/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import LoginImage from '../images/LoginPageİmage-Photoroom.png';
import { Grid, Box, TextField, Button, InputAdornment } from '@mui/material';
import '../css/LoginPage.css';
import Person2Icon from '@mui/icons-material/Person2';
import LockIcon from '@mui/icons-material/Lock';
import { useFormik } from 'formik';
import { loginPageSchema } from '../schemas/LoginPageSchema';
import {  useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import loginPageService from '../services/LoginPageService';
import useAuthStore from '../zustand/authStore';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner'


function LoginPage() {
//  Giriş başarılı olursa bu ekrana gönder.
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setLoading = useAuthStore((state) => state.setLoading);
  const setUsername = useAuthStore((state) => state.setUsername);
  const setPassword = useAuthStore((state) => state.setPassword);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  const submit = async (values : {username: string; password: string},action : any) => {
    // Buradan servise istek atacağımız için try catch içerisine alalım ki servisin ayakta olmadığı durumlarda patlamayalım, 
    // servisi başka bir klasöre açıp oradan çağırıcaz ki daha düzenli olsn kodumuz. services/LoginPageService içerisinde.

    setLoading(true);

   try {
    const returnUrl = '/member/appuser/index'; //Hedefi buraya yönlendirdik.
    const response = await loginPageService.login(values.username, values.password, returnUrl);

    if (response.success) {
        setToken(response.token ?? null);
        setUsername(values.username);
        setPassword(values.password);

        //Token'ı saklama
        useAuthStore.getState().setToken(response.token || '');

        if (response.redirectUrl) {
          navigate(response.redirectUrl); // API'den gelen yönlendirme URL'sine git
        }else {
          navigate('/') //Eğer redirectUrl yoksa varsayılan ana sayfaya git.
        }
        action.resetForm();//Formu kayıt yaptıktan sonra sıfırlıyoruz formik fonksiyonunu kullanarak.
     }
    // else {
    //   // toast.error(response.message);
    // }

    

   } catch (error) {
    toast.error("Login işlemi sırasında bir hata oluştu.");
    clearAuth();
    console.log("API Bağlantı Hatası",error);
   } finally {
    setLoading(false)
   }
  };

  const {values, handleSubmit, handleChange, errors , resetForm} = useFormik({
    initialValues: {
     username: "",
     password:"",
    },
    onSubmit: submit,
    validationSchema : loginPageSchema,
  });


  
  return (
    <Grid container className="container" spacing={0}>
      <Grid item xs={12} md={6} className="left-side">

        <Box onSubmit={handleSubmit} component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>


        <Box sx={{ position: 'relative' }}>
          {/* Spinner */}
          {isLoading && <Spinner />}
         {/* Form */}
         <Box
            // component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}
          >
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
        </Box>
        </Box>
      </Grid>
      <Grid item xs={12} md={6} className="right-side">
        <img src={LoginImage} alt="Register" />
      </Grid>
    </Grid>
  );
}

export default LoginPage;
