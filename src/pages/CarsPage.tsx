
import React, { useEffect, useState } from 'react'
import gif from '../images/Under-constructıon.gif';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Navbar from '../components/Navbar';
import { Box, Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography, useTheme } from '@mui/material';
import axios from '../config/AxiosConfig';
import { toast } from 'react-toastify';
import Modal from '@mui/material/Modal';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';




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
    Plaka: string;
    Marka: string;
    Model: string;
    Yıl: number;
    SasiNo: string;
    YakitTur:string;
    Renk:string;
    MotorHacim:number;
    MotorBeygir:number;
    Km:number;
    MüşteriTipi: "",
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

//Müşteri tipi
const müsteriTipi = [
  { value: 'bireysel', label: 'Bireysel' },
  { value: 'kurumsal', label: 'Kurumsal' },
];


function CarsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading]=useState(false);
  const [carsData, setCarsData] = useState<FormData[]>([]); // Müşeri verilerinin alma
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  }

  const isSmallScreen = useMediaQuery('(max-width:1366px)'); // Küçük ekranlar
  const isLargeScreen = useMediaQuery('(min-width:1920px)'); // Büyük ekranlar


  const [formData, setFormData] = useState<FormData>({
    Plaka: "",
    Marka: "",
    Model: "",
    Yıl: 0,
    SasiNo: "",
    YakitTur:"",
    Renk:"",
    MotorHacim:0,
    MotorBeygir:0,
    Km:0,
    MüşteriTipi:"",
  });

  const resetForm : ()=> void =() => {
    setFormData({
    Plaka: "",
    Marka: "",
    Model: "",
    Yıl: 0,
    SasiNo: "",
    YakitTur:"",
    Renk:"",
    MotorHacim:0,
    MotorBeygir:0,
    Km:0,
    MüşteriTipi:"",
    })
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
    
    try {
      const response = await axios.post("/member/Arac/CreateArac", formData);
      toast.success("Kayıt Başarılı");
      resetForm();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Bilinmeyen bir hata oluştu.";
      toast.error(`Hata: ${errorMessage}`);
    } finally {
      setIsLoading(false); 
    }
  };

  //Müşteri verilerini alma.

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await axios.get(`/member/Arac/AracList`);
        const fetchedData = Array.isArray(response.data) ? response.data : response.data.results || [];
        setCarsData(fetchedData)
      } catch (error) {
        console.log("Veri alınırken hata oluştu", error);
        toast.error("Veriler alınırken bir sorun oluştu.");    
      }
    };
    fetchCars();
  },[]);

  
//Table Yapısı

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'Plaka', headerName: 'Plaka', width: 125 },
  { field: 'Marka', headerName: 'Marka', width: 125 },
  { field: 'Yıl', headerName: 'Yıl', width: 125 },
  { field: 'SasiNo', headerName: 'Sasi No', width: 125 },
  { field: 'YakitTur', headerName: 'Yakit Tur', width: 125 },
  { field: 'Renk', headerName: 'Renk', width: 125 },
  { field: 'MotorHacim', headerName: 'Motor Hacim', width: 125 },
  { field: 'MotorBeygir', headerName: 'Motor Beygir', width: 125 },
  { field: 'Km', headerName: 'Km', width: 125 },
  { field: 'MüşteriTipi', headerName: 'Müşteri Tipi', width: 125 },
];


const rows = carsData.map((cars,index) => ({
  id:index+1,
  Plaka: cars.Plaka,
  Marka: cars.Marka,
  Model: cars.Model,
  Yıl:cars.Yıl,
  SasiNo: cars.SasiNo,
  YakitTur: cars.YakitTur,
  Renk: cars.Renk,
  MotorBeygir: cars.MotorBeygir,
  Km: cars.Km,
  MüşteriTipi:cars.MüşteriTipi,
}));


const paginationModel = { page: 0, pageSize: 5 };

  return (
    <>
      <Box
        style={{
          marginLeft: "10%", 
          marginTop: "20px", 
        }}
      >
        <Button style={{marginBottom:'10px'}} variant="contained" onClick={handleOpen}>
          Yeni Araç Ekleyin
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
          Araç Tanıtım Ekranı
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
             {/* İsim Alanı */}
             <TextField
              id="Plaka"
              name="Plaka"
              label="Plaka"
              value={formData.Plaka}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
              />

              {/* Adres Alanı */}
              <TextField
              id="Marka"
              name="Marka"
              label="Marka"
              value={formData.Marka}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
              />

              {/* Telefon Alanı */}
              <TextField
              id="Model"
              name="Model"
              label="Model"
              value={formData.Model}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
              />

           
                <TextField
                  id="Yıl"
                  name="Yıl"
                  label="Yıl"
                  type="number"
                  value={formData.Yıl}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      Yıl: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  sx={{ marginBottom: 2 }}
                />


          
              <TextField
              id="SasiNo"
              name="SasiNo"
              label="Sasi No"
              value={formData.SasiNo}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
              />

               
                <TextField
              id="YakitTur"
              name="YakitTur"
              label="Yakıt Türü"
              value={formData.YakitTur}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
              />

          
              <TextField
              id="Renk"
              name="Renk"
              label="Renk"
              value={formData.Renk}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
              />

              
              <TextField
              id="MotorHacim"
              name="MotorHacim"
              label="Motor Hacim"
              value={formData.MotorHacim}
              onChange={(e) => {
                setFormData((prevState) => ({
                  ...prevState,
                  MotorHacim: parseInt(e.target.value,10) || 0,
                }))
              }}
              sx={{ marginBottom: 2 }}
              />

            
                <TextField
                  id="MotorBeygir"
                  name="MotorBeygir"
                  label="Motor Beygir"
                  value={formData.MotorBeygir}
                  onChange={(e) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      MotorBeygir: parseInt(e.target.value, 10) || 0,
                    }))
                  }
                  sx={{ marginBottom: 2 }}
                />


              <TextField
              id="Km"
              name="Km"
              label="Km"
              value={formData.Km}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  Km: parseInt(e.target.value,10) || 0,
                }))
              }
              sx={{ marginBottom: 2 }}
            />
  

              {/* Müşteri Tipi */}
            <TextField
            id="MüşteriTipi"
            name="MüşteriTipi"
            select
            label="Müşteri Tipi"
            value={formData.MüşteriTipi}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            helperText='Lütfen müşteri tipini seçiniz!'
            >
              {müsteriTipi.map((option) => (
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
        <Box
          sx={{
            height: isSmallScreen
              ? '70vh' // Küçük ekranlarda daha az yükseklik
              : isLargeScreen
              ? '90vh' // Büyük ekranlarda daha fazla yükseklik
              : '80vh', // Orta ekranlar
            width: '100%',
          }}
        >
          <Paper
            sx={{height: 'calc(100vh - 200px)', width: '100%', overflow: 'hidden'}}
          >
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              sx={{
                width: '100%',
                height: '100%',
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


export default CarsPage;