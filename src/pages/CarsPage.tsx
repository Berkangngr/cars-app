
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CarRepairIcon from '@mui/icons-material/CarRepair';

//Genel Formdatamızın interface'i
interface FormData {
  Plaka: string;
  Marka: string;
  Model: string;
  Yil: number | null;
  SasiNo: string;
  YakitTur: string;
  Renk: string;
  MotorHacim: number | null;
  MotorBeygir: number | null;
  Km: number | null;
  // BakimKM?: number | null; // Opsiyonel olabilir
  FirmaSahisId: number; // MüşteriİsmiId yerine bu kullanılmalı
}

//Araba marka ve modelleri
const carsBrandData: Record<string, string[]> = {
  Audi: ["A3", "A4", "Q5", "Q7"],
  BMW: ["3 Series", "5 Series", "X3", "X5"],
  Chevrolet: ["Spark", "Cruze", "Malibu", "Equinox"],
  Citroën: ["C3", "C4", "C5 Aircross"],
  Dacia: ["Duster", "Sandero", "Logan"],
  Fiat: ["500", "Panda", "Tipo", "Egea"],
  Ford: ["Focus", "Fiesta", "Mustang", "Kuga"],
  Honda: ["Civic", "Accord", "CR-V", "Jazz"],
  Hyundai: ["i20", "i30", "Tucson", "Kona"],
  Kia: ["Rio", "Sportage", "Sorento", "Picanto"],
  Mazda: ["Mazda3", "Mazda6", "CX-5", "MX-5"],
  "Mercedes-Benz": ["A-Class", "C-Class", "E-Class", "GLC"],
  Mini: ["Cooper", "Countryman", "Clubman"],
  Mitsubishi: ["Lancer", "Outlander", "ASX"],
  Nissan: ["Micra", "Qashqai", "X-Trail", "Leaf"],
  Opel: ["Corsa", "Astra", "Insignia", "Grandland"],
  Peugeot: ["208", "308", "508", "3008"],
  Porsche: ["911", "Cayenne", "Macan", "Panamera"],
  Renault: ["Clio", "Megane", "Kadjar", "Captur"],
  Seat: ["Ibiza", "Leon", "Ateca", "Arona"],
  Skoda: ["Fabia", "Octavia", "Superb", "Karoq"],
  Subaru: ["Impreza", "Outback", "Forester", "XV"],
  Suzuki: ["Swift", "Vitara", "Baleno", "Jimny"],
  Tesla: ["Model S", "Model 3", "Model X", "Model Y"],
  Toyota: ["Corolla", "Camry", "RAV4", "Yaris"],
  Volkswagen: ["Polo", "Golf", "Passat", "Tiguan"],
  Volvo: ["XC40", "XC60", "XC90", "S60"]
};

//Gelen musteri isimlerinin interface'i 
  interface musterıIsmı {
    Value:string;
    Text:string;
  }

  let carsFuel: string[] = ["Benzin","Dizel"];

  

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




function CarsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading]=useState(false);
  const [carsData, setCarsData] = useState<FormData[]>([]); // Müşteri verilerinin alma
  const [customersId, setCustomersId] = useState<{ Value: string; Text: string }[]>([]);
  const [selectedCustomers,setselectedCustomers] = useState <any> ("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  } 
  const [selectedCarsBrand, setSelectedCarsBrand] = useState<string>("Audi");
  const [models, setModels] = useState<string[]>(carsBrandData["Audi"] || []);
  const [selectedModels, setSelectedModels] = useState<string>("");
  const [selectedCarsFuel, setSelectedCarsFuel] = useState("Benzin");
  


  const isSmallScreen = useMediaQuery('(max-width:1366px)'); // Küçük ekranlar
  const isLargeScreen = useMediaQuery('(min-width:1920px)'); // Büyük ekranlar


  //Araba marka ve model için fonksiyon
  const handleChangeCarsBrand = (e: React.ChangeEvent<HTMLInputElement>) => {
    const brand = e.target.value as string;
    console.log("Seçilen Marka:", brand);
    setSelectedCarsBrand(brand);
  
    // Seçilen marka için modellere ulaşın
    const brandModels = carsBrandData[brand] || [];
    setModels(brandModels); // BURADA models state'ini güncelliyoruz
  
    // Markanın modelleri varsa, varsayılan olarak ilk modeli seçin
    const selectedModel = brandModels.length > 0 ? brandModels[0] : "";
    setSelectedModels(selectedModel);
  
    // Sadece marka için model varsa formData'yı güncelleyin (boş model göndermemek için)
    if (brandModels.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        Marka: brand,
        Model: selectedModel,
      }));
    }
  };
  

  const handleChangeModels = (e: any) => {
    const model = e.target.value as string;
    console.log("Seçilen Model:", model);
    setSelectedModels(model);
  };
  

