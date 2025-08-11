/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import { Autocomplete, Box, Button,  Dialog, Grid,  ListItem, Switch, TextField, Typography, useMediaQuery } from '@mui/material';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from "react-to-print";
import { toast } from 'react-toastify';
import axios from '../config/AxiosConfig';
import { setGlobalLoading } from '../utils/globalLoading';










//const paginationModel = { page: 0, pageSize: 10 };



interface FormData {
  ID: number;
  Adi: string;
  Araç: string;
  Tarih: string;
  islemTur: string;
  BakimKM: number;
  Plaka: string;
  ToplamFiyat: number;
  Statu: null;
  MalzemeFiyat: number;
  IscilikFiyat: number;
  islemAciklama: string;
  islemdetayid: number;
  AracId: number;
  Marka:string;
  Model:string;
  IslemId:number;
  islemYilNo:string;
  IslemDetaylar?: IslemDetay[];
}

interface IslemDetay {
        DetayId: number,
        MalzemeFiyat: number,
        IscilikFiyat: number,
        ToplamFiyat: number,
        islemAciklama: string,
        AracId: number,
        Plaka: string,
        Marka: string,
        Model: string,
        Statu: number,
        islemTur:string,
}

interface userData {
  FirstName: string;
  LastName: string;
  Password: string;
  Image: null;
  ImagePath: string;
  Email: string;
  UserName: string;
  Statu: boolean;
}
interface ProcessData {
  IslemDetaylar?: IslemDetay[];
  islemYilNo: string;
  Tarih: string;
  Adi: string;
  Marka: string;
  Model: string;
  Plaka: string;
  BakımKM: number;
  ID:number;
  islemTur:string;
}





interface OptionType {
  Adi: string;
  id: number;
}




function Dashboard() {
const isSmallScreen = useMediaQuery('(max-width:1366px)'); // Küçük ekranlar
const isLargeScreen = useMediaQuery('(min-width:1920px)'); // Büyük ekranlar
const [, setSelectedRow] = useState<any[]>([]);
const [, setOpen] = useState(false);
const handleClose = () => {
    setOpen(false);
    resetForm();
  }
const [printDetailOpen, setPrintDetailOpen] = useState(false);
const handleOpenDetail = () => setPrintDetailOpen(true);
const handleCloseDetail = () => setPrintDetailOpen(false);
const [filteredData, setFilteredData] = useState<FormData[]>([]); // Filtrelenmiş tablo verisi
const [inputValue, setInputValue] = useState(""); // Autocomplete için input değeri
const [processData, setProcessData] = useState<FormData[]>([]); // İŞLEM VERİLERİ
const [processFormData, setProcessFormData] = useState<FormData>({
  ID: 0,
  Adi: "",
  Araç: "",
  Tarih: "",
  islemTur: "",
  BakimKM: 0,
  Plaka: "",
  ToplamFiyat: 0,
  Statu: null as any,
  MalzemeFiyat: 0,
  IscilikFiyat: 0,
  islemAciklama: "",
  islemdetayid: 0,
  AracId: 0,
  Marka:"",
  Model:"",
  IslemId:0,
  islemYilNo:""
});
const [selectedDetails, setSelectedDetails] = useState<IslemDetay[]>([]);
const [userData, setUserData] = useState<userData>(); // Kullanıcı verileri
const [checked, setChecked] = useState(false);
const [selectedIdProcessData,setSelectedIdProcessData] = useState<ProcessData>({
  islemYilNo: "",
  Tarih: "",
  Adi: "",
  Marka: "",
  Model: "",
  Plaka: "",
  BakımKM: 0,
  ID:0,
  islemTur:""
}); // Seçilen işlem kodu


// Detay ekranı switch fonksiyonu
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setChecked(event.target.checked);
}

// İşlemleri ekrana çekme.
const fetchProcess = async () => {
  setGlobalLoading(true)
  try {
    const response = await axios.get(`/api/islemNew/GetIslemlerDetaylı`);
    const inComingData = response.data;
    console.log("Test state veri:", inComingData);
    if (Array.isArray(inComingData)) {
      setProcessData(inComingData);
      setFilteredData(inComingData); // Bu satır önemli!
      console.log(inComingData);
      console.log("İşlem verileri:", filteredData);
    } else {
      console.log("Veri bir array değil:", inComingData);
    }
  } catch (error) {
    console.log("Hata:", error);
    toast.error("Veri alınırken bir hata oluştu.");
  }finally {
    setGlobalLoading(false)
  }
}

  useEffect(() => {
    fetchProcess();
  }, []); 
 

