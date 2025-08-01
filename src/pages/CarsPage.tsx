
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import CarRepairIcon from '@mui/icons-material/CarRepair';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Autocomplete, Box, Button, Grid, MenuItem, TextField, Typography } from '@mui/material';
import Modal from '@mui/material/Modal';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../config/AxiosConfig';
import { setGlobalLoading } from '../utils/globalLoading';






//Genel Formdatamızın interface'i
interface FormData {
  ID: number;
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
  FirmaAdi: string; // Müşteri ismi 
  RuhsatSeriNo: string;
}

//Araba marka ve modelleri
const carsBrandData: Record<string, string[]> = {
  AİON:["","S"],
  "ALFA ROMEO": ["", "Giulia","Giulia Quadrifoglio", "145","146","147","155","156","159","164","166","33","75","Brera","GT","GTV","Spider","STELVIO","JUNIOR ELETTRICA","JUNIOR IBRIDA","TONALE","4C", "Giulietta", "MiTo"],
  ANADOL:["","A","SV"],
  ARORA:["","S1"],
  "ASTON MARTIN": ["", "DB7","DB9","DBS","Vantage","Vanquish", "DB11","Virage","DBS Superleggera", "DBX", "Rapide", "Valhalla"],
  AUDI: ["", "A1","A2", "A3", "A4", "A5","A6", "A6 e-tron", "A7", "A8","E-Tron","E-TRON SPORTBACK","Q2","Q3","Q3 SPORTBACK","Q4 E-TRON","Q4 SPORTBACJ","Q5","Q5 SPORTBACK","Q6 E-TRON","Q7","Q8","Q8 E-TRON","Q8 E-TRON SPORTBACK","RS Q8","SQ7","R9","RS","S Serisi","TT","TTS","80 Serisi","90 Serisi","100 Serisi","Cabrio"], 
  BENTLEY: ["", "Continental GT", "Flying Spur", "Bentayga", "Mulsanne", "EXP 100"],
  BMW: ["", "1 SERIES", "2 SERIES", "3 SERIES", "4 SERIES", "5 SERIES", "6 SERIES", "7 SERIES", "8 SERIES","İ Serisi","M Serisi","Z Serisi","IX","IX1","IX2","IX3","X1","X2","X3","X4","X5","X6","X7"],
  BUİCK:["","Century","Le Sabre","Park Avenue","Regal","Riviera","Skylar"],
  BYD: ["", "Atto 3", "Seal", "Tang", "Han", "Yuan", "Dolphin", "Seal U","ATTO 3 EV","SEAL U","SEAL U EV"],
  CADILLAC: ["", "CTS","BLS","Brougham","DeVille","Eldorado","Fleetwood ","Seville","STS","SRX","CT4", "CT5", "ESCALADE", "XT4", "XT5", "XT6", "LYRIQ"],
  CHERY:["","Alia","Amulet","Chance","Kimo","Niche","OMADA 5","OMADA 5 PRO","TIGGO 3","TIGGO 7 PRO","TIGGO 7 PRO MAX","TIGGO 8 PRO","TIGGO 8 PRO MAX"],
  CHEVROLET: ["", "AVEO","CAMARO","CAPRİCE","EPİCA","EVANDA","IMPALA","LACETTİ","LUMİNA","MALİBU","MONTE CARLO","REZZO","SPARK", "SONIC", "CRUZE", "MALIBU", "EQUINOX", "TRAX", "BLAZER", "SUBURBAN", "TAHOE", "COLORADO",  "SILVERADO","Avalanche","CAPTIVA","EQUINOX","HHR","TRAVERSE"],
  CHRYSLER: ["", "300 C","300 M","CONCORDE","CROSSFİRE","LHS","NEON","PT CRUİSER","SEBRİNA","STRATUS", "Pacifica"],
  CITROEN: ["","AMI","C-Elysée","C1","C2", "C3","e-C3","C3 PİCASSO", "C3 AIRCROSS", "C4","C4 GRAND PİCASSO","C4 PİCASSO","C4X","e-C4","e-C4X", "C-CROSSER","C4 CACTUS","C5","C6","C8","SAXO","XSARA","EVASİON","BX","AV","XANTİA","XM","ZX", "C5 AIRCROSS", "DS3", "DS4", "DS7"],
  CUPRA:["","BORN","LEON","ATECA","FORMENTOR","TERRAMAR"],
  DACIA: ["", "SANDERO", "LOGAN", "DUSTER", "Lodgy", "Dokker", "Jogger","NOVA","SOLENZA","SANDERO STAPWAY","SPRINT"],
  DAEWOO:["","Chairman","NEXİA","NUBİRA","ESPERO","LANOS","LEGANZA","MATİZ","RACER","TİCO","MUSSO"],
  DAİHATSU:["","CUORE","MATERİA","SİRİON","APPLAUSE","CHARADE","COPEN","YRV","FEROZA","TERIOS"],
  DFSK:["","E5","FENGON"],
  DODGE: ["", "AVENGER","Challenger", "Charger","MAGNUM", "Durango", "JOURNEY", "RAM","NITRO","CALIBER"],
  "DS AUTOMOBİLES":["","DS 3","DS 4","DS 5","DS 9","DS3 CROSSBACK","DS5 CROSSBACK"],
  FERRARI: ["", "Roma", "F8 Tributo", "SF90", "Purosangue", "296","360","430","458","488","550","575","599","812","CALİFORNİA","F12","F355","F8","FF","PORTOFİNO"],
  FORTHİNG:["","M4 U-TOUR","5T EVO"],
  FOTON:["","TUNDLAND G7"],
  FIAT: ["", "124 SPİDER","ALBEA","500","BRAVA","126 BİS","COUPE","CROMA","IDEA","LİNEA","MAREA","MİRAFİORİ","MULTİPLA","PALİO", "PANDA", "TIPO", "EGEA","PUNTO", "500X", "500L", "PULSAR", "DOBLO", "SCUDO","REGATA","SEDİCİ","SİENA","STİLO","TEMPRA","TOPOLİNO","ULYSSE","UNO","EGEA CORSS","FREEMONT","FULLBACK","SEDICI","600E"],
  FORD: ["","B-MAX","C-MAX","ESCORT","FUSİON","GALAXY","GRAND C-MAX","KA","MONDEO","S-MAX","TAURUS","COUGAR","CROWN VİCTORİA","FESTİVA","GRANADA","PROBE","SCORPİO","SİERRA","TAUNUS","THUNDERBİRD", "FOCUS", "FIESTA", "MUSTANG", "KUGA", "ECOSPORT", "EDGE", "EXPLORER", "EXPEDITION", "RANGER", "TRANSIT","BRONCO","BRONCO SPORT","ECHO SPORT","F","FLEX","PUMA","RANGER RAPTOR","ESCAPE","FREESTYLE"],
  GEELY:["","ECHO","EMGRAND","FAMİLİA","FC"],
  GMC:["","Acadia","CANYON","ENVOY","HUMMER","JIMMY","SIERRA","TERRAIN","TYPHOON","YUKON"],
  HONDA: ["","CİTY","CR-Z","CRX","E","FV","INTEGRA","LEGEND","PRELUDE", "S2000","SHUTTE","STREAM","CIVIC", "ACCORD", "CR‑V", "HR-V","ZR-V","JAZZ", "HR‑V", "ODYSSEY", "PILOT"],
  HYUNDAI: ["","ACCENT","ACCENT BLUE","ACCENT ERA","ATOS","COUPE","EXCEL","GENESİS","GETZ","GRANDUER" ,"I10", "I20","I20 ACTİVE","I20 N","I20 TROY","I30", "I40","BAYON","INSTER","IONİQ 6","IX20","IX35","IX55","MATRİX","S-COUPE","SONATA","TRAJET","GALLOPER","TERRACAN","ELANTRA", "IONIQ", "KONA", "TUCSON", "SANTA FE", "PALISADE", "VENUE"],
  HUMMER:["","H1","H2","H3"],
  IKCO:["","SAMAND"],
  JIAYUAN:["","EIDOLA"],
  KIA: ["", "CAPITAL","CARENS","CARNIVAL","CERATO","MAGENTIS","OPIRUS","OPTIMA","PRİDE","PICANTO", "RIO", "CEED", "PRO CEED","SEPHIA","SHUMA","STINGER", "SOUL","STONIC","SPORTAGE", "SORENTO","RENOTA","XCEED","EV3", "EV6", "K5", "K7", "NIRO", "TELLURIDE","VENGA",""],
  KUBA:["","CITY","M5"],
  LADA:["","KALINA","NOVA","PRIORA","SANARA","VAZ","VEGA","NIVA"],
  MAZDA: ["", "MAZDA2", "MAZDA3", "MAZDA5","MAZDA6","MPV","MX","PREMACY","121","323","626","929","LANTIS","RX","XEDOS", "CX‑3", "CX‑30", "CX‑5", "CX‑9", "MX‑5","B-SERİES"],
  "MERCEDES BENZ": ["", "A‑CLASS", "B‑CLASS", "C‑CLASS", "CLA", "CLS", "E‑CLASS", "AMG GT","CL","CLA","CLE","CLC","CLK","CLS","GLE", "GLC","GL","GLB","GLK", "GLS","ML","X","GLA", "G‑CLASS", "S‑CLASS", "SL", "SLC", "V‑CLASS", "EQC", "EQB", "EQE", "EQS","MAYBACH S","R-CLASS"],
  MINI: ["", "COOPER SD","COOPER S","HATCH/COOPER","JOHN COOPER","ONE","", "COUNTRYMAN", "COOPER CLUBMAN", "CONVERTIBLE", "ELECTRIC","PACEMAN"],
  MITSUBISHI: ["", "ATTRAGE","COLT","GALANT","LANCER EVOLUTION","3000GT","CARISMA","SPACE STAR", "PHEV", "LANCER", "ASX/OUTLANDER SPORT", "OUTLANDER","ECPLISE", "ECLIPSE CROSS","SIGMA","L200","PAJERO"],
  NISSAN: ["", "MICRA", "NOTE", "LEAF", "QASHQAI", "X‑TRAIL", "JUKE", "KICKS", "PATROL", "PATHFINDER", "ARiYA"],
  NIEVE:["","EVZOOM"],
  OPEL: ["","ADAM","AGILA","CALIBRA","CASCADA","CORSA","CORSA-E","GT-ROADSTAR","KAYETT","MERIVA","OMEGA","REKORT","SIGNUM","TIGRA","VECTRA",  "ASTRA", "INSIGNIA", "CROSSLAND","ANTARA","CROSSLAND X","FRONTERA", "MOKKA", "GRANDLAND", "COMBO", "VIVARO", "ZAFIRA"],
  PEUGEOT: ["", "106","107","108","205","206","206+","207","208","e-208","301","305","306","307","308","e-308", "2008", "405","406","407","408","4007","5008", "3008", "508","605","607","806","807","RCZ","1007", "RIFTER", "TRAVELLER", "E‑208", "E‑2008"],
  PORSCHE: ["", "911", "718", "928", "BOXSTER","CAYMAN","Cayenne", "Macan", "Panamera", "Taycan"],
  PROTON:["","GEN-2","SAGA","SAVVY","WAJA","218","315","316","415","416","418","420","PERSONA"],
  RENAULT: ["", "ESPACE","FLUENCE","FLUENCE Z.E","GRAND SCENIC","GRAND MODUS","LAGUNA","LATITUDE","MODUS","TWINGO","TWIZY","VEL SATIS", "CLIO", "MEGANE","MEGANE E-TECH","SAFRANE","SYMBOL","TALIANT","TALISMAN","KONDAR", "CAPTUR", "KADJAR", "ARKANA", "SCENIC", "KOLEOS", "TRAFIC","ZOE","R5 TECH","R 5","R 9","R 11","R 12","R 19 ","R 21","R 25"],
  ROVER:["","25","45","75","200","214","216","414","416","420","620","820","825","827","MGF","STREETWISE"],
  SAAB:["","9-3","9-5","900","9000"],
  SEAT: ["","ALHAMBRA","ALTEA","CORDOBA","EXEO","MARBELLA","TOLEDO", "Mii", "IBIZA", "LEON", "ATECA", "ARONA", "TARRACO"],
  SKODA: ["", "CITIGO", "FABIA","FAVORIT","FELICIA","FORMAN","RAPID","ROOMSTAR", "SCALA", "OCTAVIA", "ELROQ","ENYAQ","SUPERB", "KAMIQ", "KAROQ", "KODIAQ","YETI","FELICIA PICKUP"],
  SMART:["","FORTWO","FORFOUR","ROADSTAR"],
  SUBARU: ["", "IMPREZA", "LEGACY","JUSTY","VIVIO","XV", "FORESTER", "OUTBACK", "BRZ", "LEVORG","CROSSTREK","SOLTERRA","XV","TRIBECA"],
  SUZUKI: ["","ALTO","SPLASH", "SX4","WAGON R","LIANA","MARUTI","SWIFT", "BALENO", "VITARA","GRAND VITARA","SJ","X-90", "IGNIS", "CROSSOVER", "S‑CROSS", "JIMNY", "S‑PULSE"],
  SYKWELL:["","ET5"],
  SSANGYONG:["","ACTYON","ACTYON SPORTS","KORANDO","KORANDO SPORTS","KYRON","MUSSO","MUSSO GRAND","REXTON","TIVOLI","TORRES","XLV","RODIUS"],
  SWM:["","G01","G01F","G03F","G05 PRO"],
  TATA:["","INDICA","INDIGO","MARINA","VISTA","MANZA","TELCOLINE","XENON","SAFARI"],
  TESLA: ["", "MODEL S", "MODEL 3", "MODEL X", "MODEL Y", "CYBERTRUCK"],
  TOFAŞ:["","DOĞAN","KARTAL","MURAT","ŞAHİN","SERÇE"],
  TOGG:["","T10X"],
  TOYOTA: ["","AURIS","AVENSIS", "YARIS", "CARINA","CELICA","COROLLA","CORONA","CRESSIDA", "CAMRY","GT86","MR2", "PRIUS","SCARLET","SUPRA","TERCEL","URBAN CRUISER","VERSO", "C‑HR", "RAV4", "HIGHLANDER", "LAND CRUISER", "GR86", "YARIS CROSS", "SEQUOIA","COROLLA CROSS","FJ CRUISER","HILUX","FORTUNER","TUNDRA"],
  VOLKSWAGEN: ["", "BEETLE","BORA","CORRADO","EOS","ID.3","ID.7","JETTA","LUPO","Polo", "Golf", "Passat","PASSAT ALLTARCK","PASSAT VARIANT","PHATEON","SCIROCCO","SHARAN","TOURAN","UP CLUB","VW CC","VENTO","Arteon", "Tiguan", "Touareg", "Touran", "Up!", "ID.3", "ID.4","ID.6", "ID. Buzz","AMAROK","T-CROSS","T-ROC","TAIGO","TAYRON"],
  VOLVO: ["", "C30","C70","S40","S60","S70","S80","S90","S60","V40","V40 CROSS COUNTRY","V50","V60","V60 CROSS COUNTRY","V70","V90","V90 CROS COUNTRY","245","740","850","940","960", "XC40", "XC60","XC70", "XC90", "C40", "S90", "V90","EX40"],
  ACURA: ["", "ILX", "Integra", "TLX", "MDX", "RDX", "NSX"],
  BUGATTI: ["", "Chiron", "Divo", "Bolide", "Centodieci", "Veyron"],
  GENESIS: ["", "G70", "G80", "GV70", "GV80", "GV60"],
  INFINITI: ["","FX","QX","EX","Q30","Q50","G","I30", "M","Q60", "QX50", "QX55", "QX60", "QX80"],
  ISUZU:["","D-MAX","TROOPER"],
  JAGUAR: ["", "DAIMLER","F-TYPE","S-TYPE","SOVEREİNG","X-TYPE","XJ","XJ6","XJR","XJS","XK8","XKR","XF", "XE", "F‑PACE", "E‑PACE", "I‑PACE"],
  JEEP: ["", "Renegade", "Compass", "Wrangler", "Grand Cherokee", "Gladiator", "Cherokee","COMMANDER","PATRIOT","CJ"],
  "LAND ROVER": ["", "Discovery", "Defender", "Range Rover", "Range Rover Sport","DISCOVERY SPORT","RANGE ROVER EVOQUE", "Velar","FREELANDER"],
  LEXUS: ["","CT","GS","IS","LC","LS","LBX","RC", "UX", "NX", "RX", "GX", "LX", "IS", "ES", "LM","RZ"],
  LINCOLN: ["", "CONTINENTAL","LS","TOWN CAR","Corsair", "Aviator", "Nautilus", "Navigator", "Blackwood"],
  LAMBORGHINI:["","AVENTADIR","GALLARDO","HURACAN","REVUELTO","URUS"],
  LANCIA:["","DELTA","THEMA","YPSILON","PHEDRA","THESIS"],
  LOTUS: ["", "Emira","ESPIT", "Evija", "Eletre"],
  MASERATI: ["","Cambiocorsa","GranCabrio","GranCabrio E","GranTurismo","GranTurismo E","2.24V","SPYDER", "Ghibli", "Quattroporte", "Levante", "MC20","GRACALE"],
  MCLAREN: ["", "Artura", "GT", "720S", "765LT", "P1"],
  "ROLLS ROYCE": ["", "Phantom", "Ghost", "Wraith", "Cullinan", "Dawn", "Spectre"],
  XPENG: ["", "P7", "P5", "G6", "G9"],
  NIO: ["", "ET5", "ET7", "ES6", "ES8", "EC6"],
  ORA: ["", "Black Cat", "Good Cat"],
  MG: ["", "F","MG3","MG4","MG7","3","EHS", "MG5", "ZS", "HS","ZR","ZT"],
  OMODA: ["", "5", "C5", "E5"],
  JAECOO: ["", "7"],
  LYNK_CO: ["", "01", "02", "03", "05"],
  ZEEKR: ["", "001", "009"]
};



