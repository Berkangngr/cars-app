import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import {useState, useEffect} from 'react';
import axios from 'axios';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'Müşteri', headerName: 'Müşteri', width: 200 },
  { field: 'Araç', headerName: 'Araç', width: 150 },
  { field: 'Tarih', headerName: 'Tarih', type: 'date', width: 150 },
  { field: 'Ödeme', headerName: 'Ödeme', type: 'number', width: 150, align: 'left', headerAlign: 'left' },
  { field: 'İşlem', headerName: 'İşlem', width: 150, renderCell:(params) => (
    <Button
    variant='contained'
    color="primary"
    onClick={() => alert(`ID: olan işlemin detayı buraya çekilecek.`)}
    >
      İşlem Detayı
    </Button>
  ) },
];

const rows = [
  { id: 1, Müşteri: 'Altuğ Altıntaş', Araç: 'Ssangyong Korando', Tarih: new Date(2024, 10, 18), Ödeme: 15000, İşlem: 'Servis' },
  { id: 2, Müşteri: 'Berkan Güngör', Araç: 'Mercedes C200', Tarih: new Date(2024, 10, 10), Ödeme: 20000, İşlem: 'Bakım' },
  { id: 3, Müşteri: 'Nihat Üflerer', Araç: 'Audi A4', Tarih: new Date(2024, 10, 5), Ödeme: 17000, İşlem: 'Tamir' },
  { id: 4, Müşteri: 'Ali Satıcı', Araç: 'Toyota Corolla', Tarih: new Date(2024, 9, 25), Ödeme: 8000, İşlem: 'Boyama' },
  { id: 5, Müşteri: 'Ceren Yılmaz', Araç: 'Hyundai Tucson', Tarih: new Date(2024, 8, 18), Ödeme: 12000, İşlem: 'Parça Değişimi' },
  { id: 14, Müşteri: 'Ahmet Demir', Araç: 'Hyundai Tucson', Tarih: new Date(2024, 8, 18), Ödeme: 12000, İşlem: 'Parça Değişimi' },
  { id: 6, Müşteri: 'Zeynep Kaya', Araç: 'Hyundai Tucson', Tarih: new Date(2024, 8, 18), Ödeme: 12000, İşlem: 'Parça Değişimi' },
  { id: 7, Müşteri: 'Baran Aksoy', Araç: 'Hyundai Tucson', Tarih: new Date(2024, 8, 18), Ödeme: 12000, İşlem: 'Parça Değişimi' },
  { id: 8, Müşteri: 'Elif Koç', Araç: 'Hyundai Tucson', Tarih: new Date(2024, 8, 18), Ödeme: 12000, İşlem: 'Parça Değişimi' },
  { id: 9, Müşteri: 'Mert Çelik', Araç: 'Hyundai Tucson', Tarih: new Date(2024, 8, 18), Ödeme: 12000, İşlem: 'Parça Değişimi' },
];

const paginationModel = { page: 0, pageSize: 10 };

function Dashboard() {
const [data, setData] = useState([]);

useEffect(() => {
  const fetchData = async () => {

    try {
      const response = await axios.get(`/member/Islem/ListIslemD`);
      setData(response.data);

    } catch (error) {
      console.log("Veri alınırken hata oluştu",error)
    }
  };
  fetchData();
}, [])


  return (
    <Paper
      sx={{
        backgroundColor:'#efedf2',
        height: '70vh',
        width: '100%',
        maxWidth: '1000px', 
        margin: '0 auto', 
        padding: 6,
        overflow: 'auto', 
      }}
    >
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel,
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick
        sx={{
          border: 0,
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold',
          },
          '& .MuiDataGrid-columnHeaderTitleContainer':{
            backgroundColor:'#efedf2',
            fontWeight:'bold',
          },
          '& .MuiDataGrid-columnSeparator':{
            backgroundColor:'#efedf2',
          },
          '& .MuiDataGrid-filler':{
            backgroundColor:'#efedf2',
          },
          '& .MuiDataGrid-menuIcon':{
            backgroundColor:'#efedf2',
          },
          '& .MuiDataGrid-columnHeader':{
            backgroundColor:'#efedf2',
          }
        }}
      />
    </Paper>
  );
}

export default Dashboard;