const options: OptionType[] = processData.map(item => ({ Adi: item.Adi, id: item.ID }));

//Kullanıcı verilerini alma
const handleUserData = async () => {
  try {
      const response = await axios.get('/api/UserSetting/Setting');
      setUserData(response.data);
      console.log("Kullanıcı verileri:", response.data);
  } catch (error) {
    toast.error("Kullanıcı verileri alınırken bir hata oluştu.");
    console.log("Error fetching user data:", error);
  }

}
useEffect(() => {
  handleUserData(); // Kullanıcı verilerini al
},[])


const resetForm = () => {
  setProcessFormData({
    ID:0,
    Adi: "",
    Araç: "",
    Tarih: "",
    islemTur: "",
    BakimKM: 0,
    Plaka: "",
    ToplamFiyat: 0,
    Statu: null as any,
    AracId: 0,
    MalzemeFiyat: 0,
    IscilikFiyat: 0,
    islemAciklama: "",
    islemdetayid: 0,
    Marka:"",
    Model:"",
    IslemId:0,
    islemYilNo:""
  })
}

//İşlem tamamlama fonksiyonu
const handleDoneProcess = async (id: number) => {
    const isConfirmed = confirm("İşlem tamamlanacak. Devam etmek istiyor musunuz?");
  if (!isConfirmed) {
    return; // Kullanıcı onay vermezse işlemi iptal et
  }
  try {
     await axios.post(`/api/islemNew/OkislemD`, id, {
      headers: {
        "Content-Type" : "application/json",
      },
    })
    toast.success("İşlem Tamamlandı");
    fetchProcess();
  } catch (error) {
    toast.error("İşlem güncellenirken bir hata oluştu.");
  }
  

}

 //İşlem silme fonksiyonu olacak
  const handleDeleteProcess = async (id: number) => {
    console.log(id)
    const isConfirmed = confirm("İşlem silinecek. Devam etmek istiyor musunuz?");
    if (!isConfirmed) {
      return; // Kullanıcı onay vermezse işlemi iptal et
    }
  
    // Silme işlemi için API çağrısı yapın
    try {
        const response = await axios.post(`/api/islemNew/DeleteIslemD`, id, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          console.log("İşlem silindi:", response.data);
          setProcessData((prevData) => prevData.filter((process) => process.ID !== id)); // Silinen aracı listeden çıkarın
          toast.success("Araç silindi.");
          fetchProcess() // Verileri güncelleyin
          
        } else {
          console.log("İşlem silinemedi:", response.data);
          toast.error("İşlem silinemedi.");
        }
        
    } catch (error) {
      console.log("İşlem silinirken hata oluştu", error);
      toast.error("İşlem silinirken bir hata oluştu.");
      
    }
  }




// Form submit işlemi - DÜZGÜN HALİ
const processHandleSubmit = async () => {
  console.log("FormData ID:", processFormData.ID);
 

  try {
    const updateData = {
      ID: selectedIdProcessData.ID,
      Detaylar: selectedDetails.map(detail => ({
        ID: detail.DetayId,
        islemAciklama: detail.islemAciklama,
        iscilikFiyat: detail.IscilikFiyat,
        MalzemeFiyat: detail.MalzemeFiyat,
        ToplamFiyat: detail.ToplamFiyat,
        islemTur: detail.islemTur,
        
      }))
    }
    console.log("Güncellenen veri:", updateData);
    
    const response = await axios.post(
      `/api/islemNew/UpdateIslemDetaylı`,
      updateData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      toast.success("İşlem başarıyla güncellendi");
      handleClose();
      fetchProcess();
    } else {
      toast.error(response.data.message || "Güncelleme başarısız");
    }
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    toast.error("İşlem güncellenirken bir hata oluştu");
  }
};