//Gelen musteri isimlerinin interface'i 
  // interface musterıIsmı {
  //   Value:string;
  //   Text:string;
  // }

  const carsFuel: string[] = ["Benzin","Dizel"];

  

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






function CarsPage() {
  // const navigate = useNavigate();
  const [isLoading,]=useState(false);
  const [carsData, setCarsData] = useState<FormData[]>([]); // Müşteri verilerinin alma
  const [customersId, setCustomersId] = useState<{ Value: string; Text: string }[]>([]);
  const [selectedCustomers,setselectedCustomers] = useState <any> ("");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  } 
  const [selectedCarsBrand, setSelectedCarsBrand] = useState<string>("");
  const [models, setModels] = useState<string[]>(carsBrandData[""] || []);
  const [selectedModels, setSelectedModels] = useState<string>("");
  const [selectedCarsFuel, setSelectedCarsFuel] = useState("Benzin");
  const [, setSelectedRow] = useState<any[]>([]); // Seçilen satır için state
  const [, setSelectedCarsId] = useState<string>(null as any);
  const [inputValue, setInputValue] = useState<string>(""); // Autocomplete için input değeri
  const [options, ] = useState<any[]>([]); // Autocomplete için seçenekler
  const [, setAracListesi] = useState<any[]>([]); // Araç listesini tutmak için state
  


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
  setFormData((prevFormData) => ({
    ...prevFormData,
    YakitTur: selectedFuel,
  }));
}

  const [formData, setFormData] = useState<FormData>({
    ID: null as any,
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
    FirmaAdi:"",
    RuhsatSeriNo:"",
  });

  const resetForm: () => void = () => {
    // const sonBakimDate = new Date();  // Bu, güncel tarihi alır
    // const siradakiBakimDate = new Date(sonBakimDate); // Son bakımı kopyalayalım
    // siradakiBakimDate.setFullYear(siradakiBakimDate.getFullYear() + 1); // 1 yıl ekliyoruz
    setFormData({
      ID: null as any,
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
      FirmaAdi:"",
      RuhsatSeriNo:"",
    });
    setselectedCustomers(""); // Varsayılan değere döndürme
    setModels(carsBrandData[""] || []); // Modelleri sıfırlama
    setSelectedCarsBrand(""); // Markayı sıfırlama
    setSelectedCarsFuel(""); // Yakıt türünü sıfırlama
  };
  

  
  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:value.toUpperCase(),
    }))
  }

  //Şasi no için fonksiyon 17 haneli olmalı

  const handleInputChangeSasiNo = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;

    if (value.length <= 17) {
      setFormData((prevState) => ({

        ...prevState,
        [name]:value.toUpperCase(),
      }))
    
    } 
  };

  // onBlur ile Sasi no hata mesajını kontrol edin
