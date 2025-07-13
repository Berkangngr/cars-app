/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import DeleteIcon from '@mui/icons-material/Delete';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import PrintIcon from '@mui/icons-material/Print';
import SaveIcon from '@mui/icons-material/Save';
import { Autocomplete, Box, Button, Card, CardContent, Dialog, Grid, TextField, Typography, useMediaQuery } from '@mui/material';
import Modal from '@mui/material/Modal';
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
  AracMarka:string;
  AracModel:string;
  IslemId:number;
  islemYilNo:string;
}

// Güncelleme için beklenen veri yapısı
// interface UpdateData {
//   ID: number;
//   MalzemeFiyat: number;
//   IscilikFiyat: number;
//   ToplamFiyat: number;
//   islemAciklama: string;
//   BakimKM: number;
//   islemTur: string;
//   AracId: number;
// }

//Modal style
const style = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 400,
  maxHeight: 600,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  overflow:'auto',
};

interface OptionType {
  Adi: string;
  id: number;
}


// const CustomNoRowsOverlay = () => {
//   return(
//     <GridOverlay>
//        <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           height: '100%',
//         }}
//       >
//         <Typography variant="subtitle1">Henüz veri yok</Typography>
//       </Box>
//     </GridOverlay>
//   )
// }

function Dashboard() {
const isSmallScreen = useMediaQuery('(max-width:1366px)'); // Küçük ekranlar
const isLargeScreen = useMediaQuery('(min-width:1920px)'); // Büyük ekranlar
const [, setSelectedRow] = useState<any[]>([]);
//const [statu, setStatu] = useState(1); // Durum kontrolü
const [open, setOpen] = useState(false);
const handleOpen = () => setOpen(true);
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
//const [, setNumPages] = useState<number>();
//const [pageNumber, setPageNumber] = useState<number>(1);
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
  AracMarka:"",
  AracModel:"",
  IslemId:0,
  islemYilNo:""
});






const fetchProcess = async () => {
  setGlobalLoading(true)
  try {
    const response = await axios.get(`/api/islemNew/GetIslemlerNew`);
    const inComingData = response.data;

    if (Array.isArray(inComingData)) {
      setProcessData(inComingData);
      setFilteredData(inComingData); // Bu satır önemli!
      console.log(inComingData);
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
    AracMarka:"",
    AracModel:"",
    IslemId:0,
    islemYilNo:""
  })
}

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

  //İşlem düzenleme fonksiyonu olacak
const handleEditProcess = async (id: number) => {
  console.log("Seçilen id:" , id)
  try {
    // GET isteği ile veriyi çekiyoruz
    const response = await axios.get(`/api/islemNew/GetIslemDetailsById?islemDetayId=${id}`);
    const data = response.data;
    console.log("Güncellemek için Gelen veri:", data);
    setProcessFormData({
      ID: data.ID,
      Adi: data.Adi,
      Araç: data.Araç,
      Tarih: data.Tarih,
      islemTur: data.islemTur,
      BakimKM: data.BakimKM,
      Plaka: data.Plaka,
      ToplamFiyat: data.ToplamFiyat,
      Statu: data.Statu,
      MalzemeFiyat: data.MalzemeFiyat,
      IscilikFiyat: data.IscilikFiyat,
      islemAciklama: data.islemAciklama,
       islemdetayid: data.ID,
      AracId: data.AracId,
      AracMarka:data.AracMarka,
      AracModel:data.AracModel,
      IslemId:data.IslemId,
      islemYilNo:data.islemYilNo
    });
    
    setSelectedRow([data.ID]);
    fetchProcess()
        setTimeout(() => {
      handleOpen();
    }, 100);

  } catch (error) {
    console.error("Veri çekme hatası:", error);
    toast.error("İşlem bilgileri alınamadı!");
  }
};

