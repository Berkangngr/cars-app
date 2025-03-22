import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, useMediaQuery, IconButton, Stack } from '@mui/material';
import { toast } from 'react-toastify';
import newRepairPageService from '../services/NewRepairPageService';
import { useFormik } from 'formik';
import { newRepairPageSchema } from '../schemas/NewRepairSchema';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { GridColDef } from '@mui/x-data-grid';



let transactionType: string[] = ["Yağ Değişimi", "Parça Değişimi", "Bilinmiyor"];

function NewRepairPage() {
  const [selectedTransactionType, setSelectedTransactionType] = useState("Bilinmiyor");
  const [workOrder, setWorkOrde] = useState([]);
 

  const isSmallScreen = useMediaQuery('(max-width:1366px)'); // Küçük ekranlar
  const isLargeScreen = useMediaQuery('(min-width:1920px)'); // Büyük ekranlar

  const submit = async (values: any, actions: any) => {
    try {
      

      const requestData = {
        PlakaNo: values.PlakaNo,
        SasiNo:  values.SasiNo,
        MüsteriIsmi : values.MüsteriIsmi,
        KayıtlıAraclar: values.KayıtlıAraclar,
        BakımKm:values.BakımKm,
        Detay: values.Detay,
      }



      const response = await newRepairPageService.workOrder(requestData);
      console.log(requestData);
      if (response) {
        clear();
        toast.success("İş emri açıldı.");
      }
    } catch (error) {
      toast.error("İş emri kaydedilirken hata oluştu.");
    }
  };

  const { values, handleSubmit, handleChange, errors, resetForm, setFieldValue } = useFormik({
    initialValues: {
      PlakaNo: "",
      SasiNo: "",
      MüsteriIsmi: "",
      KayıtlıAraclar: "",
      BakımKm: "",
      Detay: [
        { IslemTürü: '', MalzemeFiyat: null, IscilikFiyat: null, Açıklama: '', ToplamFiyat: 0 },
      ],
    },
    onSubmit: submit,
    validationSchema: newRepairPageSchema
  });

  const clear = () => {
    resetForm();
  };

  const [isEditable, setIsEditable] = useState(true);

  // İşlem Türü Seçme Fonksiyonu
  // const handleChangeTransactionType = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectedType = e.target.value;
  //   console.log("Seçilen İşlem:", selectedType);
  //   setSelectedTransactionType(selectedType);
  // };

  

  useEffect(() => {
    values.Detay.forEach((_, index) => {
      setFieldValue(`Detay[${index}].ToplamFiyat`, 
        Number(values.Detay[index].MalzemeFiyat) + Number(values.Detay[index].IscilikFiyat)
      );
    });
  }, [values.Detay]); // Detay dizisi değiştikçe otomatik hesaplama yapar
  

  const handleAddInputButton = () => {
    const newDetay = {
      IslemTürü: '',
      MalzemeFiyat: null,
      IscilikFiyat: null,
      Açıklama: '',
      ToplamFiyat: null
    };
    setFieldValue('Detay', [...values.Detay, newDetay]);
  };

  const handleDeleteInputButton = (index: number) => {
    if (values.Detay.length > 1) {
      const newDetay = [...values.Detay];
      newDetay.splice(index, 1); // İlgili index'teki öğeyi kaldır
      setFieldValue("Detay", newDetay);
    } else {
      toast.warn("En az bir işlem satırı kalmalı!");
    }
  };

  //Table Yapısı
  
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 50},
    { field: 'PlakaNo', headerName: 'Plaka No', width: 125 },
    { field: 'SasiNo', headerName: 'Şasi No', width: 125 },
    { field: 'MüsteriIsmi', headerName: 'Müşteri Adı/Soyadı', width: 125 },
    { field: 'KayıtlıAraclar', headerName: 'Araç', width: 125 },
    { field: 'BakımKm', headerName: 'Bakım Km', width: 125 },
    { field: 'Detay.IslemTürü', headerName: 'İşlem Türü', width: 125 },
    { field: 'Detay.MalzemeFiyat', headerName: 'Malzeme Tutar', width: 125 },
    { field: 'Detay.IscilikFiyat', headerName: 'işçilik Tutar', width: 125 },
    { field: 'Detay.ToplamFiyat', headerName: 'Toplam Tutar', width: 125 },
    { field: 'Detay.Açıklama', headerName: 'Açıklama', width: 125 },
  ];

  
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
              {/* Plaka */}
              <Grid item sx={{ flexGrow: 1, minWidth: 150 }}>
                <TextField
                  id="PlakaNo"
                  name="PlakaNo"
                  value={values.PlakaNo.toUpperCase()}
                  onChange={handleChange}
                  helperText={errors.PlakaNo && <span style={{ color: 'red', fontSize: '10px' }}>{errors.PlakaNo}</span>}
                  label="Plaka No"
                  sx={{ flex: '1 1 calc(25% - 16px)' }}
                />
              </Grid>

              {/* Şasi No */}
              <Grid item sx={{ flexGrow: 1, minWidth: 150 }}>
                <TextField
                  id="SasiNo"
                  name="SasiNo"
                  value={values.SasiNo.toUpperCase()}
                  label="Şasi No"
                  onChange={handleChange}
                  helperText={errors.SasiNo && <span style={{ color: 'red', fontSize: '10px' }}>{errors.SasiNo}</span>}
                  sx={{ flex: '1 1 calc(25% - 16px)' }}
                />
              </Grid>

              {/* Araç Sahibi */}
              <Grid item sx={{ flexGrow: 1, minWidth: 150 }}>
                <TextField
                  id="MüsteriIsmi"
                  name="MüsteriIsmi"
                  value={values.MüsteriIsmi}
                  label="Araç Sahibi"
                  onChange={handleChange}
                  // disabled={isEditable}
                  sx={{ flex: '1 1 calc(25% - 16px)' }}
                />
              </Grid>

              {/* Kayıtlı Araçlar */}
              <Grid item sx={{ flexGrow: 1, minWidth: 150 }}>
                <TextField
                  id="KayıtlıAraclar"
                  name="KayıtlıAraclar"
                  value={values.KayıtlıAraclar}
                  label="Kayıtlı Araçlar"
                  onChange={handleChange}
                  sx={{ flex: '1 1 calc(25% - 16px)' }}
                />
              </Grid>

              {/* Bakım Km */}
              <Grid item sx={{ flexGrow: 1, minWidth: 150 }}>
                <TextField
                  id="BakımKm"
                  name="BakımKm"
                  value={values.BakımKm}
                  onChange={handleChange}
                  type="number"
                  sx={{ flex: '1 1 calc(25% - 16px)' }}
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
        {values.Detay.map((item, index) => (
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
                  id={`IslemTürü-${index}`}
                  name={`Detay[${index}].IslemTürü`}
                  select
                  value={item.IslemTürü}
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
                  name={`Detay[${index}].MalzemeFiyat`}
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
                  id={`IscilikFiyat-${index}`}
                  name={`Detay[${index}].IscilikFiyat`}
                  value={item.IscilikFiyat}
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
                  name={`Detay[${index}].ToplamFiyat`}
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
                  id={`Açıklama-${index}`}
                  name={`Detay[${index}].Açıklama`}
                  value={item.Açıklama}
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