const handleBlurSasiNo = (e: React.FocusEvent<HTMLInputElement>) => {
  const { value } = e.target;

  if (value.length !== 17) {
    toast.error("Girdiğiniz şasi no 17 haneli olmalıdır!");
  }
};

  //Araç verilerini alma

 
    const fetchCars = async () => {
      
      try {
        setGlobalLoading(true)
        const response = await axios.get(`/api/Arac/AracList`);
        const fetchedData = Array.isArray(response.data) ? response.data : response.data.results || [];
        console.log("Gelen Araç Verileri:", fetchedData);
        setCarsData(fetchedData)
      } catch (error) {
        console.log("Veri alınırken hata oluştu", error);
        toast.error("Veriler alınırken bir sorun oluştu.");    
      }finally {
        setGlobalLoading(false)
      }
    };

    useEffect(() => {
      fetchCars(); // Bileşen yüklendiğinde verileri alın
    }, []);
 
 

 

  //Araç verilerini gönderme.
  const carsHandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalLoading(true);
    const updatedFormData = { ...formData, Model: selectedModels };
    console.log("Gönderilecek formData:", updatedFormData);

    try {

      const isUpdate = updatedFormData.ID && updatedFormData.ID > 0;

      const endPoint = isUpdate ? "/api/Arac/UpdateArac" : "/api/Arac/CreateArac";

      const response = await axios.post(endPoint, updatedFormData , {
        headers: {
          "Content-Type": "application/json", // JSON formatında veri gönderdiğinizden emin olun
        }
        // headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      toast.success(isUpdate ? "Araç başarıyla güncellendi." : "Kayıt başarılı.");
      resetForm();
      fetchCars(); // Verileri güncelleyin
      handleClose(); // Modalı kapatın
    } catch (error) {
      console.error("Hata:", error);
      toast.error("İşlem sırasında bir hata oluştu.");
    }finally{
      setGlobalLoading(false);
    }
  };

    //Müşteri verileririn çekme
useEffect(() => {

  const fetchFirmaSahisId = async () => {
    
    try {
      const response = await axios.get(`/api/Arac/CreateArac`);
      console.log(response);
      console.log(response.data.FirmaSahisler[0].Text);
      setCustomersId(response.data.FirmaSahisler);
      console.log(customersId);
    } catch (error) {
      console.log("Hata!", error)
      toast.error("Müşteri bilgilerini alırken bir hata ile karşılaşıldı.")
    }
  }
  fetchFirmaSahisId()
},[])
  



  //Araç silme fonksiyonu olacak
  const handleDeleteCar = async (id: number) => {
    console.log(id)
    const isConfirmed = confirm("Araç silinecek. Devam etmek istiyor musunuz?");
    if (!isConfirmed) {
      return; // Kullanıcı onay vermezse işlemi iptal et
    }
  
    // Silme işlemi için API çağrısı yapın
    try {
        const response = await axios.post(`api/Arac/AracPasif`, id, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          console.log("Araç silindi:", response.data);
          setCarsData((prevData) => prevData.filter((car) => car.ID !== id)); // Silinen aracı listeden çıkarın
          toast.success("Araç silindi.");
          fetchCars(); // Verileri güncelleyin
          
        } else {
          console.log("Araç silinemedi:", response.data);
          toast.error("Araç silinemedi.");
        }
        
    } catch (error) {
      console.log("Araç silinirken hata oluştu", error);
      toast.error("Araç silinirken bir hata oluştu.");
      
    }
  }


    //Araç Düzenleme fonksiyonu olacak
    const handleRepairCar = async (selectedRow: any) => {
      console.log(selectedRow)
      if (!selectedRow) {
        toast.error("Lütfen bir satır seçin!");
        return;
      }
      try {
          const response = await axios.get(`/api/Arac/UpdateArac?id=${selectedRow}`);
          console.log(JSON.stringify(response.data))
          setFormData({
            ID: response.data.ID || 0,
            Plaka: response.data.Plaka || "",
            Marka: response.data.Marka || "",
            Model: response.data.Model || "",
            Yil: response.data.Yil || 0,
            SasiNo: response.data.SasiNo || "",
            YakitTur: response.data.YakitTur || "",
            Renk: response.data.Renk || "",
            MotorHacim: response.data.MotorHacim || 0,
            MotorBeygir: response.data.MotorBeygir || 0,
            Km: response.data.Km || 0,
            FirmaSahisId: response.data.FirmaSahisId || 0,
            FirmaAdi: response.data.FirmaAdi || "",
            RuhsatSeriNo:response.data.RuhsatSeriNo || "",
          });
          setSelectedCarsBrand(response.data.Marka || ""); // Seçilen markayı state'e kaydediyoruz
          setModels(carsBrandData[response.data.Marka] || []); // Seçilen modeli state'e kaydediyoruz
          setSelectedModels(response.data.Model || ""); // Seçilen modeli state'e kaydediyoruz  
          setselectedCustomers(response.data.FirmaSahisId.toString() || ""); // Seçilen müşteriyi state'e kaydediyoruz
          setSelectedCarsId(selectedRow); // Seçilen aracın ID'sini state'e kaydediyoruz
          handleOpen();// Modalı açıyoruz
          
      } catch (error) {
        console.log("Araç bilgileri güncellenirken bir hata oluştu", error);
        toast.error("Araç bilgileri güncellenirken bir hata oluştu.");
      }
    }

  

    const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedValue = e.target.value;
      setselectedCustomers(selectedValue);
      setFormData((prev) => ({
        ...prev,
        FirmaSahisId: Number(selectedValue),
      }));
    };

    // Müşteri ismine göre filtreleme yapma
    // Müşteri ismine göre filtreleme yapma
    useEffect(() => {
      const delayDebounce = setTimeout(() => { 
        if (inputValue.length >= 2) {
          axios.get(`/api/Arac/AracListeWithFirmaSahisAd?FirmaSahisAd=${inputValue}`)
          .then((response) => {
            // Önemli: Burada her öğenin benzersiz bir ID'ye sahip olduğundan emin olmalıyız
            const gelenVeri = response.data.map((item: any) => ({
              // id alanı her satır için kesinlikle olmalı ve benzersiz olmalı
              ID: item.a?.ID, // Ana ID alanı için
              id: item.a?.ID, // DataGrid için gerekli olan id alanı
              FirmaSahisAdi: item.FirmaSahis?.Adi ?? "",
              Plaka: item.a?.Plaka || "",
              Marka: item.a?.Marka || "",
              Model: item.a?.Model || "",
              Yil: item.a?.Yil || null,
              SasiNo: item.a?.SasiNo || "",
              YakitTur: item.a?.YakitTur || "",
              Renk: item.a?.Renk || "",
              MotorHacim: item.a?.MotorHacim || null,
              MotorBeygir: item.a?.MotorBeygir || null,
              Km: item.a?.Km || null,
              FirmaAdi: item.FirmaSahis?.Adi ?? "", // FirmaAdi alanını da ekledik
            }));
            console.log("Gelen Araç Listesi:", gelenVeri);
            setAracListesi(gelenVeri); // Gelen veriyi options state'ine kaydediyoruz
            // Hatalı veri veya id eksikse hiç set etme
            if (gelenVeri.every((item: { id: any; }) => item.id)) {
              setCarsData(gelenVeri); // Gelen veriyi carsData state'ine kaydediyoruz
            } else {
              console.error("Bazı satırlarda id değeri eksik, veriler yüklenmedi.");
              toast.error("Arama sonuçları yüklenirken bir hata oluştu.");
            }
          })
          .catch((error) => {
            console.error("Hata:", error);
            toast.error("Arama sırasında bir hata oluştu.");
          });
        } else {
          setAracListesi([]); // Eğer input değeri 2 karakterden azsa seçenekleri temizle
        }
    }, 300);

    if (inputValue.length === 0) {
      setAracListesi([]); // Eğer input değeri boşsa seçenekleri temizle 
      fetchCars();
    }

    return () => clearTimeout(delayDebounce); // Temizleme fonksiyonu
  }, [inputValue]);
  