//Araç yakıtını seçme fonksiyonu
const handleChangeCarsFuel = (e : React.ChangeEvent<HTMLInputElement>) => {
  const selectedFuel = e.target.value;
  console.log("Seçilen Marka:", selectedFuel);
  setSelectedCarsFuel(selectedFuel);
}

  const [formData, setFormData] = useState<FormData>({
    Plaka: "",
    Marka: selectedCarsBrand,
    Model: selectedModels,
    Yil:   null,
    SasiNo: "",
    YakitTur:selectedCarsFuel,
    Renk:"",
    MotorHacim:null,
    MotorBeygir:null,
    Km:null,
    // BakimKM:null,
    FirmaSahisId:0,
  });

  const resetForm: () => void = () => {
    const sonBakimDate = new Date();  // Bu, güncel tarihi alır
    const siradakiBakimDate = new Date(sonBakimDate); // Son bakımı kopyalayalım
    siradakiBakimDate.setFullYear(siradakiBakimDate.getFullYear() + 1); // 1 yıl ekliyoruz
    setFormData({
      Plaka: "",
      Marka: "",
      Model: "",
      Yil: null,
      SasiNo: "",
      YakitTur: "",
      Renk: "",
      MotorHacim: null,
      MotorBeygir: null,
      Km: null,
      // BakimKM:null,
      FirmaSahisId: 0, // Sıfırlama
    });
    setselectedCustomers(""); // Varsayılan değere döndürme
  };
  

  
  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:value,
    }))
  }

  //Müşteri verileririn çekme
useEffect(() => {

  const fetchFirmaSahisId = async () => {
    try {
      const response = await axios.get(`/Member/Arac/CreateArac`);
      console.log(response.data.FirmaSahisler);
      setCustomersId(response.data.FirmaSahisler);
      console.log(customersId);
    } catch (error) {
      console.log("Hata!", error)
      toast.error("Müşteri bilgilerini alırken bir hata ile karşılaşıldı.")
    }
  }
  fetchFirmaSahisId()
},[])
 

  //Araç verilerini gönderme.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedFormData = { ...formData, Model: selectedModels };
    console.log("Gönderilecek formData:", updatedFormData);
    try {
      const response = await axios.post("/member/Arac/CreateArac", updatedFormData , {
        headers: {
          "Content-Type": "application/json", // JSON formatında veri gönderdiğinizden emin olun
        }
      });
      toast.success("Kayıt Başarılı");
      resetForm();
    } catch (error) {
      console.error("Hata:", error);
      toast.error("Kayıt sırasında bir hata oluştu.");
    }
  };
  

  //Araç verilerini alma

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

  //Araç silme fonksiyonu olacak
  const handleDeleteCar = () => {

  }

    //Araç Düzenleme fonksiyonu olacak
    const handleRepairCar = () => {

    }

  
//Table Yapısı

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 1 },
  { field: 'Plaka', headerName: 'Plaka', width: 100 },
  { field: 'Marka', headerName: 'Marka', width: 100 },
  { field: 'Yil', headerName: 'Yıl', width: 100 },
  { field: 'SasiNo', headerName: 'Sasi No', width: 100 },
  { field: 'YakitTur', headerName: 'Yakit Tur', width: 100 },
  { field: 'Renk', headerName: 'Renk', width: 100 },
  { field: 'MotorHacim', headerName: 'Motor Hacim', width: 100 },
  { field: 'MotorBeygir', headerName: 'Motor Beygir', width: 100 },
  { field: 'Km', headerName: 'Km', width: 50 },
  { field: 'BakimKM', headerName: 'Bakım Km', width: 50 },
  { field: 'SonBakim', headerName: 'Son Bakım Tarih', width: 100 },
  { field: 'SiradakiBakim', headerName: 'Sıradaki Bakım Tarih', width: 100 },
  { field: 'FirmaSahisId', headerName: 'Müşteri İsmi', width: 100 },
];


const rows = carsData.map((cars,index) => ({
  id:index+1,
  Plaka: cars.Plaka,
  Marka: cars.Marka,
  Model: cars.Model,
  Yil:cars.Yil,
  SasiNo: cars.SasiNo,
  YakitTur: cars.YakitTur,
  Renk: cars.Renk,
  MotorHacim:cars.MotorHacim,
  MotorBeygir: cars.MotorBeygir,
  Km: cars.Km,
  // BakimKM: cars.BakimKM,
  FirmaSahisId:cars.FirmaSahisId,
}));


