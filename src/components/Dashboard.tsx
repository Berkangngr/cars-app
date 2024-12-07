import * as React from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import {useState, useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';




const paginationModel = { page: 0, pageSize: 10 };

interface rowType {
  id: string;             
  userName: string;    
  cars: string;       
  date: Date;
  payment: string;       
  operation: string;
}

function Dashboard() {
const [data, setData] = useState<rowType[]>([]);

useEffect(() => {
  (async () => {

    try {
      const response = await axios.get(`/member/Islem/ListIslemD`);
      console.log("API'den gelen veri:", response.data);
      setData(response.data);

    } catch (error) {
      console.log("Veri alınırken hata oluştu",error);
      toast.error("Veriler alınırken bir sorun oluştu.");
    }
  })();
}, []);

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

const rows : rowType[] = React.useMemo(() => 
  data.map(item => ({
  id: item.id,               
  userName: item.userName,    
  cars: item.cars,          
  date: new Date(item.date),
  payment: item.payment,       
  operation: item.operation,     
})),
[data]
);

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
        rows={rows}
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
