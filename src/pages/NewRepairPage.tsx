/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Autocomplete, Box, Button, Grid, IconButton, Stack } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
//import { GridColDef } from '@mui/x-data-grid';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../config/AxiosConfig';
import { newRepairPageSchema } from '../schemas/NewRepairSchema';
import newRepairPageService from '../services/NewRepairPageService';
import { setGlobalLoading } from '../utils/globalLoading';








const transactionType: string[] = ["Yağ Değişimi", "Parça Değişimi", "Bilinmiyor"];

function NewRepairPage() {
  const [plakaNoList, setPlakaNoList] = useState<any[]>([]); // Get apisi ile çektiğim tüm plakaları buraya yazacağım.
  //const [processList, setProcessList] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
 // const [selectedTransactionType, setSelectedTransactionType] = useState("Bilinmiyor");
  //const [workOrder, setWorkOrder] = useState([]);
   //const isSmallScreen = useMediaQuery('(max-width:1366px)'); // Küçük ekranlar
  //const isLargeScreen = useMediaQuery('(min-width:1920px)'); // Büyük ekranlar



 




// İş Emri Oluşturma Fonksiyonu
  // İş emri oluşturma işlemi için form verilerini alır ve API'ye gönderir
  const submit = async (values: any, actions: any) => {
    let requestData;

    if (plakaNoList.length > 0 ) {
      const selected = plakaNoList[0];
      const currentYear = new Date().getFullYear();

       requestData = {
        FirmaSahisId: selected.a.FirmaSahisId,
        AppUserID: selected.a.AppUserID,
        Yil: currentYear,
        BakimKM: values.BakimKM,
        Tarih: new Date().toISOString(),
        Detaylar: values.Detaylar.map((item: any) => ({
          islemTur: item.islemTur,
          MalzemeFiyat: item.MalzemeFiyat,
          iscilikFiyat: item.iscilikFiyat,
          islemAciklama: item.islemAciklama,
          ToplamFiyat: item.ToplamFiyat,
          FirmaSahisId: selected.a.FirmaSahisId,
          AracId: selected.a.ID,
          AppUserID: selected.a.AppUserID,
        })), 
      };
    }

    setGlobalLoading(true)
    try {
      if (!requestData) {
        throw new Error("Plaka verisi yok!");
      }
      const response = await newRepairPageService.workOrder(requestData);
      console.log(requestData);
      // getAllProcessData(); // İşlem verilerini güncelle
      if (response) {
        actions.resetForm();
        toast.success("İş emri açıldı.");
      }
    } catch (error) {
      toast.error("İş emri kaydedilirken hata oluştu.");
    }finally{
      setGlobalLoading(false)
    }
  };

  // Bütün işlemleri çekme fonksiyonu.
  
    // const getAllProcessData = async () => {
    //   try {
    //     const response = await axios.get("/Member/islemNew/GetIslemDetailsById%2F1t");
    //     setProcessList(response.data);
    //     console.log("İşlemler:", response.data);
    //   } catch (error) {
    //     toast.error("İşlemler alınırken hata oluştu.");
    //     console.error("İşlemler alınırken hata:", error);
    //   }
    // };

    // useEffect(() => {
    //   getAllProcessData();
    // }, []);
    
 



  

  const { values, handleSubmit, handleChange, errors, resetForm, setFieldValue } = useFormik({
    initialValues: {
      PlakaNo: "",
      SasiNo: "",
      MüsteriIsmi: "",
      BakimKM: "",
      Detaylar: [
        { islemTur: '', MalzemeFiyat: null, iscilikFiyat: null, islemAciklama: '', ToplamFiyat: 0 },
      ],
    },
    onSubmit: submit,
    validationSchema: newRepairPageSchema
  });

 

  const [isEditable, ] = useState(true);

  // İşlem Türü Seçme Fonksiyonu
  // const handleChangeTransactionType = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedType = e.target.value;
  //   console.log("Seçilen İşlem:", selectedType);
  //   setSelectedTransactionType(selectedType);
  // };


  // Plakaya göre verileri çekme
  useEffect(() => {
    if (!inputValue || inputValue.length < 2) {
      setPlakaNoList([]);
      return;
    }
  
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/Arac/AracListeWithPlakaOrFirma?searchplakaorfirma=${inputValue}`);
        console.log(response.data);
        setPlakaNoList(response.data);
      } catch (error) {
        console.log("Hata!", error);
      }
    };
    
    const delayDebounce = setTimeout(fetchData, 500);
    return () => clearTimeout(delayDebounce);
  }, [inputValue]); 


  
// Hesaplama işlemi yapan fonksiyon
// Detay dizisindeki her bir öğe için toplam fiyatı hesaplar  

  useEffect(() => {
    values.Detaylar.forEach((_, index) => {
      setFieldValue(`Detaylar[${index}].ToplamFiyat`, 
        Number(values.Detaylar[index].MalzemeFiyat) + Number(values.Detaylar[index].iscilikFiyat)
      );
    });
  }, [values.Detaylar]); // Detay dizisi değiştikçe otomatik hesaplama yapar




  

  const handleAddInputButton = () => {
    const newDetay = {
      islemTur: '',
      MalzemeFiyat: null,
      iscilikFiyat: null,
      islemAciklama: '',
      ToplamFiyat: null
    };
    setFieldValue('Detaylar', [...values.Detaylar, newDetay]);
  };

  const handleDeleteInputButton = (index: number) => {
    if (values.Detaylar.length > 1) {
      const newDetay = [...values.Detaylar];
      newDetay.splice(index, 1); // İlgili index'teki öğeyi kaldır
      setFieldValue("Detaylar", newDetay);
    } else {
      toast.warn("En az bir işlem satırı kalmalı!");
    }
  };


  //Table Yapısı
  
  // const columns: GridColDef[] = [
  //   { field: 'id', headerName: 'ID', width: 50},
  //   { field: 'PlakaNo', headerName: 'Plaka No', width: 125 },
  //   { field: 'SasiNo', headerName: 'Şasi No', width: 125 },
  //   { field: 'MüsteriIsmi', headerName: 'Müşteri Adı/Soyadı', width: 125 },
    
  //   { field: 'BakımKm', headerName: 'Bakım Km', width: 125 },
  //   { field: 'Detay.IslemTürü', headerName: 'İşlem Türü', width: 125 },
  //   { field: 'Detay.MalzemeFiyat', headerName: 'Malzeme Tutar', width: 125 },
  //   { field: 'Detay.IscilikFiyat', headerName: 'işçilik Tutar', width: 125 },
  //   { field: 'Detay.ToplamFiyat', headerName: 'Toplam Tutar', width: 125 },
  //   { field: 'Detay.Açıklama', headerName: 'Açıklama', width: 125 },
  // ];

  
  // const rows = workOrder.map((customer,index) => ({
  //   id: workOrder.id,
  //   'Şahıs/Müşteri_İsmi': customer.Adi,
  //   Adres: customer.Adres,
  //   Telefon: customer.Telefon,
  //   Email: customer.Email,
  //   VergiNo: customer.VergiNo,
  //   Tc: customer.TC,
  //   PostaNo: customer.PostaNo,
  //   Şehir: customer.SehirId,
  //   Ülke: customer.UlkeId,
  //   Tur: customer.Tur,
  // }));



  return (
    <>
      <Grid >
        <Grid item xs={12} >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              direction: 'row',
              display: 'flex',
              wrap: "nowrap",
              alignItems: 'flex-start',
              justifyContent: 'center',
              p: 2,
              m: 2,
              bgcolor: 'background.paper',
              maxHeight: '100vh',
              borderRadius: 1,
              gap: 2,
              
            }}
          >
            <Grid container spacing={2}>
               {/* Plaka No */}
               <Grid item xs={12} sm={6} md={3}>
               <Autocomplete
                  options={plakaNoList}
                  getOptionLabel={(option) => option?.a?.Plaka ?? ''}
                  value={plakaNoList.find(item => item?.a?.Plaka === values.PlakaNo) || null}
                  inputValue={inputValue}
                  onChange={(_event, newValue) => {
                    // Bir plaka seçildiğinde, formik state'ine sadece plaka numarasını kaydet
                    setFieldValue("PlakaNo", newValue?.a?.Plaka || '');
                    
                    // İsterseniz diğer alanları da otomatik doldurun
                    if (newValue) {
                      setFieldValue("SasiNo", newValue.a?.SasiNo || '');
                      setFieldValue("MüsteriIsmi", newValue.FirmaSahis?.Adi || '');
                      // Diğer alanlar...
                    }
                  }}
                  onInputChange={(_event, newInputValue) => {
                    setInputValue(newInputValue.toUpperCase());
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Plaka No"
                      id="PlakaNo"
                      name="PlakaNo"
                      helperText={errors.PlakaNo && <span style={{ color: "red", fontSize: "10px" }}>{errors.PlakaNo}</span>}
                      fullWidth
                    />
                  )}
                />
              </Grid>
              

              {/* Şasi No */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  id="SasiNo"
                  name="SasiNo"
                  value={values.SasiNo.toUpperCase()}
                  label="Şasi No"
                  onChange={handleChange}
                  disabled={isEditable}
                  helperText={errors.SasiNo && <span style={{ color: 'red', fontSize: '10px' }}>{errors.SasiNo}</span>}
                  fullWidth
                />
              </Grid>

              {/* Araç Sahibi */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  id="MüsteriIsmi"
                  name="MüsteriIsmi"
                  value={values.MüsteriIsmi}
                  label="Araç Sahibi"
                  onChange={handleChange}
                  disabled={isEditable}
                  fullWidth
                />
              </Grid>

             

              {/* Bakım Km */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  id="BakimKM"
                  name="BakimKM"
                  value={values.BakimKM}
                  onChange={handleChange}
                  type="number"
                  fullWidth
                  label="Bakım Km"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Detay ekleme alanları */}
          <Box  sx={{ pt:2, pr:4, pl:2, m: 2, bgcolor: "background.paper", display: "flex" }}>
            
            <Grid container spacing={2} alignItems="center" wrap="nowrap">
              {/* Input Alanları - Hepsi tek satıra sığacak şekilde */}
              <Stack  spacing={2} sx={{ width: "100%" }}> {/* ALT ALTA EKLEMEYİ SAĞLAR */}
        {values.Detaylar.map((item, index) => (
          <Box
            key={index}
            sx={{
              m:2,
              p:2,
              display : "flex",
              bgcolor: "background.paper",
              boxShadow: 2,
              borderRadius: 2,
              width: "100%",
              wrap:"nowrap"
            }}
          >
            <Grid container spacing={2} alignItems="center">

                           {/* Add Icon Butonu */}
                           <Grid item>
              <IconButton id={`${index + 1}`} aria-label="add" size="large" onClick={handleAddInputButton}>
                <AddIcon fontSize="inherit" />
              </IconButton>
              </Grid>

              <Grid item>
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => handleDeleteInputButton(index)}
                >
                  <RemoveIcon fontSize="inherit" />
                </IconButton>
              </Grid>
              {/* İşlem Türü */}
              <Grid item sx={{ flexGrow: 1, minWidth: 150 }}>
                <TextField
                  id={`islemTur-${index}`}
                  name={`Detaylar[${index}].islemTur`}
                  select
                  value={item.islemTur}
                  onChange={handleChange}
                  fullWidth
                  label="İşlem Türü"
                >
                  {transactionType.map((type, idx) => (
                    <MenuItem key={idx} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {/* Malzeme Tutarı */}
              <Grid item sx={{ flexGrow: 1, minWidth: 120 }}>
                <TextField
                  id={`MalzemeFiyat-${index}`}
                  name={`Detaylar[${index}].MalzemeFiyat`}
                  value={item.MalzemeFiyat}
                  type="number"
                  onChange={handleChange}
                  fullWidth
                  label="Malzeme Tutar"
                />
              </Grid>

              {/* İşçilik Tutarı */}
              <Grid item sx={{ flexGrow: 1, minWidth: 120 }}>
                <TextField
                  id={`iscilikFiyat-${index}`}
                  name={`Detaylar[${index}].iscilikFiyat`}
                  value={item.iscilikFiyat}
                  type="number"
                  onChange={handleChange}
                  fullWidth
                  label="İşçilik Tutar"
                />
              </Grid>

              {/* Toplam Tutar */}
              <Grid item sx={{ flexGrow: 1, minWidth: 120 }}>
                <TextField
                  id={`ToplamFiyat-${index}`}
                  name={`Detaylar[${index}].ToplamFiyat`}
                  value={item.ToplamFiyat}
                  type="number"
                  fullWidth
                  disabled
                  label="Toplam Tutar"
                />
              </Grid>

             {/* Açıklama */}
             <Grid item sx={{ flexGrow: 2, minWidth: 200 }}>
                <TextField
                  id={`islemAciklama-${index}`}
                  name={`Detaylar[${index}].islemAciklama`}
                  value={item.islemAciklama}
                  onChange={handleChange}
                  fullWidth
                  label="Açıklama"
                />
              </Grid>
            </Grid>
          </Box>  
      ))}
      </Stack>
            </Grid>
          </Box>

          {/* Formu kayıt etme veya test etme alanı */}
          <Grid item xs={12}>
            <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ display: 'flex', justifyContent: 'center', gap: 2, margin: 2 }}>
              <Button type="button" variant="contained" color="error" onClick={() => resetForm()}>
                Formu Temizle
              </Button>
              <Button   type="submit" variant="contained" color="success">
                Kaydet
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default NewRepairPage;