const paginationModel = { page: 0, pageSize: 5 };

  return (
    <>
      <Box
       style={{
        marginLeft: "5%", // Sola yakın ama biraz sağa kayması için
        marginTop: "20px", // Yukarıdan bir boşluk"
      }}
      >
        <Button  style={{marginBottom:'10px'}} variant="contained" onClick={handleOpen}>
         <CarRepairIcon style={{marginRight:'5px'}}/> Yeni Araç Ekleyin
        </Button>
        <Button style={{marginBottom:'10px',marginLeft:'10px'}} variant='contained' color="error"
        onClick={() => { 
          handleDeleteCar(); 
    }}>
          <DeleteIcon style={{marginRight:'5px'}} /> Satırı Silin
        </Button>

        <Button style={{marginBottom:'10px',marginLeft:'10px', backgroundColor:"#F3C623"}} variant='contained' onClick={() => {
          handleRepairCar();
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
          Araç Tanıtım Ekranı
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
             {/* Plaka Alanı */}
             <TextField
              id="Plaka"
              name="Plaka"
              label="Plaka"
              value={formData.Plaka}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
              />

              {/* Marka Alanı */}
              
              <TextField
                id="Marka"
                name="Marka"
                select
                label="Marka"
                value={selectedCarsBrand}
                onChange={handleChangeCarsBrand}
                sx={{ marginBottom: 2 , minWidth: '222px' }}
              >
                {Object.entries(carsBrandData).map(([brand, models]) => (
                  <MenuItem key={brand} value={brand}>
                    {brand}
                  </MenuItem>
                ))}
              </TextField>

                
              {/* Model Alanı */}
              <TextField
                  id="Model"
                  name="Model"
                  select
                  label="Model"
                  value={selectedModels} // Burada state bağlı olmalı
                  onChange={handleChangeModels} // Değer değişiminde çalışır
                  sx={{ marginBottom: 2, minWidth: '222px' }}
                >
                  {models.map((model, index) => (
                    <MenuItem key={index} value={model}>
                      {model}
                    </MenuItem>
                  ))}
                </TextField>


          {/* Yıl alanı */}
              <TextField
                id="Yil"
                name="Yil"
                label="Yıl"
                value={formData.Yil || ''} // Eğer formData.Yil null ise, boş bir string göster
                onChange={(e) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    Yil: e.target.value ? parseInt(e.target.value, 10) : null, // Eğer değer yoksa null gönder
                  }))
                }
                sx={{ marginBottom: 2 }}
              />


              {/* Şasi No */}
              <TextField
              id="SasiNo"
              name="SasiNo"
              label="Sasi No"
              value={formData.SasiNo}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
              />

               {/* Yakıt türü */}
                <TextField
              id="YakitTur"
              name="YakitTur"
              select
              label="Yakıt Türü"
              value={selectedCarsFuel}
              onChange={handleChangeCarsFuel}
              sx={{ marginBottom: 2, minWidth: '222px' }}
              >
                {carsFuel.map((option :any,index) =>
                <MenuItem key={index} value={option} >
                {option}
                </MenuItem>
                )}
                </TextField>

          
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
              type="number"
              value={formData.MotorHacim || ''}
              onChange={(e) => {
                setFormData((prevState) => ({
                  ...prevState,
                  MotorHacim: e.target.value ? parseFloat(e.target.value) : null,
                }))
              }}
              sx={{ marginBottom: 2 }}
              />

            
                <TextField
                  id="MotorBeygir"
                  name="MotorBeygir"
                  label="Motor Beygir"
                  type="number"
                  value={formData.MotorBeygir || ''}
                  onChange={(e) => {
                    setFormData((prevState) => ({
                      ...prevState,
                    MotorBeygir: e.target.value ? parseFloat(e.target.value) : null,
                    }))
                  }
                  }
                 
                  sx={{ marginBottom: 2 }}
                />


              <TextField
              id="Km"
              name="Km"
              label="Km"
              type="number"
              value={formData.Km || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value,10) :null;
                setFormData((prevState) => ({
                  ...prevState,
                  Km:value,
                }))
              }
              }
              sx={{ marginBottom: 2 }}
            />

              {/* Bakım Km
              <TextField
  id="BakimKm"
  name="BakimKm"
  label="Bakım Km"
  type="number"
  value={formData.BakimKM || ''}
  onChange={(e) => {
    const value = e.target.value ? parseInt(e.target.value, 10) : null;
    setFormData((prevState) => ({
      ...prevState,
      BakimKM: value,
    }));
  }}
  sx={{ marginBottom: 2 }}
/> */}


{/* Burada yaptığımız müşteri verileri bize string olarak geliyorlar biz onu integeera çeviriyoruz çünkü backend bizden integer bekliyor. */}

              {/* Müşteri İsim */}
              <TextField
  id="FirmaSahisId"
  name="FirmaSahisId"
  select
  label="Müşteri İsmi"
  value={selectedCustomers}
  onChange={(e) => {
    const selectedValue = e.target.value;
    console.log(selectedValue);

    const numericValue = selectedValue ? parseInt(selectedValue, 10) : 0;

    setselectedCustomers(selectedValue); // Seçilen müşteri ID'sini güncelleyin
    setFormData((prevState) => ({
      ...prevState,
      FirmaSahisId: numericValue, // Form verisini güncelleyin
    }));
  }}
  sx={{ marginBottom: 2, minWidth: '222px' }}
  helperText="Lütfen müşteri ismini seçiniz!"
>
  {customersId.map((option) => (
    <MenuItem key={option.Value} value={option.Value}>
      {option.Text}
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