//Table Yapısı

const columns: GridColDef[] = [
  
  { field: 'Plaka', headerName: 'Plaka', width: 100,headerAlign: 'center' , align: 'center' },
  { field: 'Marka', headerName: 'Marka', width: 100,headerAlign: 'center' , align: 'center' },
  { field: 'Model', headerName: 'Model', width: 100,headerAlign: 'center' , align: 'center' },
  { field: 'Yil', headerName: 'Yıl', width: 100,headerAlign: 'center' , align: 'center' },
  { field: 'SasiNo', headerName: 'Sasi No', width: 100,headerAlign: 'center' , align: 'center' },
  { field: 'RuhsatSeriNo', headerName: 'Ruhsat Seri No', width: 100,headerAlign: 'center' , align: 'center' },
  { field: 'YakitTur', headerName: 'Yakit Tur', width: 100,headerAlign: 'center' , align: 'center' },
  { field: 'Renk', headerName: 'Renk', width: 100,headerAlign: 'center' , align: 'center' },
  { field: 'MotorHacim', headerName: 'Motor Hacim', width: 100,headerAlign: 'center' , align: 'center' },
  { field: 'MotorBeygir', headerName: 'Motor Gücü(kW)', width: 100,headerAlign: 'center' , align: 'center' },
  { field: 'Km', headerName: 'Km', width: 50,headerAlign: 'center' , align: 'center' },
  // { field: 'BakimKM', headerName: 'Bakım Km', width: 50 ,headerAlign: 'center' , align: 'center'},
  // { field: 'SonBakim', headerName: 'Son Bakım Tarih', width: 100,headerAlign: 'center' , align: 'center' },
  // { field: 'SiradakiBakim', headerName: 'Sıradaki Bakım Tarih', width: 100,headerAlign: 'center' , align: 'center' },
  { field: 'FirmaAdi', headerName: 'Müşteri İsmi', width: 100,headerAlign: 'center' , align: 'center' },
  {field: 'actions', headerName: 'İşlemler', width: 100, headerAlign: 'center' , align: 'center', sortable: false,
  renderCell: (params) => (
    <div style={{ width:'75px', display: 'flex', justifyContent: 'space-between' }}>
    <div>
    <EditIcon onClick={() => handleRepairCar(params.row.id)}
      style={{ cursor: 'pointer', marginLeft:'10px',marginTop:'15px', color:'#F3C623', fontSize:'25px', opacity:'0.8' } }
      ></EditIcon>
    </div>
    <div>
    <DeleteIcon onClick={() => handleDeleteCar(params.row.id)}
    style={{ cursor: 'pointer', marginLeft:'10px',marginTop:'15px', color:'red', fontSize:'25px',opacity:'0.8' } }>
    </DeleteIcon>
    </div>
  </div>
  )}
];


