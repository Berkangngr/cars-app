/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import gif from '../images/Under-constructıon.gif';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Navbar from '../components/Navbar';
import { Box, Button, Container, FormControl, Grid, Hidden, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from '../config/AxiosConfig';
import { toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';




const Tur = [
  {value:'Bireysel Müşteri', label:'Bireysel Müşteri'},
  {value:'Kurumsal Müşteri', label:'Kurumsal Müşteri'}
]

interface FormData {
  ID:number | null;
  Adi: string;
  Adres: string;
  Telefon: string;
  Email: string;
  VergiNo: string;
  VergiDairesi:string;
  TC:string;
  PostaNo:string;
  SehirId:number;
  UlkeId:number;
  Tur:string;
}

interface Ülke {
  Value: string;
  Text: string;
}

interface Şehir {
  Value: string;
  Text: string;
}

interface ApiResponseCountryandCity {
  Ulkeler: Ülke[];
  Sehirler: Şehir[];
}


//Modal styleları
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




function Customers() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading]=useState(false);
  const [customersData, setCustomersData] = useState<FormData[]>([]); // Müşeri verilerinin alma
  const [country, setCountry] = useState <any[]>([]);
  const [city, setCity] = useState <any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState <any>(""); // Seçili ülke
  const [selectedCity, setSelectedCity] = useState <any>(""); // Seçili şehir
  const [selectedTur, setSelectedTur] = useState<any>();
  const [selectedRow, setSelectedRow] = useState<any[]>([]);
  const [isEditing,setIsEditing] = useState(false); // Modal düzenleme için mi açık?
  const [selectedUserId, setSelectedUserId] = useState(null); // Düzenlenecek kullanıcı ıd'si

  //Silme işlemi stateleri
// console.log(selectedRow)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);


    const isSmallScreen = useMediaQuery('(max-width:1366px)'); // Küçük ekranlar
    const isLargeScreen = useMediaQuery('(min-width:1920px)'); // Büyük ekranlar

  const [formData, setFormData] = useState<FormData>({
    ID:null,
    Adi: "",
    Adres: "",
    Telefon: "",
    Email: "",
    VergiNo:"",
    VergiDairesi:"",
    TC:"",
    PostaNo:"",
    SehirId:0,
    UlkeId:0,
    Tur:"",
  });

  const resetForm : ()=> void =() => {
    setFormData({
    ID:null,
    Adi: "",
    Adres: "",
    Telefon: "",
    Email:"",
    VergiNo: "",
    VergiDairesi:"",
    TC:"",
    PostaNo:"",
    SehirId:0,
    UlkeId:0,
    Tur:""
    })
  }

  const handleClose = () => {
    setOpen(false);
    resetForm();
    setFormData({
      ID: null,
      Adi: "",
      Adres: "",
      Telefon: "",
      Email: "",
      VergiNo: "",
      VergiDairesi: "",
      TC: "",
      PostaNo: "",
      UlkeId: 0,
      SehirId: 0,
      Tur: "",
    });
    setIsEditing(false);
    setSelectedUserId(null);
    // handleClose(); // Modal'ı kapatma işlemi
  } 

  
  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:value,
    }))
  }

  //Müşteri verilerini gönderme.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // setIsEditing(false);
    try {
      let response;
      if (isEditing) {
        // console.log("Form data", formData)
        response = await axios.post(`Member/FirmaSahis/FirmaUpdate/${selectedUserId}`,formData);
        toast.success("Kullanıcı bilgileri başarıyla güncellendi.");
      } else {
        response = await axios.post("/Member/FirmaSahis/Create", formData);
        toast.success("Kayıt Başarılı");
      }
      // console.log(response)
      resetForm();
      handleClose();
      fetchCustomers();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Bilinmeyen bir hata oluştu.";
      toast.error(`Hata: ${errorMessage}`);
    } finally {
      setIsLoading(false); 
    }
  };

  // Ülke ve Şehir bilgilerini çekme
  useEffect(() => {
    const fetchCountryAndCity = async() => {
      try {
        const response = await axios.get("/Member/FirmaSahis/Create");
        setCountry(response.data.Ulkeler);
        setCity(response.data.Sehirler);
        // console.log(country)
        // console.log(city)
        
      } catch (error:any) {
        const errorMessage = error.response?.data?.message || "Bilinmeyen bir hata oluştu.";
        toast.error(`Hata: ${errorMessage}`);
      }
    };
    fetchCountryAndCity();
  },[]);


  //Müşteri verilerini alma.
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`/member/FirmaSahis/GetFirmaSahisList`);
        const fetchedData = Array.isArray(response.data) ? response.data : response.data.results || [];
        // console.log(fetchedData)
        setCustomersData(fetchedData)
      } catch (error) {
        // console.log("Veri alınırken hata oluştu", error);
        toast.error("Veriler alınırken bir sorun oluştu.");    
      }
    };
   fetchCustomers();
  },[]);

