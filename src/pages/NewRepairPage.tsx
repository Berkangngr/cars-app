import  TextField  from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import axios from '../config/AxiosConfig';
import Navbar from '../components/Navbar';
import  useAuthStore  from '../zustand/authStore';


interface FormData {
  plakaNo: string;
  aracSahibi: string;
  aracSahibiTelefon: string;
  aracMarkası: string;
  aracModel: string;
  aracRenk: string;
  acıklama: string;
  ücret: number;
}


function NewRepairPage() {
const [userData, setUserData] = useState(null);

const [formData,  setFormData] = useState<FormData>({
  plakaNo:"",
  aracSahibi:"",
  aracSahibiTelefon:"",
  aracMarkası:"",
  aracModel:"",
  aracRenk:"",
  acıklama:"",
  ücret: 0,
})
  ;
  const [isLoading, setIsLoading]=useState(false);
  const [message, SetMessage]=useState("");
  const [isEditable, setIsEditable] = useState(true);

  //Input değişikliklerini yakalayan fonksiyon

  const handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    setIsLoading(true); // Yüklenme durumunu başlatır
    SetMessage(""); // Önceki mesajı temizler
  
    try {
      const response = await axios.post("/member/Islem/CreateIslem", formData);
      SetMessage("Kayıt Başarılı!");
      toast.success("Kayıt Başarılı!");
    } catch (error: any) {
      if (error.response && error.response.data) {
        toast.error(`Hata: ${error.response.data.message}`)
      } else {
        toast.error("Bilinmeyen bir hata oluştu.");
      }
      toast.error("Kayıt başarısız, lütfen tekrar deneyin.");
    } finally {
      setIsLoading(false); // Yüklenme durumunu kapatır
    }
  
  };

    // Plaka girilirken değeri yakalama

    const handlePlakaChange: (e:React.ChangeEvent<HTMLInputElement>) => void = async (e) => {
      const plakaNo = e.target.value;
      setFormData({ ...formData, plakaNo });
      
      const plakaRegex= /^(0[1-9]|[1-7][0-9]|8[01])((\s?[a-zA-Z]\s?)(\d{4,5})|(\s?[a-zA-Z]{2}\s?)(\d{3,4})|(\s?[a-zA-Z]{3}\s?)(\d{2,3}))$/
      const formattedPlaka = plakaNo.toUpperCase().replace(/\s/g, "");
    if (plakaRegex.test(formattedPlaka)) {
      try {
        const response = await axios.get(`/member/FirmaSahis/GetFirmaSahisList/${formattedPlaka}`);

        if (response.data) {
          setFormData({
            ...formData,
            aracSahibi: response.data.aracSahibi,
            aracSahibiTelefon: response.data.aracSahibiTelefon,
            aracMarkası: response.data.aracMarkası,
            aracModel: response.data.aracModel,
            aracRenk: response.data.aracRenk,
          });
          setIsEditable(false)
        }else{
          toast.warning("Bu plakaya ait kayıt bulunamadı araç kaydını yapınız.");
          resetForm();
          setIsEditable(false)
        }
      } catch (error) {
        console.log(error);
        toast.error("Kullanıcı bilgileri alınamadı!")
      }
    }  
}


  const resetForm: ()=> void =() => {
    setFormData({
      plakaNo: "",
      aracSahibi: "",
      aracSahibiTelefon: "",
      aracMarkası: "",
      aracModel: "",
      aracRenk: "",
      acıklama: "",
      ücret: 0,   
    })
  }
  
 

  return (
    <>
      <Grid container className="container" spacing={0}>
        <Grid item xs={12} className="left-side">
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}
          >
            <Typography variant="h5" gutterBottom>
              Yeni Araç Onarımı
            </Typography>
            {/* Plaka */}
            <TextField id="plakaNo" name="plakaNo" value={formData.plakaNo} onChange={handlePlakaChange} label="Plaka No" />

            {/* Araç Sahibi */}
            <TextField
              id="aracSahibi"
              name="aracSahibi"
              value={formData.aracSahibi}
              label="Araç Sahibi Ad Soyad"
              onChange={(e) => setFormData({ ...formData, aracSahibi: e.target.value })}
              disabled={isEditable}
            />

            {/* Araç Sahibi Telefon */}
            <TextField
              id="aracSahibiTelefon"
              name="aracSahibiTelefon"
              value={formData.aracSahibiTelefon}
              label="Araç Sahibi Telefon"
              onChange={(e) => setFormData({ ...formData, aracSahibiTelefon: e.target.value })}
              disabled={isEditable}
            />

            {/* Araç Markası */}
            <TextField
              id="aracMarkası"
              name="aracMarkası"
              value={formData.aracMarkası}
              label="Araç Markası"
              onChange={(e) => setFormData({ ...formData, aracMarkası: e.target.value})}
              disabled={isEditable}
            >
            </TextField>

            {/* Model */}
            <TextField 
            id="aracModel" 
            name="aracModel" 
            value={formData.aracModel} 
            onChange={(e) => setFormData({ ...formData, aracModel: e.target.value})} 
            disabled={isEditable}
            label="Model" />

            {/* Renk */}
            <TextField 
            id="aracRenk" 
            name="aracRenk" 
            value={formData.aracRenk} 
            onChange={(e) => setFormData({ ...formData, aracRenk: e.target.value })}
            disabled={isEditable} 
            label="Renk" />

              {/* Açıklama */}
              <TextField
          id="outlined-multiline-static"
          label="Açıklama"
          name='acıklama'
          value={formData.acıklama}
          onChange={handleInputChange}
          multiline
          rows={4}
          required
        />

        {/* Ücret */}

          {/* Renk */}
          <TextField 
            type='number'
            id="ücret" 
            name="ücret" 
            value={formData.ücret} 
            onChange={handleInputChange}
            label="Ücret" />
            {/* Butonlar */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button type="button" variant="contained" color="error" onClick={resetForm}>
                Formu Temizle
              </Button>
              <Button type="submit" variant="contained" color="success">
                Kaydet
              </Button>
            </Box>
            {message && <p>{message}</p>}
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default NewRepairPage;


