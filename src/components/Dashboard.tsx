/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { DataGrid, GridColDef, GridOverlay } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Autocomplete, Box, Button, Grid, TextField, Typography, useMediaQuery } from '@mui/material';
import {useState, useEffect} from 'react';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CarRepairIcon from '@mui/icons-material/CarRepair';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import axios from '../config/AxiosConfig';
import Modal from '@mui/material/Modal';
import { text } from 'stream/consumers';









const paginationModel = { page: 0, pageSize: 10 };



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
}

// Güncelleme için beklenen veri yapısı
interface UpdateData {
  ID: number;
  MalzemeFiyat: number;
  IscilikFiyat: number;
  ToplamFiyat: number;
  islemAciklama: string;
  BakimKM: number;
  islemTur: string;
  AracId: number;
}

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
const [selectedRow, setSelectedRow] = useState<any[]>([]);
 const [selectedModels, setSelectedModels] = useState<string>("");
const [options, setOptions] = useState<any[]>([]); // Autocomplete için seçenekler
const [inputValue, setInputValue] = useState(""); // Autocomplete için input değeri
const [statu, setStatu] = useState(1); // Durum kontrolü
const [open, setOpen] = useState(false);
const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  }
const [processData, setProcessData] = useState<FormData[]>([]); // İŞLEM VERİLERİ

const [proccessFormData, setProcessFormData] = useState<FormData>({
  ID: null as any,
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
  AracId: 0
});







  const fetchProcess = async () => {
    try {
        const response = await axios.get(`/api/islemNew/GetIslemlerNew`);
        const inComingData = response.data;

        if (Array.isArray(inComingData)) {
          setProcessData(inComingData);
          setOptions(inComingData);
          console.log(inComingData);
  
        }else {
          console.log("Veri bir array değil:", inComingData);
        }
    } catch (error) {
      console.log("Hata:", error);
      toast.error("Veri alınırken bir hata oluştu.");
    }
  }

  useEffect(() => {
    fetchProcess();
  }, []); 
 




const resetForm = () => {
  setProcessFormData({
    ID: null as any,
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
    islemdetayid: 0
  })
}