//Silme fonksiyonu
  const handleDeleteUser = async (selectedRow : any) => {
    
    //console.log(selectedRow)
    try {
      const response = await axios.delete(`/member/FirmaSahis/FirmaSahisPasif/${selectedRow}`);
      if (response.data.success) {
        // Müşteri başarıyla silindi. Listeyi güncelleyin
        setCustomersData(customersData.filter(customer => customer.ID !== selectedRow));
        toast.success("Müşteri başarıyla silindi.");
        fetchCustomers();
      } else {
        console.error("Firma pasifleştirilemedi:", response.data);
        toast.error("Müşteri silinemedi. Lütfen daha sonra tekrar deneyin.");
      }
    } catch (error) {
      console.error("Beklenmedik bir hata oluştu:", error);
      toast.error("Müşteri silinirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
    }
  };

  
  //Düzenleme fonksionu
  const handleRepairUser = async (selectedRow : any) => {
    if (!selectedRow) {
      toast.error("Lütfen güncellenecek bir kullanıcı seçiniz.")
      return;
    }
    try {
      const response = await axios.get(`/Member/FirmaSahis/FirmaUpdate/${selectedRow}`)
      // console.log("Gelen data : " , response.data);
      
      setFormData({
        ID: response.data.ID || "",
        Adi: response.data.Adi || "",
        Adres: response.data.Adres || "",
        Telefon: response.data.Telefon || "",
        Email: response.data.Email || "",
        VergiNo: response.data.VergiNo || "",
        VergiDairesi: response.data.VergiDairesi || "",
        TC: response.data.TC || "",
        PostaNo: response.data.PostaNo || "",
        UlkeId: response.data.Ülke || "",
        SehirId: response.data.Şehir || "",
        Tur: response.data.Tur || "",
      });
      setIsEditing(true);
      setSelectedUserId(selectedRow);
      handleOpen();
      fetchCustomers();
    } catch (error) {
      console.error("Kullanıcı güncellenirken beklenmedik bir hata oluştu:", error);
      toast.error("Kullanıcı bilgileri güncellenemedi. Lütfen daha sonra tekrar deneyin.");
    }
  }

  const fetchCustomers = async () => {

    try {
      const response = await axios.get(`/member/FirmaSahis/GetFirmaSahisList`);
      const fetchedData = Array.isArray(response.data) ? response.data : response.data.results || [];
      setCustomersData(fetchedData);
    } catch (error) {
      // console.log("Veri alınırken hata oluştu", error);
      toast.error("Veriler alınırken bir sorun oluştu.");
    }
  }
  

  
//Table Yapısı

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 50},
  { field: 'Şahıs/Müşteri_İsmi', headerName: 'Şahıs/Müşteri İsmi', width: 125 },
  { field: 'Adres', headerName: 'Adres', width: 125 },
  { field: 'Telefon', headerName: 'Telefon', width: 125 },
  { field: 'Email', headerName: 'Email', width: 125 },
  { field: 'VergiNo', headerName: 'VergiNo', width: 125 },
  { field: 'Tc', headerName: 'Tc', width: 125 },
  { field: 'PostaNo', headerName: 'PostaNo', width: 125 },
  { field: 'Şehir', headerName: 'Şehir', width: 125 },
  { field: 'Tur', headerName: 'Müşteri Türü', width: 125 },
];

const rows = customersData.map((customer,index) => ({
  id: customer.ID,
  'Şahıs/Müşteri_İsmi': customer.Adi,
  Adres: customer.Adres,
  Telefon: customer.Telefon,
  Email: customer.Email,
  VergiNo: customer.VergiNo,
  Tc: customer.TC,
  PostaNo: customer.PostaNo,
  Şehir: customer.SehirId,
  Ülke: customer.UlkeId,
  Tur: customer.Tur,
}));