const rows = carsData.map((cars) => ({
  id: cars.ID,
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
  FirmaAdi:cars.FirmaAdi,
  RuhsatSeriNo:cars.RuhsatSeriNo,
}));


const paginationModel = { page: 0, pageSize: 100 };

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
        <Button  style={{marginBottom:'10px'}} variant="contained" onClick={handleOpen}>
         <CarRepairIcon sx={{ marginRight:'5px'}}/> Yeni Araç Ekleyin
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
                            <TextField {...params} label="Müşteri İsmi İle Ara" id='' />
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
        <Box sx={style}
         component="form"
         onSubmit={carsHandleSubmit}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
          Araç Tanıtım Ekranı
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                {/* Burada yaptığımız müşteri verileri bize string olarak geliyorlar biz onu integeera çeviriyoruz çünkü backend bizden integer bekliyor. */}

                                {/* Müşteri İsim */}
                                <TextField
                    id="FirmaSahisId"
                    name="FirmaSahisId"
                    select
                    label="Müşteri İsmi"
                    value={selectedCustomers}
                    onChange={handleCustomerChange}
                    sx={{ marginBottom: 2, minWidth: '222px' }}
                    helperText="Lütfen müşteri ismini seçiniz!"
                       FormHelperTextProps={{
                sx:{
                  color: 'red',
                },
              }}
                  >
                    {customersId.map((option) => (
                      <MenuItem key={option.Value} value={option.Value}>
                        {option.Text}
                      </MenuItem>
                    ))}
                  </TextField>

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
                {Object.entries(carsBrandData).map(([brand]) => (
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
              onChange={handleInputChangeSasiNo}
              onBlur={handleBlurSasiNo}
              sx={{ marginBottom: 2 }}
              />

              {/*Ruhsat Seri No*/}
              <TextField 
              id='RuhsatSeriNo'
              name='RuhsatSeriNo'
              label='Ruhsat Seri No'
              value={formData.RuhsatSeriNo}
              onChange={handleInputChange}
              sx={{ marginBottom: 2 }}
              />

               {/* Yakıt türü */}
                <TextField
              id="YakitTur"
              name="YakitTur"
              select
              label="Yakıt Türü"
              value={formData.YakitTur}
              onChange={handleChangeCarsFuel}
              sx={{ marginBottom: 2, minWidth: '222px' }}
              >
                {carsFuel.map((fuel,index) =>
                <MenuItem key={index} value={fuel} >
                {fuel}
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
                  label="Motor Gücü(kW)"
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
              getRowId={(row) => row.id}
              columns={columns.map((column) => ({
                ...column,
                flex: 1, // Her sütunun eşit genişlikte olmasını sağlar
                minWidth: 100, // Minimum genişlik
              }))}  
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
          columnBufferPx={columns.length}
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


export default CarsPage;