const handleDoneProcess = async (id: number) => {
  setStatu(4);
  const isConfirmed = confirm("İşlem tamamlanacak. Devam etmek istiyor musunuz?");
  if (!isConfirmed) {
    return; // Kullanıcı onay vermezse işlemi iptal et
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
  // İşlem düzenleme fonksiyonu - DÜZGÜN HALİ
const handleEditProcess = async (id: number) => {
  try {
    // GET isteği ile veriyi çekiyoruz
    const response = await axios.get(`/api/islemNew/GetIslemDetailsById?islemId=${id}`);
    const data = response.data;
    console.log("Güncellemek için Gelen veri:", data);
    setProcessFormData({
      ID: data.islemdetayid,
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
      islemdetayid: data.islemdetayid,
      AracId: data.AracId
    });
    
    setSelectedRow([data.islemdetayid]);
    
    handleOpen();
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    toast.error("İşlem bilgileri alınamadı!");
  }
};

// Form submit işlemi - DÜZGÜN HALİ
const processHandleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  try {
    const updateData = {
      ID: proccessFormData.ID,
      MalzemeFiyat: proccessFormData.MalzemeFiyat,
      IscilikFiyat: proccessFormData.IscilikFiyat,
      ToplamFiyat: proccessFormData.ToplamFiyat,
      islemAciklama: proccessFormData.islemAciklama,
      BakimKM: proccessFormData.BakimKM,
      islemTur: proccessFormData.islemTur,
      AracId: proccessFormData.AracId
    };
    console.log("Güncellenen veri:", updateData);
    
    const response = await axios.post(
      `/api/islemNew/UpdateIslemD/${proccessFormData.ID}`,
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


const columns: GridColDef[] = [
  
  { field: 'Müşteri', headerName: 'Müşteri İsmi', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center', align: 'center' },
  { field: 'Araç', headerName: 'Araç', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center' , align: 'center' },
//   { field: 'Tarih', headerName: 'Tarih', type: 'string', width: 125, 
//     valueFormatter: (params : any) => {
//       const val = params.value;
//       if (!val) return 'Tarih Yok';
//     const date = new Date(val);
//     if (isNaN(date.getTime())) return 'Geçersiz Tarih';
//     return  date.toLocaleDateString('tr-TR', {
//       year: 'numeric',
//       month: '2-digit',
//       day: '2-digit',
//   });
//   },
// },
  {field: 'Tarih', headerName: 'Tarih', type: 'string', minWidth: 125, maxWidth:200, flex:1,headerAlign: 'center' , align: 'left'},
  { field: 'islemTur', headerName: 'İşlem Türü', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center' , align: 'center' },
  { field: 'islem', headerName: 'İşlem', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center' , align: 'center' },
  { field: 'KM', headerName: 'KM', type: 'number', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center', align: 'center' },
  { field: 'Plaka', headerName: 'Plaka', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center' , align: 'center' },
  {field: 'ToplamFiyat', headerName: 'Toplam Fiyat', type: 'number', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center', align: 'center' },
  {field: 'Statu', headerName: 'Durum', minWidth: 100, maxWidth:200, flex:1, headerAlign: 'center' , align: 'center',
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
      case 4:
        backgroundColor = '#74fbdd';
        textColor = '#0e7957';
        fontSize = '16px';
        statusText = 'İşlem Tamamlandı';
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
          padding: '4px 12px',
          borderRadius: '12px',
          display: 'inline-block', 
          whiteSpace: 'nowrap', 
          fontWeight: statu === 1 ? 'bold' : 'normal',
        }}
      >
        {statusText}
      </div>
    );
  },},
  {field: 'actions', headerName: 'İşlemler', minWidth: 100, maxWidth:200, flex:1, headerAlign:'center', align: 'left', sortable: false, renderCell: (params) => (
    <div style={{ width:'75px', display: 'flex', justifyContent: 'space-between' }}>

      {/* <div>
      <CarRepairIcon onClick={() => handleRepairProcess(params.row.ID)}
        style={{ cursor: 'pointer', marginLeft:'15px',marginTop:'15px', color:'#F3C623', fontSize:'25px', opacity:'0.8' } }
        ></CarRepairIcon>
      </div> */}
            <div>
      <DoneAllIcon
      titleAccess='İşlemi Tamamla'
      onClick={() => handleDoneProcess(params.row.ID)}
      style={{ cursor: 'pointer', marginLeft:'15px',marginTop:'15px', color:'green', fontSize:'25px',opacity:'0.8' } }>
      </DoneAllIcon>
      </div>
      <div>
      <EditIcon
      titleAccess='İşlemi Düzenle'
      onClick={() => handleEditProcess(params.row.ID)}
        style={{ cursor: 'pointer', marginLeft:'15px',marginTop:'15px', color:'#F3C623', fontSize:'25px', opacity:'0.8' } }
        ></EditIcon>
      </div>
      <div>
      <DeleteIcon
      titleAccess='İşlemi Sil'
      onClick={() => handleDeleteProcess(params.row.ID)}
      style={{ cursor: 'pointer', marginLeft:'15px',marginTop:'15px', color:'red', fontSize:'25px',opacity:'0.8' } }>
      </DeleteIcon>
      </div>
    </div> )}
];



const rows = processData.map((data, index) => ({
  ID: data.islemdetayid,
  id: data.islemdetayid,
  Müşteri: data.Adi,
  Araç: data.Araç,
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

     <Box
            sx={{ 
              marginTop: "20px",
              marginBottom: "10px",
              display: "flex", 
              gap: "10px", 
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              padding: "15px",
            }}
          >

            <Autocomplete
                            freeSolo
                              options={options}
                              getOptionLabel={(option) => option?.Adi || ""}
                              isOptionEqualToValue={(option, value) => option.Adi === value.Adi}
                              inputValue={inputValue}
                              onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
                              // onChange={(event, newValue) => {
                              //   setFormData((prevState) => ({
                              //     ...prevState,
                              //     Adi: newValue?.Adi || "",
                              //   }));
                              // }}
                              renderInput={(params) => (
                                <TextField {...params} label="Müşteri İsmi İle Ara" />
                              )}
                              sx={{ width: 300,  marginLeft: '10px', marginBottom: '10px' }}
                            />


          </Box>

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
        value={proccessFormData.MalzemeFiyat}
        onChange={(e) =>
          setProcessFormData({
            ...proccessFormData,
            MalzemeFiyat: Number(e.target.value),
          })
        }
        fullWidth
        margin="normal"
      />

      <TextField
        label="İşçilik Fiyatı"
        type="number"
        value={proccessFormData.IscilikFiyat}
        onChange={(e) =>
          setProcessFormData({
            ...proccessFormData,
            IscilikFiyat: Number(e.target.value),
          })
        }
        fullWidth
        margin="normal"
      />

      <TextField
        label="İşlem Açıklaması"
        value={proccessFormData.islemAciklama}
        onChange={(e) =>
          setProcessFormData({
            ...proccessFormData,
            islemAciklama: e.target.value,
          })
        }
        fullWidth
        margin="normal"
      />

      <TextField
        label="İşlem Türü"
        value={proccessFormData.islemTur}
        onChange={(e) =>
          setProcessFormData({
            ...proccessFormData,
            islemTur: e.target.value,
          })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Bakım KM"
        type="number"
        value={proccessFormData.BakimKM}
        onChange={(e) =>
          setProcessFormData({
            ...proccessFormData,
            BakimKM: Number(e.target.value),
          })
        }
        fullWidth
        margin="normal"
      />
      <TextField
        label="Toplam Fiyat"
        type="number"
        value={proccessFormData.ToplamFiyat}
        onChange={(e) =>
          setProcessFormData({
            ...proccessFormData,
            ToplamFiyat: Number(e.target.value),
          })
        }
        fullWidth
        margin="normal"
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
          getRowId={(row) => row.ID}
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
            padding: '8px', // Hücre içi boşluk
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
