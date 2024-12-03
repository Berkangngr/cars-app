import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material'
import axios from '../config/AxiosConfig';
import { toast } from 'react-toastify';
import  useAuthStore  from '../zustand/authStore';


const carsBrand = [
  { value: 'Audi', label: 'Audi' },
  { value: 'BMW', label: 'BMW' },
  { value: 'Chevrolet', label: 'Chevrolet' },
  { value: 'Citroën', label: 'Citroën' },
  { value: 'Dacia', label: 'Dacia' },
  { value: 'Fiat', label: 'Fiat' },
  { value: 'Ford', label: 'Ford' },
  { value: 'Honda', label: 'Honda' },
  { value: 'Hyundai', label: 'Hyundai' },
  { value: 'Kia', label: 'Kia' },
  { value: 'Mazda', label: 'Mazda' },
  { value: 'Mercedes-Benz', label: 'Mercedes-Benz' },
  { value: 'Mini', label: 'Mini' },
  { value: 'Mitsubishi', label: 'Mitsubishi' },
  { value: 'Nissan', label: 'Nissan' },
  { value: 'Opel', label: 'Opel' },
  { value: 'Peugeot', label: 'Peugeot' },
  { value: 'Porsche', label: 'Porsche' },
  { value: 'Renault', label: 'Renault' },
  { value: 'Seat', label: 'Seat' },
  { value: 'Skoda', label: 'Skoda' },
  { value: 'Subaru', label: 'Subaru' },
  { value: 'Suzuki', label: 'Suzuki' },
  { value: 'Tesla', label: 'Tesla' },
  { value: 'Toyota', label: 'Toyota' },
  { value: 'Volkswagen', label: 'Volkswagen' },
  { value: 'Volvo', label: 'Volvo' },
];

interface FormData {
  aracSahibi: string;
  aracPlaka: string;
  sasiNo: string;
  aracMarkası: string;
  aracModel: string;
  aracRengi: string;
  aracYılı: string;  // Tarih değeri string olarak tutulacak
  km:string;
}

const CarsPage = () => {
  const [isLoading, setIsLoading]=useState(false);
  const [message, SetMessage]=useState("");

  const [formData, setFormData] = useState<FormData>({
    aracSahibi: "",
    aracPlaka: "",
    sasiNo: "",
    aracMarkası: "",
    aracModel: "",
    km:"",
    aracRengi: "",
    aracYılı: "",  // Tarihi ISO formatında başlatıyoruz
  });

  const resetForm : ()=> void =() => {
    setFormData({
      aracSahibi:"",
      aracPlaka:"",
      sasiNo:"",
      aracMarkası:"",
      aracModel:"",
      aracRengi:"",
      aracYılı:"",
      km:"",
    })
  }

  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    setIsLoading(true); // Yüklenme durumunu başlatır
    SetMessage(""); // Önceki mesajı temizler
  
    try {
      const response = await axios.post("/member/Arac/CreateArac", formData);
      SetMessage("Kayıt Başarılı!");
      toast.success("Kayıt Başarılı!");
    } catch (error: any) {
      toast.error("Kayıt başarısız, lütfen tekrar deneyiniz!");
      if (error.response && error.response.data) {
        toast.error(`Hata: ${error.response.data.message}`)
      } else {
        toast.error("Bilinmeyen bir hata oluştu.");
      }
    } finally {
      setIsLoading(false); // Yüklenme durumunu kapatır
    }
  };

  return (
    <>
    <Navbar />
    <Grid container className='container' spacing={0}>
      <Grid item xs={12} className='left-side'>
        <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{display: 'flex', flexDirection:'column', gap:2, p:2}}
        >
          <Typography variant='h5' gutterBottom>
            Araç Tanıtım Ekranı
          </Typography>

            {/* Araç Sahibi */}
            <TextField
              id="aracSahibi"
              name="aracSahibi"
              label="Araç Sahibi Ad Soyad"
              value={formData.aracSahibi}
              onChange={handleInputChange}
            />
              {/* Araç Plaka */}
              <TextField
              id="aracPlaka"
              name="aracPlaka"
              label="Araç Plakası"
              value={formData.aracPlaka}
              onChange={handleInputChange}
            />
               {/* Şasi No */}
               <TextField
              id="sasiNo"
              name="sasiNo"
              label="Şasi No" 
              value={formData.sasiNo}
              onChange={handleInputChange}
            />
              {/* Araç Markası */}
            <TextField
              id="aracMarkası"
              name="aracMarkası"
              select
              label="Araç Markası"
              value={formData.aracMarkası}
              onChange={handleInputChange}
              helperText="Lütfen araç markasını seçiniz!"
            >
              {carsBrand.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
               {/* Araç Modeli */}
               <TextField
              id="aracModel"
              name="aracModel"
              label="Araç Modeli" 
              value={formData.aracModel}
              onChange={handleInputChange}
            />
               {/* Araç KM */}
               <TextField
              id="km"
              name="km"
              label="Km"
              value={formData.km}
              onChange={handleInputChange}
            />
               {/* Araç Rengi */}
               <TextField
              id="aracRengi"
              name="aracRengi"
              label="Araç Rengi"
              value={formData.aracRengi}
              onChange={handleInputChange}
            />
              {/* Araç Yılı */}
              <TextField
              id="aracYılı"
              name="aracYılı"
              label="Araç Yılı"
              value={formData.aracYılı}
              onChange={handleInputChange}
            />
          
        {/* Butonlar */}
        <div>
        <Button type="button" variant="contained" color="error" onClick={resetForm}>
                Formu Temizle
              </Button>
              <Button type="submit" variant="contained" color="success" disabled={isLoading}>
                {isLoading ? "Yükleniyor..." : "Kaydet"}
              </Button>
        </div>
        </Box>
      </Grid>

    </Grid>

    </>
  )
}

export default CarsPage