//Güncellemede toplam fiyatı hesaplama
// const handlePriceChange = (field: 'MalzemeFiyat' | 'IscilikFiyat', value: number) => {
//   const newFormData = {
//     ...processFormData,
//     [field]: value,
//     ToplamFiyat: processFormData.MalzemeFiyat + processFormData.IscilikFiyat
//   };
  
//   // Eğer değişen alan zaten yeni değerle güncellenmişse:
//   if (field === 'MalzemeFiyat') {
//     newFormData.ToplamFiyat = value + processFormData.IscilikFiyat;
//   } else {
//     newFormData.ToplamFiyat = processFormData.MalzemeFiyat + value;
//   }

//   setProcessFormData(newFormData);
// };

// İşlem detayı fonksiyonu
const handleInfoProcess = async (id: number) => {
  console.log("Seçilen İşlem Detayı:", id);
  const selectedItem = filteredData.find((data) => data.ID === id);
  if(selectedItem) {
    setSelectedDetails(selectedItem.IslemDetaylar ?? []);
    setSelectedIdProcessData({
      islemYilNo: selectedItem.islemYilNo,
      Tarih: selectedItem.Tarih,
      Adi: selectedItem.Adi,
      Marka: selectedItem.Marka,
      Model: selectedItem.Model,
      Plaka: selectedItem.Plaka,
      BakımKM: selectedItem.BakimKM,
      ID: selectedItem.ID,
      islemTur:selectedItem.islemTur,
    });
    setSelectedRow([id]);
    handleOpenDetail();
    console.log("Seçilen İşlem Detayları:", selectedItem.IslemDetaylar);
  }
  console.log(selectedItem?.IslemDetaylar, "Seçilen İşlem Detayları");
}



// Yazdırma Fonksiyonları
const contentRef = useRef<HTMLDivElement>(null);
const reactToPrintFn = useReactToPrint({ contentRef });

//Pdf indirme fonksiyonu
const saveAsPDF = async () => {
  if (!contentRef.current) {
    alert('İçerik henüz yüklenmedi, lütfen tekrar deneyin.');
    return;
  }
  
  try {
    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`islem-detaylari-${processFormData.Plaka || 'dokuman'}.pdf`);
  } catch (error) {
    console.error('PDF oluşturma hatası:', error);
    alert('PDF oluşturulurken bir hata oluştu.');
  }
};