const paginationModel = { page: 0, pageSize:10};

  return (
    <>
      <Box
        style={{
          marginLeft: "5%", // Sola yakın ama biraz sağa kayması için
          marginTop: "20px", // Yukarıdan bir boşluk"
        }}
      >
      
        <Button style={{marginBottom:'10px'}} variant="contained" onClick={handleOpen}>
          <GroupAddIcon style={{marginRight:'5px'}}/>Yeni Müşteri Ekleyin
        </Button>

        <Button style={{marginBottom:'10px',marginLeft:'10px'}} variant='contained' color="error"
        onClick={() => { 
      handleDeleteUser(selectedRow); 
    }}>
          <DeleteIcon style={{marginRight:'5px'}} /> Satırı Silin
        </Button>

        <Button style={{marginBottom:'10px',marginLeft:'10px', backgroundColor:"#F3C623"}} variant='contained' onClick={() => {
          handleRepairUser(selectedRow);
        }}>
          <EditIcon style={{marginRight:'5px'}} /> Satırı Düzenleyin
        </Button>
      </Box>
   
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
         onSubmit={handleSubmit}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
          Müşteri Tanıtım Ekranı
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>

             {/* Id Alanı */}
             <TextField
              id="ID"
              name="ID"
              label="ID"
              value={formData.ID}
              onChange={handleInputChange}
              sx={{marginBottom: 2}}
              />

             {/* İsim Alanı */}
             <TextField
              id="Adi"
              name="Adi"
              label="Şahıs veya Şirket ismi"
              value={formData.Adi}
              onChange={handleInputChange}
              sx={{marginBottom: 2}}
              />

              {/* Adres Alanı */}
              <TextField
              id="Adres"
              name="Adres"
              label="Adres"
              value={formData.Adres}
              onChange={handleInputChange}
              sx={{marginBottom: 2}}
              />

              {/* Telefon Alanı */}
              <TextField
              id="Telefon"
              name="Telefon"
              label="Telefon"
              value={formData.Telefon}
              onChange={handleInputChange}
              sx={{marginBottom: 2}}
              />

              {/* Email Alanı */}
              <TextField
              id="Email"
              name="Email"
              label="Email"
              value={formData.Email}
              onChange={handleInputChange}
              sx={{marginBottom: 2}}
              />

              {/* VergiNo Alanı */}
              <TextField
              id="VergiNo"
              name="VergiNo"
              label="Vergi No"
              value={formData.VergiNo}
              onChange={handleInputChange}
              sx={{marginBottom: 2}}
              helperText="Kurumsal müşteri ise!"
              />

                {/* VergiDairesi Alanı */}
                <TextField
              id="VergiDairesi"
              name="VergiDairesi"
              label="Vergi Dairesi"
              value={formData.VergiDairesi}
              onChange={handleInputChange}
              sx={{marginBottom: 2}}
              helperText="Kurumsal müşteri ise!"
              />

              {/* Tc Alanı */}
              <TextField
              id="TC"
              name="TC"
              label="TC"
              value={formData.TC}
              sx={{marginBottom: 2}}
              onChange={handleInputChange}
              />

              {/* PostoNo Alanı */}
              <TextField
              id="PostaNo"
              name="PostaNo"
              label="Posta No"
              value={formData.PostaNo}
              onChange={handleInputChange}
              sx={{marginBottom: 2}}
              />

            {/* Ülke Alanı */}

            <TextField
            id="Ülke"
            name="Ülke"
            select
            label="Ülke"
            value={selectedCountry}
            onChange={(e) => {
              const UlkeId = parseInt(e.target.value,10);
              setSelectedCountry(UlkeId);
              setFormData({...formData, UlkeId});
            }
              }
            helperText="Lütfen ülkeyi seçiniz!"
            >
              {country.map((countryOption) => (
                  <MenuItem key={countryOption.Value} value={countryOption.Value}>
                  {countryOption.Text}
                </MenuItem>
              ) )}
              
            </TextField>


              {/* Şehir Alanı */}
              <TextField
              id="Şehir"
              name="Şehir"
              select
              label="Şehir"
              value={selectedCity}
              onChange={(e) => {
                const SehirId = parseInt(e.target.value,10);
                setSelectedCity(SehirId);
                setFormData({...formData, SehirId});
              }}
              helperText="Lütfen şehri seçiniz!"
            >
              {city.map((cityOption) => (
                <MenuItem key={cityOption.Value} value={cityOption.Value}>
                  {cityOption.Text}
                </MenuItem>
              ))}
            </TextField>

 
              {/* Müşteri Tipi */}
            <TextField
            id="Tur"
            name="Tur"
            select
            label="Müşteri Tipi"
            value={formData.Tur}
            onChange={(e) => {
              const Tur = e.target.value;
              setSelectedTur(Tur);
              setFormData({...formData, Tur});
            }}
            sx={{marginBottom: 2}}
            helperText='Lütfen müşteri tipini seçiniz!'
            >
              {Tur.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}

            </TextField>


          
        {/* Butonlar */}
        <div>
        <Button type="button" variant="contained" color="error" onClick={resetForm}>
                Formu Temizle
              </Button>
              <Button type="submit" variant="contained" color="success" disabled={isLoading}>
                {isLoading ? "Yükleniyor..." : "Kaydet"}
              </Button>
        </div>
          </Typography>
        </Box>
      </Modal>

{/* TABLE */}

<div>
  <Grid container spacing={2} sx={{ height: '100%', width: '100%' }}>
        <Grid item xs={12} sx={{ height: '100%', width: '100%' }}>
    <Box sx={{ 
      height: isSmallScreen
      ? '70vh' // Küçük ekranlarda daha az yükseklik
      : isLargeScreen
      ? '90vh' // Büyük ekranlarda daha fazla yükseklik
      : '80vh', // Orta ekranlar
    width: '100%',
    }}> {/* height: 100vh ile tam ekran boyutu */}
      <Paper
         sx={{height: 'calc(100vh - 200px)', width: '100%', overflow: 'hidden'}}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectedRow(newSelectionModel  as number[]);
          }}
          sx={{
            width: '100%', // Genişlik %100 olacak şekilde ayarlanır
            height: '100%', // Yükseklik %100 olacak şekilde ayarlanır
          }}
        />
      </Paper>
    </Box>
    </Grid>
      </Grid>
</div>


      </Grid>
    </Grid>
    </>
  )
}


export default Customers


