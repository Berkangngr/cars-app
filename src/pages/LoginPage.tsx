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
  const setEmail = useAuthStore((state) => state.setEmail);
  const setPassword = useAuthStore((state) => state.setPassword);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const isLoading = useAuthStore((state) => state.isLoading);

  const submit = async (values : {email: string; password: string},action : any) => {
    // Buradan servise istek atacağımız için try catch içerisine alalım ki servisin ayakta olmadığı durumlarda patlamayalım, 
    // servisi başka bir klasöre açıp oradan çağırıcaz ki daha düzenli olsn kodumuz. services/LoginPageService içerisinde.

    setLoading(true);

   try {
    
    const response = await loginPageService.login(values.email, values.password, '/home');

    if (response.success) {
        setToken(response.token ?? null);
        setEmail(values.email);
        setPassword(values.password);

            //Token'ı saklama
        const token = response.token ||'';
        document.cookie = `token=${token}; path=/;secure;`;
        //path=/: Cookie'nin tüm site genelinde geçerli olmasını sağlar.
        //secure: Yalnızca HTTPS bağlantılarında cookie'nin geçerli olmasını sağlar.
        
        console.log("Token:", token);

        navigate('/home');

        action.resetForm();//Formu kayıt yaptıktan sonra sıfırlıyoruz formik fonksiyonunu kullanarak.
     }

   } catch (error) {
    const err = error as Error; //Errorun tip sorunundan dolayı bu şekilde yaptık.
    toast.error(`Login işlemi sırasında bir hata oluştu: ${err.message || 'Bilinmeyen bir hata'}`);
    clearAuth();
    console.log("API Bağlantı Hatası",error);
   } finally {
    setLoading(false)
   }
  };

  const {values, handleSubmit, handleChange, errors , resetForm} = useFormik({
    initialValues: {
      email: "",
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
          {isLoading && (
                <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  zIndex: 10,
                }}
                >
              <Spinner />
              </Box>
          )}

         {/* Form */}
         <Box
            // component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}
          >
         {/* Kullanıcı Adı Kısmı */}
          <TextField
          id='email'
          value={values.email}
          onChange={handleChange}
          placeholder='Email adresinizi girin' 
          variant="standard"
          helperText = {errors.email && <span style={{color:'red', fontSize:'10px'}}>{errors.email}</span>
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
          placeholder='Şifrenizi girin' 
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