const columns: GridColDef[] = [
  
  {field:'islemYilNo', headerName: 'İşlem Kodu', width:150, flex:1, headerAlign:'center', align:'center'},
  { field: 'Müşteri', headerName: 'Müşteri İsmi',  width:150, flex:1, headerAlign: 'center', align: 'center' },
  { field: 'Marka', headerName: 'Marka',  width:150, flex:1, headerAlign: 'center' , align: 'center' },
  { field: 'Model', headerName: 'Model',  width:150, flex:1, headerAlign: 'center' , align: 'center' },
  {field: 'Tarih', headerName: 'Tarih', type: 'string',  width:150, flex:1,headerAlign: 'center' , align: 'center'},
  
  { field: 'Plaka', headerName: 'Plaka',  width:150, flex:1, headerAlign: 'center' , align: 'center' },
  {field: 'ToplamFiyat', headerName: 'Toplam Fiyat', type: 'number',  width:150, flex:1, headerAlign: 'center', align: 'center' },
  {field: 'Statu', headerName: 'Durum',  width:150, flex:1, headerAlign: 'center', align: 'center',
     renderCell: (params) => {
    const statu = params.value; // params.row.Statu yerine params.value kullanın
    let backgroundColor = '';
    let statusText = '';
    let textColor = '';
    let fontSize = '';
    let fontWeight = '';
    let padding = '';
    let borderRadius = '';

    switch (statu) {
      case 1:
        backgroundColor = '#fbdbd0';
        textColor = '#8c552e';
        fontSize = '16px';
        fontWeight = 'bold';
        statusText = 'Devam Ediyor';
        padding = '8px';
        borderRadius = '4px';
        break;
      case 2:
        backgroundColor = '#fdffab';
        textColor = '#8c552e';
        fontSize = '16px';
        fontWeight = 'bold';
        statusText = 'Güncellendi';
        padding = '8px';
        borderRadius = '4px';
        break;
      case 4:
        backgroundColor = '#74fbdd';
        textColor = '#0e7957';
        fontSize = '16px';
        fontWeight = 'bold';
        statusText = 'Tamamlandı';
        padding = '8px';
        borderRadius = '4px';
        break;
      default:
        backgroundColor = '#e0e0e0'; // Varsayılan renk
        statusText = 'Bilinmiyor';
        padding = '8px';
        borderRadius = '4px';
        
    }

    return (
      <div
        style={{
          backgroundColor,
          color: textColor,
          padding,
          borderRadius,
          display: 'inline-block', 
          whiteSpace: 'nowrap',
          fontSize,
          fontWeight,
          
          

        }}
      >
        {statusText}
      </div>
    );
  },},
  {field: 'actions', headerName: 'İşlemler',width: 150, flex:1, headerAlign:'center', align: 'left', sortable: false,renderCell: (params) => (
    <div style={{ width:'300px', display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <InfoOutlineIcon
            titleAccess= 'İşlem Detayı'
            onClick={() => handleInfoProcess(params.row.ID)}
            style={{cursor: 'pointer',marginTop:'15px', color:'#c54c82', fontSize:'20px',opacity:'0.8'}}
            />
          </div>
            <div>
      <DoneAllIcon
      titleAccess='İşlemi Tamamla'
      onClick={() => handleDoneProcess(params.row.ID)}
      style={{ cursor: 'pointer', marginLeft:'5px',marginTop:'15px', color:'green', fontSize:'20px',opacity:'0.8' } }>
      </DoneAllIcon>
      </div>
      <div>
      <DeleteIcon
      titleAccess='İşlemi Sil'
      onClick={() => handleDeleteProcess(params.row.ID)}
      style={{ cursor: 'pointer',  marginLeft:'5px',marginTop:'15px', color:'red', fontSize:'20px',opacity:'0.8' } }>
      </DeleteIcon>
      </div>
    </div> )}
];



const rows = filteredData.map((data) => ({
  islemYilNo: data.islemYilNo,
  ID: data.ID,
  id: data.ID,
  Müşteri: data.Adi,
  Marka: data.Marka,
  Model: data.Model,
  Tarih: data.Tarih,
  // islemTur: data.islemTur,
  // islem : data.islemAciklama,
  Statu: data.Statu,
  // KM: data.BakimKM,
  Plaka: data.Plaka,
  ToplamFiyat: data.ToplamFiyat,
  
}));

 


const paginationModel = { page: 0, pageSize:10};

  return (

<div>
  

     <Grid container spacing={2} sx={{ marginTop: "4px", marginBottom: "15px", marginLeft:"5px", padding:"15px" }}>
  <Grid item xs={12} md={6} lg={4}> {/* Responsive genişlik */}
    <Autocomplete
      freeSolo
      options={options.filter(option => 
     option.Adi.toLowerCase().includes(inputValue.toLowerCase())
      )}
      getOptionLabel={(option) => {
        if (typeof option === 'string') {
          return option;
        }
        return option?.Adi || "";
      }}
      inputValue={inputValue}
      onInputChange={(_event, newValue) => {
        setInputValue(newValue);
        if (newValue.trim() === "") {
          setFilteredData(processData);
        } else {
          const filtered = processData.filter(item => 
            item.Adi.toLowerCase().includes(newValue.toLowerCase())
          );
          setFilteredData(filtered);
        }
      }}

      
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="Müşteri İsmi İle Ara" 
          fullWidth
        />
        
      )}

    />
    
  </Grid>
</Grid>


          {/* Detay Card */}
        <Grid>
  <Dialog
  open={printDetailOpen}
  onClose={handleCloseDetail}
  maxWidth="lg"
  fullWidth
  PaperProps={{
    sx: {
      width: '90%',
      maxWidth: '1000px',
      borderRadius: '12px',
      overflow: 'hidden',
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column',
      
    }
  }}
>
  {/* Scrollable Content Area */}
  <Box sx={{ 
    p: 4,
    overflow: 'auto',
    flex: 1
  }} ref={contentRef}>
    
    {/* Header Section */}
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 4,
      flexWrap: 'wrap'
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          fontWeight: 'bold',
          fontSize: { xs: '32px', md: '50px' },
          flex: 1,
          textAlign: 'center',
          mb: { xs: 2, md: 0 }
        }}
      >
        {userData ? `${userData.FirstName.toLocaleUpperCase()}` : "Yükleniyor..."}
      </Typography>
      
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        <strong>İşlem Kodu:</strong> {selectedIdProcessData.islemYilNo || "N/A"}
      </Typography>
    </Box>

    {/* Customer Details Grid */}
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} md={6} lg={4}>
        <ListItem sx={{ p: 0 }}>
          <Typography component="span" sx={{ minWidth: '120px', display: 'inline-block', fontWeight: 'bold' }}>Müşteri Adı:</Typography>
          {selectedIdProcessData.Adi}
        </ListItem>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <ListItem sx={{ p: 0 }}>
          <Typography component="span" sx={{ minWidth: '120px', display: 'inline-block', fontWeight: 'bold' }}>Aracın Km:</Typography>
          {selectedIdProcessData.BakımKM}
        </ListItem>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <ListItem sx={{ p: 0 }}>
          <Typography component="span" sx={{ minWidth: '120px', display: 'inline-block', fontWeight: 'bold' }}>Servis Giriş Tarihi:</Typography>
          {selectedIdProcessData.Tarih}
        </ListItem>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <ListItem sx={{ p: 0 }}>
          <Typography component="span" sx={{ minWidth: '120px', display: 'inline-block', fontWeight: 'bold' }}>Aracın Marka:</Typography>
          {selectedIdProcessData.Marka}
        </ListItem>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <ListItem sx={{ p: 0 }}>
          <Typography component="span" sx={{ minWidth: '120px', display: 'inline-block', fontWeight: 'bold' }}>Aracın Model:</Typography>
          {selectedIdProcessData.Model}
        </ListItem>
      </Grid>
      <Grid item xs={12} md={6} lg={4}>
        <ListItem sx={{ p: 0 }}>
          <Typography component="span" sx={{ minWidth: '120px', display: 'inline-block', fontWeight: 'bold' }}>Aracın Plaka:</Typography>
          {selectedIdProcessData.Plaka}
        </ListItem>
      </Grid>
    </Grid>

    {/* Process Details */}
    {selectedDetails.map((detay, index) => (
      <Box key={detay.DetayId} sx={{ 
        mb: 1, 
        pb: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        "& .MuiInputBase-input": { fontSize: '12px' } 
      }}>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.4, ml: 0.20}}>
            <Typography variant="subtitle2" >
              {index + 1}. İşlem
            </Typography>
        </Box>
            <TextField
            sx={{marginBottom: '15px'}}
                fullWidth
                label="İşlem Açıklama"
                value={detay.islemAciklama}
                multiline
                disabled={!checked}
                onChange={(e) => {
                  const updatedDetails = selectedDetails.map((detail, i) => 
                    i === index ? { ...detail, islemAciklama: e.target.value } : detail
                  );
                  setSelectedDetails(updatedDetails);
                }}
                // ...
            />

        <Grid container spacing={2}>
           <Grid item xs={12} md={3}>
              <TextField
                label="İşlem Türü"
                fullWidth 
                size="small"
                value={detay.islemTur}
                disabled={true}
                onChange={(e) => {
                  const updatedDetails = selectedDetails.map((detail, i) => 
                    i === index ? { ...detail, islemTur: e.target.value } : detail
                  );
                  setSelectedDetails(updatedDetails);
                }}
                // ...
              />
          </Grid>
          <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Malzeme Fiyat"
                type="number"
                size="small"
                value={detay.MalzemeFiyat}
                disabled={!checked}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  const updatedDetails = selectedDetails.map((detail, i) => {
                    if (i === index) {
                      const updatedDetail = { ...detail, MalzemeFiyat: value };
                      updatedDetail.ToplamFiyat = updatedDetail.MalzemeFiyat + updatedDetail.IscilikFiyat;
                      return updatedDetail;
                    }
                    return detail;
                  });
                  setSelectedDetails(updatedDetails);
                }}
                // ...
              />
          </Grid>
          <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="İşçilik Fiyat"
                type="number"
                size="small"
                value={detay.IscilikFiyat}
                disabled={!checked}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  const updatedDetails = selectedDetails.map((detail, i) => {
                    if (i === index) {
                      const updatedDetail = { ...detail, IscilikFiyat: value };
                      updatedDetail.ToplamFiyat = updatedDetail.MalzemeFiyat + updatedDetail.IscilikFiyat;
                      return updatedDetail;
                    }
                    return detail;
                  });
                  setSelectedDetails(updatedDetails);
                }}
                // ...
              />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Toplam Fiyat"
              type="number"
              size="small"
              value={detay.ToplamFiyat}
              disabled={!checked}
              InputProps={{
    readOnly: true,
  }}
        
        sx={{
    "& .MuiInputBase-input": {
      fontWeight: "bold",
      
    }
  }}
            />
            </Grid>
            
          {/* <Grid item xs={12} md={4}>
                 <TextField
        label="Bakım KM"
        type="number"
        value={detay.BakımKM}
        onChange={(e) =>
          setProcessFormData({
            ...processFormData,
            BakimKM: Number(e.target.value),
          })
        }
        fullWidth
        margin="normal"
      />
          </Grid> */}
        </Grid>
      </Box>
    ))}
  </Box>


  {/* Fixed Footer with Actions */}
  <Box sx={{ 
    p: 2,
    bgcolor: 'background.paper',
    borderTop: '1px solid',
    borderColor: 'divider',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Switch
        checked={checked}
        onChange={handleChange}
        color="primary"
        title="İşlem Detaylarını Düzenle"
      />
      <Typography variant="body2" sx={{ ml: 1 }}>
        Düzenleme Modu
      </Typography>
    </Box>
    
    <Button 
      variant="contained" 
      color="primary" 
      onClick={reactToPrintFn}
      startIcon={<PrintIcon />}
      sx={{ px: 3 }}
    >
      Yazdır
    </Button>
    
    <Button 
      variant="contained" 
      color="secondary" 
      onClick={saveAsPDF}
      startIcon={<SaveIcon />}
      sx={{ px: 3 }}
    >
      PDF Kaydet
    </Button>

        <Button
      variant="contained" 
      color="warning" 
      onClick={processHandleSubmit}
      startIcon={<SaveIcon />}
      sx={{ px: 3 }}
    >
      Değişiklikleri Kaydet
    </Button>
  </Box>
</Dialog>
</Grid>

{/* TABLE */}

<Grid container spacing={2} sx={{ height: '100%', width: '100%' }}>
  <Grid item xs={12} sx={{ height: '100%', width: '100%' }}>
    <Box sx={{ 
      height: isSmallScreen
        ? '70vh' // Küçük ekranlarda daha az yükseklik
        : isLargeScreen
        ? '90vh' // Büyük ekranlarda daha fazla yükseklik
        : '80vh', // Orta ekranlar
      width: '100%',
    }}>
      <Paper
        sx={{height: 'calc(100vh - 200px)', width: '100%', overflow: 'auto'}}
      >
        <DataGrid
          rows={rows}
          getRowHeight={() => 'auto'}
          columns={columns.map((column) => ({
            ...column,
            flex: 1, // Tüm sütunların esnek genişlikte olmasını sağlar
            width: 125, // Minimum genişlik ayarı
          }))}
          getRowId={(row) => row.IslemId || row.ID}
          initialState={{ 
            pagination: { paginationModel },
            columns: {
              columnVisibilityModel: {}
            }
          }}
          pageSizeOptions={[100]}
          checkboxSelection
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectedRow(newSelectionModel as number[]);
          }}
          disableColumnMenu={false}
          columnBufferPx={columns.length} // Tüm sütunları hemen render et
          sx={{
            width: '100%',
            height: 'calc(100vh - 200px)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',

            '& .MuiDataGrid-cell': {
            padding: '4px', // Hücre içi boşluk
            display: 'flex',
              alignItems: 'center', // Dikeyde ortala
              },
            '& .MuiDataGrid-main': { // İç grid alanı için stil
              width: '100%',
            },
            '& .MuiDataGrid-virtualScroller': { // Kaydırma alanı için stil
              width: '100%',
            },
            '& .MuiDataGrid-footerContainer': {
              width: '100%',
            },
            '& .MuiDataGrid-columnHeaders': {
              width: '100%',
            }
          }}
        />
      </Paper>
    </Box>
  </Grid>
</Grid>
</div>
  );
}

export default Dashboard;