// Form submit işlemi - DÜZGÜN HALİ
const processHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  console.log("FormData ID:", processFormData.ID);
  event.preventDefault();
  try {
    const updateData = {
      ID: processFormData.ID,
      MalzemeFiyat: processFormData.MalzemeFiyat,
      IscilikFiyat: processFormData.IscilikFiyat,
      ToplamFiyat: processFormData.ToplamFiyat,
      islemAciklama: processFormData.islemAciklama,
      BakimKM: processFormData.BakimKM,
      islemTur: processFormData.islemTur,
      AracId: processFormData.AracId
    };
    console.log("Güncellenen veri:", updateData);
    
    const response = await axios.post(
      `/api/islemNew/UpdateIslemD`,
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
const handlePriceChange = (field: 'MalzemeFiyat' | 'IscilikFiyat', value: number) => {
  const newFormData = {
    ...processFormData,
    [field]: value,
    ToplamFiyat: processFormData.MalzemeFiyat + processFormData.IscilikFiyat
  };
  
  // Eğer değişen alan zaten yeni değerle güncellenmişse:
  if (field === 'MalzemeFiyat') {
    newFormData.ToplamFiyat = value + processFormData.IscilikFiyat;
  } else {
    newFormData.ToplamFiyat = processFormData.MalzemeFiyat + value;
  }

  setProcessFormData(newFormData);
};

// İşlem detayı fonksiyonu
const handleİnfoProcess = async (id: number) => {

  try {
  const response = await axios.get(`/api/islemNew/GetIslemDetailsById?islemDetayId=${id}`);
  const data = response.data;
  console.log(data)
   setProcessFormData({
      ID: data.ID,
      Adi: data.Adi,
      Araç: data.Araç,
      Tarih: data.Tarih,
      islemTur: data.islemTur,
      BakimKM: data.BakimKM,
      Plaka: data.Plaka,
      ToplamFiyat: data.ToplamFiyat,
      Statu: data.Statu,
      MalzemeFiyat: data.MalzemeFiyat,
      IscilikFiyat: data.IscilikFiyat,
      islemAciklama: data.islemAciklama,
       islemdetayid: data.ID,
      AracId: data.AracId,
      AracMarka:data.AracMarka,
      AracModel:data.AracModel,
      IslemId:data.IslemId,
      islemYilNo:data.islemYilNo
    });
    
    setSelectedRow([data.ID]);
        setTimeout(() => {
      handleOpenDetail();
    }, 100);

  } catch (error) {
    console.log("Veri çekilirken hata oluştu:", error);
  }
 
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


  // function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
  //   setNumPages(numPages);
  // }
const columns: GridColDef[] = [
  
  {field:'islemYilNo', headerName: 'İşlem Kodu', minWidth:100, maxWidth:200, flex:1, headerAlign:'center', align:'center'},
  { field: 'Müşteri', headerName: 'Müşteri İsmi', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center', align: 'center' },
  { field: 'Marka', headerName: 'Marka', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center' , align: 'center' },
  { field: 'Model', headerName: 'Model', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center' , align: 'center' },
  {field: 'Tarih', headerName: 'Tarih', type: 'string', minWidth: 100, maxWidth:200, flex:1,headerAlign: 'center' , align: 'center'},
  { field: 'islemTur', headerName: 'İşlem Türü', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center' , align: 'center' },
  { field: 'islem', headerName: 'İşlem', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center' , align: 'center' },
  { field: 'KM', headerName: 'KM', type: 'number', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center', align: 'center' },
  { field: 'Plaka', headerName: 'Plaka', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center' , align: 'center' },
  {field: 'ToplamFiyat', headerName: 'Toplam Fiyat', type: 'number', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center', align: 'center' },
  {field: 'Statu', headerName: 'Durum', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center', align: 'center',
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
          
          // fontWeight: statu === 1 ? 'bold' : 'normal',

        }}
      >
        {statusText}
      </div>
    );
  },},
  {field: 'actions', headerName: 'İşlemler', minWidth: 240, maxWidth:300, flex:1, headerAlign:'center', align: 'left', sortable: false,renderCell: (params) => (
    <div style={{ width:'300px', display: 'flex', justifyContent: 'space-between'}}>
          <div>
            <InfoOutlineIcon
            titleAccess= 'İşlem Detayı'
            onClick={() => handleİnfoProcess(params.row.ID)}
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
      <EditIcon
      titleAccess='İşlemi Düzenle'
      onClick={() => handleEditProcess(params.row.ID)}
        style={{ cursor: 'pointer', marginLeft:'5px',marginTop:'15px', color:'#F3C623', fontSize:'20px', opacity:'0.8' } }
        ></EditIcon>
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
  ID: data.islemdetayid,
  id: data.islemdetayid,
  Müşteri: data.Adi,
  Marka: data.AracMarka,
  Model: data.AracModel,
  Tarih: data.Tarih,
  islemTur: data.islemTur,
  islem : data.islemAciklama,
  Statu: data.Statu,
  KM: data.BakimKM,
  Plaka: data.Plaka,
  ToplamFiyat: data.ToplamFiyat,
  
}));

 


const paginationModel = { page: 0, pageSize:10};

  return (

<div>

     <Grid container spacing={2} sx={{ marginTop: "4px", marginBottom: "15px", marginLeft:"5px" }}>
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

          {/* MODAL */}
          <Grid>
            <Grid>
              <Modal
                open={open}
                onClose={handleClose}
                
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                  <Box sx={style}
                           component="form"
                           onSubmit={processHandleSubmit}
                          >
                             <Typography variant="h6" gutterBottom>
        İşlem Düzenle
      </Typography>

      {/* Sadece güncellenebilir alanlar */}
      <TextField
        label="Malzeme Fiyatı"
        type="number"
        value={processFormData.MalzemeFiyat}
        onChange={(e) => handlePriceChange('MalzemeFiyat', Number(e.target.value))}
        fullWidth
        margin="normal"
      />

      <TextField
        label="İşçilik Fiyatı"
        type="number"
        value={processFormData.IscilikFiyat}
        onChange={(e) => handlePriceChange('IscilikFiyat', Number(e.target.value))}
        fullWidth
        margin="normal"
      />

      <TextField
        label="İşlem Açıklaması"
        value={processFormData.islemAciklama}
        onChange={(e) =>
          setProcessFormData({
            ...processFormData,
            islemAciklama: e.target.value,
          })
        }
        fullWidth
        margin="normal"
      />

      <TextField
        label="İşlem Türü"
        value={processFormData.islemTur}
        onChange={(e) =>
          setProcessFormData({
            ...processFormData,
            islemTur: e.target.value,
          })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Bakım KM"
        type="number"
        value={processFormData.BakimKM}
        onChange={(e) =>
          setProcessFormData({
            ...processFormData,
            BakimKM: Number(e.target.value),
          })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Toplam Fiyat"
        type="number"
        value={processFormData.ToplamFiyat}
        InputProps={{
    readOnly: true,
  }}

        fullWidth
        margin="normal"
        sx={{
    "& .MuiInputBase-input": {
      fontWeight: "bold",
      
    }
  }}
      />

      

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={handleClose} sx={{ mr: 1 }}>
          İptal
        </Button>
        <Button type="submit" variant="contained">
          Kaydet
        </Button>
      </Box>
        </Box>
        
              </Modal>
            </Grid>
          </Grid>

          {/* Detay Card */}
        <Grid>
  <Dialog open={printDetailOpen} onClose={handleCloseDetail}>
    <Card sx={{ width: 500, margin: 'auto',  boxShadow: 3, padding: 8 }}>
      
      {/* Buton grubu */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, p:2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={reactToPrintFn}
          startIcon={<PrintIcon />}
          sx={{marginRight: 2}}
        >
          Yazdır
        </Button>
        
        <Button 
          variant="contained" 
          color="warning" 
          onClick={saveAsPDF} // veya downloadPDF, downloadPDFWithFetch
          startIcon={<SaveIcon />}
          sx={{marginLeft: 2}}
        >
          PDF Kaydet
        </Button>
      </Box>
      
      <div ref={contentRef}>
        <CardContent
        sx={{p:2}}
        >
          

          {/* Form verileri */}
          <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2}}>
            İşlem Detayları
          </Typography>
          
          <Box sx={{mb: 4}}>
            <Typography sx={{mb:2}} variant="subtitle2" color="text.secondary">Sayın</Typography>
            <Typography variant="body1">{processFormData.Adi}</Typography>
            <hr />
          </Box>

          <Box sx={{mb: 4}}>
            <Typography sx={{mb:2}} variant="subtitle2" color="text.secondary">Araç Plaka</Typography>
            <Typography variant="body1">{processFormData.Plaka}</Typography>
            <hr />
          </Box>

          <Box sx={{mb: 4}}>
            <Typography sx={{mb:2}} variant="subtitle2" color="text.secondary">İşlem Türü</Typography>
            <Typography variant="body1">{processFormData.islemTur}</Typography>
            <hr />
          </Box>

          <Box sx={{mb: 4}}>
            <Typography sx={{mb:2}} variant="subtitle2" color="text.secondary">Yapılacak işlem</Typography>
            <Typography variant="body1">{processFormData.islemAciklama}</Typography>
            <hr />
          </Box>

          <Box sx={{mb: 4}}>
            <Typography sx={{mb:2}} variant="subtitle2" color="text.secondary">Ödenecek Toplam Tutar</Typography>
            <Typography variant="body1">{processFormData.ToplamFiyat}</Typography>
            <hr />
          </Box>
        </CardContent>
      </div>
    </Card>
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
            minWidth: 100, // Minimum genişlik ayarı
          }))}
          getRowId={(row) => row.islemdetayid || row.ID}
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



