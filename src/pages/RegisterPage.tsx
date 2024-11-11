/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Grid, Box, TextField, Button, InputAdornment, Avatar } from '@mui/material';
import '../css/RegisterPage.css';
import Person2Icon from '@mui/icons-material/Person2';
import LockIcon from '@mui/icons-material/Lock';
import { useFormik } from 'formik';
import { registerPageSchemas } from '../schemas/RegisterPageSchema';
import registerPageService from '../services/RegisterPageService';
import { UserType } from '../types/Types';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';


function RegisterPage() {
  const navigate = useNavigate();
  const [logo, setLogo] = useState<string | null>(null);

  const submit = async (values: any, actions: any) => {
    try {
      // FormData nesnesini oluştur ve tüm alanları ekle
      
      const formData = new FormData();
      formData.append("FirstName", values.FirstName);
      formData.append("LastName",values.LastName);
      formData.append("UserName",values.UserName);
      formData.append("Password",values.Password);
      formData.append("Email",values.Email);
      if (values.Image) {
        formData.append("Image",values.Image); // Burası sadece ımage varsa ekler
      }

      // register fonksiyonuna FormData nesnesini gönderdik.
      const response = await registerPageService.register(formData);

      if (response) {
        clear();
        toast.success("Kullanıcı kaydedildi.");
        const redirectUrl = response.redirectUrl;
        if (redirectUrl) {
          if (redirectUrl === "/Account/Login") {
            navigate("/login");
          }else {
            navigate(redirectUrl);
          }
        }
        
      }
    } catch (error) {
      toast.error("Kullanıcı kaydedilirken hata oluştu.");
    }
  };

  const { values, handleSubmit, handleChange, errors, resetForm, setFieldValue } = useFormik({
    initialValues: {
      FirstName: "",
      LastName: "",
      UserName: "",
      Password: "",
      Email: "",
      Image: "", 
    },
    onSubmit: submit,
    validationSchema: registerPageSchemas
  });

  const clear = () => {
    resetForm();
  };

  // Dosya değiştiğinde çağrılan işlev
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const logoUrl = URL.createObjectURL(file);
      setLogo(logoUrl);
      setFieldValue("Image", file); // Image alanını form değerine ayarlanır
    }
  };

  return (
    <Grid container className="container" spacing={0}>
      <Grid item xs={12} className="left-side">
        <Box onSubmit={handleSubmit} component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
          {/* İsim */}
          <TextField
            id="FirstName"
            value={values.FirstName}
            onChange={handleChange}
            placeholder="Name"
            variant="standard"
            helperText={errors.FirstName && <span style={{ color: 'red', fontSize: '10px' }}>{errors.FirstName}</span>}
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
            id="LastName"
            value={values.LastName}
            onChange={handleChange}
            placeholder="Last Name"
            variant="standard"
            helperText={errors.LastName && <span style={{ color: 'red', fontSize: '10px' }}>{errors.LastName}</span>}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person2Icon />
                </InputAdornment>
              ),
            }}
          />

          {/* Kullanıcı Adı */}
          <TextField
            id="UserName"
            value={values.UserName}
            onChange={handleChange}
            placeholder="Kullanıcı Adı"
            variant="standard"
            helperText={errors.UserName && <span style={{ color: 'red', fontSize: '10px' }}>{errors.UserName}</span>}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person2Icon />
                </InputAdornment>
              ),
            }}
          />

          {/* Şifre */}
          <TextField
            id="Password"
            value={values.Password}
            onChange={handleChange}
            placeholder="Şifre"
            type="password"
            variant="standard"
            helperText={errors.Password && <span style={{ color: 'red', fontSize: '10px' }}>{errors.Password}</span>}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Email */}
          <TextField
            id="Email"
            value={values.Email}
            onChange={handleChange}
            placeholder="Email"
            type="email"
            variant="standard"
            helperText={errors.Email && <span style={{ color: 'red', fontSize: '10px' }}>{errors.Email}</span>}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmailIcon />
                </InputAdornment>
              ),
            }}
          />

          {/* Resim Yükleme Butonu */}
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            {logo && <Avatar src={logo} alt="Logo Preview" sx={{ width: 100, height: 100 }} />}
            <Button variant="contained" component="label" color="primary">
              Resim Seç
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
          </Box>
          {/* Kayıt Ol Butonu */}
          <Button type='submit' variant="contained" color="success">Sign in</Button>
        </Box>
      </Grid>
    </Grid>
  );
}

export default RegisterPage;
