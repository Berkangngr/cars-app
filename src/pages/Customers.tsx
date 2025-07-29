/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { Autocomplete, Box, Button, Grid, MenuItem, TextField, Typography, useMediaQuery } from '@mui/material';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { MuiTelInput } from 'mui-tel-input';
import React, { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../config/AxiosConfig';
import { setGlobalLoading } from '../utils/globalLoading';





const Tur = [
  {value:'Bireysel Müşteri', label:'Bireysel Müşteri'},
  {value:'Kurumsal Müşteri', label:'Kurumsal Müşteri'}
]

interface   FormData {
  ID:number;
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
  MusteriSorumlusu:string;
  Ulkeler: [];
  Sehirler: [];
}

// interface Ülke {
//   Value: string;
//   Text: string;
// }

// interface Şehir {
//   Value: string;
//   Text: string;
// }

// interface ApiResponseCountryandCity {
//   Ulkeler: Ülke[];
//   Sehirler: Şehir[];
// }


//Modal styleları
// const style = {
//   display: 'flex',
//   flexDirection: 'column',
//   gap: 2,
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '90%',
//   maxWidth: 400,
//   maxHeight: 600,
//   bgcolor: 'background.paper',
//   borderRadius: 4,
//   boxShadow: 24,
//   p: 4,
//   overflow:'auto',
// };




function Customers() {
  // const navigate = useNavigate();
  const [isLoading, ]=useState(false);
  const [customersData, setCustomersData] = useState<FormData[]>([]); // Müşeri verilerinin alma
  const [country, setCountry] = useState <any[]>([]);
  const [city, setCity] = useState <any[]>([]);
  const [, setSelectedTur] = useState<any>();
  const [, setSelectedRow] = useState<any[]>([]);
  const [isEditing,setIsEditing] = useState(false); // Modal düzenleme için mi açık?
  const [, setSelectedUserId] = useState(null); // Düzenlenecek kullanıcı ıd'si
  const [inputValue, setInputValue] = useState(""); // Autocomplete için input değeri
  const [options, setOptions] = useState<any[]>([]); // Autocomplete için seçenekler
  //Silme işlemi stateleri
// console.log(selectedRow)
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);


    const isSmallScreen = useMediaQuery('(max-width:1366px)'); // Küçük ekranlar
    const isLargeScreen = useMediaQuery('(min-width:1920px)'); // Büyük ekranlar

  const [formData, setFormData] = useState<FormData>({
    ID:null as any,
    Adi: "",
    Adres: "",
    Telefon: "",
    Email: "",
    VergiNo:"",
    VergiDairesi:"",
    TC:"",
    PostaNo:"",
    SehirId:null as any,
    UlkeId:null as any,
    Tur:"",
    MusteriSorumlusu:"",
    Ulkeler: [],
    Sehirler: [],
  });

  const resetForm : ()=> void =() => {
    setFormData({
    ID:0,
    Adi: "",
    Adres: "",
    Telefon: "",
    Email:"",
    VergiNo: "",
    VergiDairesi:"",
    TC:"",
    PostaNo:"",
    SehirId:null as any,
    UlkeId:null as any,
    Tur:"",
    MusteriSorumlusu:"",
    Ulkeler: [],
    Sehirler: [],
    })
  }

  const handleClose = () => {
    setOpen(false);
    resetForm();
    setFormData({
     ID:0,
      Adi: "",
      Adres: "",
      Telefon: "",
      Email: "",
      VergiNo: "",
      VergiDairesi: "",
      TC: "",
      PostaNo: "",
      UlkeId: null as any,
      SehirId: null as any,
      Tur: "",
      MusteriSorumlusu:"",
      Ulkeler: [],
      Sehirler: [],
    });
    setIsEditing(false);
    setSelectedUserId(null);
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
    console.log("Form data", formData)
    e.preventDefault();
    setGlobalLoading(true);
    // setIsEditing(false);
    if (formData.UlkeId !== null && formData.SehirId !== null) {
            try {
      let response;
      if (isEditing) {
        // console.log("Form data", formData)
        response = await axios.post(`/api/FirmaSahis/FirmaUpdate`,formData,{
        headers: {
          'Content-Type': 'application/json'
        }
      });
          if (response.data.success === true) {
          toast.success("Kullanıcı bilgileri başarıyla güncellendi.");
          fetchCustomers()
          handleClose()
        } else {
          toast.error(response.data.message)
        }  
      } else {
        response = await axios.post("/api/FirmaSahis/Create", formData);
        if (response.data.success === true) {
        console.log(response.data)
        toast.success("Kayıt Başarılı");
        resetForm();
        handleClose();
        fetchCustomers();
        } else {
           toast.error(response.data.message)
        }
      }
      // console.log(response)

    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Bilinmeyen bir hata oluştu.";
      toast.error(`Hata: ${errorMessage}`);
    } finally {
      setGlobalLoading(false); 
    }
    } else {
      toast.error("Ülke ve Şehir seçiniz.")
      setGlobalLoading(false)
    }
  };

  // Ülke ve Şehir bilgilerini çekme
  useEffect(() => {
    const fetchCountryAndCity = async() => {
      try {
        const response = await axios.get("/api/FirmaSahis/Create");
        setCountry(response.data.Ulkeler);
        setCity(response.data.Sehirler);
         console.log(country)
         console.log(city)
        
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
      setGlobalLoading(true)
      try {
        const response = await axios.get(`/api/FirmaSahis/GetFirmaSahisList`);
        const fetchedData = Array.isArray(response.data) ? response.data : response.data.results || [];
         console.log(fetchedData)
        setCustomersData(fetchedData)
      } catch (error) {
        // console.log("Veri alınırken hata oluştu", error);
        toast.error("Veriler alınırken bir sorun oluştu.");    
      }finally{
        setGlobalLoading(false)
      }
    };
   fetchCustomers();
  },[]);

//Silme fonksiyonu
  const handleDeleteUser = async (id: number) => {
    console.log(id)
    const isConfirmed = confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?");
    if (!isConfirmed) return; // Kullanıcı silme işlemini iptal ettiyse çık

    try {
      const response = await axios.post(`/api/FirmaSahis/FirmaSahisPasif?id=${id}`);
      console.log(response); 
      if (response.data.success) {
        // Müşteri başarıyla silindi. Listeyi güncelleyin
        setCustomersData(customersData.filter((customer) => customer.ID  !== id));
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
      const response = await axios.get(`/api/FirmaSahis/FirmaUpdate?id=${selectedRow}`)
       console.log("Gelen data : " , response.data);
      
      setFormData({
        ID: response.data.ID || 0,
        Adi: response.data.Adi || "",
        Adres: response.data.Adres || "",
        Telefon: response.data.Telefon || "",
        Email: response.data.Email || "",
        VergiNo: response.data.VergiNo || "",
        VergiDairesi: response.data.VergiDairesi || "",
        TC: response.data.TC || "",
        PostaNo: response.data.PostaNo || "",
        UlkeId: response.data.UlkeId,
        SehirId: response.data.SehirId,
        Tur: response.data.Tur || "",
        MusteriSorumlusu: response.data.MusteriSorumlusu || "",
        Ulkeler: response.data.Ulkeler || [],
        Sehirler: response.data.Sehirler || [],
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
      const response = await axios.get(`/api/FirmaSahis/GetFirmaSahisList`);
      const fetchedData = Array.isArray(response.data) ? response.data : response.data.results || [];
      setCustomersData(fetchedData);
    } catch (error) {
      // console.log("Veri alınırken hata oluştu", error);
      toast.error("Veriler alınırken bir sorun oluştu.");
    }
  }

  // Mail kontrol etme fonksiyonu
  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Autocomplete için filtreleme
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (inputValue.length >= 2) {
        axios
          .get(`/api/FirmaSahis/GetFirmaWithAd?Firmaad=${inputValue}`)
          .then((response) => {
            console.log(response); 
            setOptions(response.data);
            setCustomersData(response.data);
            console.log("Autocomplete options", response.data);
          })
          .catch((error) => console.log(error));
      } else {
        setOptions([]);
      }
    }, 300);

    if (inputValue.length === 0) {
      setOptions([]);
      fetchCustomers(); // Eğer input değeri boşsa tüm müşteri verilerini getir  
    }
  
    return () => clearTimeout(delayDebounce);
  }, [inputValue]);
  

  
//Table Yapısı

const columns: GridColDef[] = [
  // { field: 'id', headerName: 'ID', width: 50},
  { field: 'Şahıs/Müşteri_İsmi', headerName: 'Şahıs/Müşteri İsmi', width: 125 ,headerAlign: 'center' , align: 'center' },
  { field: 'MusteriSorumlusu', headerName: 'Müşteri Sorumlusu', width: 125 ,headerAlign: 'center' , align: 'center' },
  { field: 'Adres', headerName: 'Adres', width: 125 ,headerAlign: 'center' , align: 'center' },
  { field: 'Telefon', headerName: 'Telefon', width: 125 ,headerAlign: 'center' , align: 'center' },
  { field: 'Email', headerName: 'Email', width: 125 ,headerAlign: 'center' , align: 'center' },
  { field: 'VergiNo', headerName: 'VergiNo', width: 125 ,headerAlign: 'center' , align: 'center' },
  { field: 'Tc', headerName: 'Tc', width: 125 ,headerAlign: 'center' , align: 'center' },
  { field: 'PostaNo', headerName: 'Posta No', width: 125 ,headerAlign: 'center' , align: 'center' },
  { field: 'Şehir', headerName: 'Şehir', width: 125,headerAlign: 'center' , align: 'center' },
  { field: 'Tur', headerName: 'Müşteri Türü', width: 125,headerAlign: 'center' , align: 'center' },
  {field: 'actions', headerName: 'İşlemler', width: 125, headerAlign: 'center' , align: 'center', sortable: false, renderCell: (params) => (
    <div style={{ width:'75px', display: 'flex', justifyContent: 'space-between' }}>
      <div>
      <EditIcon onClick={() => handleRepairUser(params.row.ID)}
        style={{ cursor: 'pointer', marginLeft:'10px',marginTop:'15px', color:'#F3C623', fontSize:'25px', opacity:'0.8' } }
        ></EditIcon>
      </div>
      <div>
      <DeleteIcon onClick={() => handleDeleteUser(params.row.ID)}
      style={{ cursor: 'pointer', marginLeft:'10px',marginTop:'15px', color:'red', fontSize:'25px',opacity:'0.8' } }>
      </DeleteIcon>
      </div>
    </div> )}  
];
 {/* <Button style={{marginBottom:'10px',marginLeft:'10px'}} variant='contained' color="error" 
        onClick={() => { 
      handleDeleteUser(selectedRow); 
    }}
    >
          <DeleteIcon style={{marginRight:'5px'}} /> Satırı Silin
        </Button> 
        

        <Button style={{marginBottom:'10px',marginLeft:'10px', backgroundColor:"#F3C623"}} variant='contained' onClick={() => {
          handleRepairUser(selectedRow);
        }}>
          <EditIcon style={{marginRight:'5px'}} /> Satırı Düzenleyin
        </Button>
        */}

const rows = customersData.map((customer) => ({
  ID: customer.ID, // Her satıra benzersiz bir id ekliyoruz
  'Şahıs/Müşteri_İsmi': customer.Adi,
  MusteriSorumlusu: customer.MusteriSorumlusu,
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


const paginationModel = { page: 0, pageSize:100};

  return (
    <>
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
      
        <Button style={{marginBottom:'10px'}} variant="contained" onClick={handleOpen}>
          <GroupAddIcon sx={{ marginRight:'5px' }}/>Yeni Müşteri Ekleyin
        </Button>


                <Autocomplete
                freeSolo
                  options={options}
                  getOptionLabel={(option) => option?.Adi || ""}
                  isOptionEqualToValue={(option, value) => option.Adi === value.Adi}
                  inputValue={inputValue}
                  onInputChange={(_event, newInputValue) => setInputValue(newInputValue)}
                  onChange={(_event, newValue) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      Adi: newValue?.Adi || "",
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Müşteri İsmi İle Ara" />
                  )}
                  sx={{ width: 300,  marginLeft: '10px', marginBottom: '10px' }}
                />


         
      </Box>
   
<Grid>
      <Grid>    
   <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box
    component="form"
    onSubmit={handleSubmit}
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: 1000,
      maxHeight: 600,
      bgcolor: 'background.paper',
      borderRadius: 4,
      boxShadow: 24,
      p: 4,
      overflow: 'auto',
    }}
  >
    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
      Müşteri Tanıtım Ekranı
    </Typography>

    {/* Tüm input alanlarını kapsayan grid */}
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
      {/* Her biri bir hücre */}
      <TextField
        select
        label="Müşteri Tipi"
        name="Tur"
        value={formData.Tur}
        onChange={(e) => {
          const Tur = e.target.value;
          setSelectedTur(Tur);
          setFormData({ ...formData, Tur });
        }}
        helperText="Lütfen müşteri tipini seçiniz!"
        FormHelperTextProps={{ sx: { color: 'red' } }}
        sx={{ flex: '1 1 calc(25% - 16px)' }}
      >
        {Tur.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        name="MusteriSorumlusu"
        label="Müşteri Sorumlusu"
        value={formData.MusteriSorumlusu}
        onChange={handleInputChange}
        disabled={formData.Tur === 'Bireysel Müşteri'}
        sx={{ flex: '1 1 calc(25% - 16px)' }}
      />

      <TextField
        name="Adi"
        label="Şahıs veya Şirket ismi"
        value={formData.Adi}
        onChange={handleInputChange}
        sx={{ flex: '1 1 calc(25% - 16px)' }}
      />

      <TextField
        name="Adres"
        label="Adres"
        value={formData.Adres}
        onChange={handleInputChange}
        sx={{ flex: '1 1 calc(25% - 16px)' }}
      />

      <MuiTelInput
        name="Telefon"
        label="Telefon"
        value={formData.Telefon}
        onChange={(value, info) => {
          setFormData({ ...formData, Telefon: info?.numberValue ?? value });
        }}
        defaultCountry="TR"
        sx={{ flex: '1 1 calc(25% - 16px)' }}
      />

      <TextField
        name="Email"
        label="Email"
        value={formData.Email}
        onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
        error={formData.Email.length > 0 && !isValidEmail(formData.Email)}
        helperText={
          formData.Email.length > 0 && !isValidEmail(formData.Email)
            ? 'Geçersiz email adresi.'
            : ''
        }
        type="email"
        sx={{ flex: '1 1 calc(25% - 16px)' }}
      />

      <TextField
        name="VergiNo"
        label="Vergi No"
        value={formData.VergiNo}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value) && value.length <= 10) {
            setFormData({ ...formData, VergiNo: value });
          }
        }}
        error={formData.VergiNo.length > 0 && formData.VergiNo.length !== 10}
        helperText={
          formData.VergiNo.length > 0 && formData.VergiNo.length !== 10
            ? 'Vergi numarası 10 haneli olmalıdır.'
            : 'Kurumsal müşteri ise!'
        }
        FormHelperTextProps={{ sx: { color: 'red' } }}
        inputProps={{ maxLength: 10, pattern: '[0-9]*' }}
        disabled={formData.Tur === 'Bireysel Müşteri'}
        sx={{ flex: '1 1 calc(25% - 16px)' }}
      />

      <TextField
        name="VergiDairesi"
        label="Vergi Dairesi"
        value={formData.VergiDairesi}
        onChange={handleInputChange}
        helperText="Kurumsal müşteri ise!"
        FormHelperTextProps={{ sx: { color: 'red' } }}
        disabled={formData.Tur === 'Bireysel Müşteri'}
        sx={{ flex: '1 1 calc(25% - 16px)' }}
      />

      <TextField
        name="TC"
        label="TC"
        value={formData.TC}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value) && value.length <= 11) {
            setFormData({ ...formData, TC: value });
          }
        }}
        error={formData.TC.length > 0 && formData.TC.length !== 11}
        helperText={
          formData.TC.length > 0 && formData.TC.length !== 11
            ? 'TC Kimlik numarası 11 haneli olmalıdır.'
            : ''
        }
        disabled={formData.Tur === 'Kurumsal Müşteri'}
        inputProps={{ maxLength: 11, pattern: '[0-9]*' }}
        sx={{ flex: '1 1 calc(25% - 16px)' }}
      />

      <TextField
        name="PostaNo"
        label="Posta No"
        value={formData.PostaNo}
        onChange={handleInputChange}
        sx={{ flex: '1 1 calc(25% - 16px)' }}
      />

      <TextField
        name="Ülke"
        select
        label="Ülke"
        value={formData.UlkeId || ''}
        onChange={(e) => {
          const UlkeId = parseInt(e.target.value, 10);
          setFormData({ ...formData, UlkeId });
        }}
        helperText="Lütfen ülkeyi seçiniz!"
        sx={{ flex: '1 1 calc(25% - 16px)' }}
      >
        {country.map((countryOption) => (
          <MenuItem key={countryOption.Value} value={Number(countryOption.Value)}>
            {countryOption.Text}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        name="Şehir"
        select
        label="Şehir"
        value={formData.SehirId || ''}
        onChange={(e) => {
          const SehirId = parseInt(e.target.value, 10);
          setFormData({ ...formData, SehirId });
        }}
        helperText="Lütfen şehri seçiniz!"
        sx={{ flex: '1 1 calc(25% - 16px)' }}
      >
        {city.map((cityOption) => (
          <MenuItem key={cityOption.Value} value={Number(cityOption.Value)}>
            {cityOption.Text}
          </MenuItem>
        ))}
      </TextField>
    </Box>

    {/* Butonlar */}
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
      <Button type="button" variant="contained" color="error" onClick={resetForm}>
        Formu Temizle
      </Button>
      <Button type="submit" variant="contained" color="success" disabled={isLoading}>
        {isLoading ? 'Yükleniyor...' : 'Kaydet'}
      </Button>
    </Box>
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
          columns={columns.map((column) => ({
            ...column,
            flex: 1,
            minWidth: 100,}
          ))}
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
            setSelectedRow(newSelectionModel  as number[]);
          }}
          disableColumnMenu={false}
          columnBufferPx={columns.length} // Tüm sütunları hemen render et
          sx={{
            width: '100%',
            height: '100%',
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


      </Grid>
    </Grid>
    </>
  )
}


export default Customers


