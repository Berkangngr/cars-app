import React, { useEffect, useRef, useState } from 'react';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  Summary,
  TotalItem,
  GroupItem
} from 'devextreme-react/data-grid';
import api from '../config/AxiosConfig';
import { loadMessages, locale } from 'devextreme/localization';
import '/src/css/Report2.css';
import Button from '@mui/material/Button';
import axios from '../config/AxiosConfig';

const messages = {
  'en-US': {
    'dxDataGrid-groupPanelEmptyText': 'Drag a column header here to group by that column',
  },
  'tr': {
    'dxDataGrid-groupPanelEmptyText': 'Gruplamak için sütun başlığını buraya sürükleyin',
    'dxDataGrid-searchPanelPlaceholder': 'Arama',
  },
};
loadMessages(messages);
locale('tr');

const pageSizes = [10, 25, 50, 100];
// const userId = '9ff27b45-4c17-41bf-99a8-ad45476e541b'; // Giriş yapan kullanıcıdan alınmalı
const pageKey = 'Report2';

const MyDataGrid = () => {
  const gridRef = useRef<any>(null);
  const [data, setData] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/islemNew/GetIslemlerNew');
        setData(response.data);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/Arac/AracList`);
        setUserId(data[0].AppUserID);

        console.clear();
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };
    fetchData();
  }, []);

  // Manuel kaydetme butonu
  const handleSaveLayout = async () => {
    if (!gridRef.current?.instance) return;
    try {
      const state = gridRef.current.instance.state(); // ✅ Doğru fonksiyon

      const payload = {
        appUserID: userId,
        pageKey,
        layoutJson: JSON.stringify(state),
      };
      await api.post('/api/RaporDizayn/RaporDizaynKayıt', payload);
      alert('Tasarım başarıyla kaydedildi.');

    } catch (error) {
    }
  };


  // Burada stateStoring için custom load ve save işlemleri api çağrıları ile yapılacak:
  return (
    <div>
      <Button variant="outlined" onClick={handleSaveLayout}>Tasarımı Kaydet</Button>
      <DataGrid
        key={userId} // ✅ userId geldikten sonra yeniden render olur
        id="myDataGrid"
        ref={gridRef}
        dataSource={data}
        allowColumnReordering={true}
        allowColumnResizing={true}
        rowAlternationEnabled={true}
        showBorders={true}
        width="100%"
        searchPanel={{ visible: true, highlightCaseSensitive: true }}
        stateStoring={{
          enabled: true,
          type: "custom",
          customLoad: async () => {
            try {
              const response = await api.get('/api/RaporDizayn/RaporDizaynGet', {
                params: { userId, pageKey }
              });
              if (response.data) {
                return typeof response.data === 'string'
                  ? JSON.parse(response.data)
                  : response.data;
              }
              return null;
            } catch (error) {
              console.warn('Kayıtlı tasarım yüklenemedi veya yok:', error);
              return null;
            }
          },
          customSave: async (state) => {
            try {
              const payload = {
                appUserID: userId,
                pageKey,
                layoutJson: JSON.stringify(state),
              };
              await api.post('/api/RaporDizayn/RaporDizaynKayıt', payload);
              console.log('Tasarım başarıyla kaydedildi.');
            } catch (error) {
              console.error('Tasarım kaydedilemedi:', error);
            }
          }
        }}
      >
        <GroupPanel visible={true} />
        <Grouping autoExpandAll={false} />

        <Column dataField="islemYilNo" caption="İşlem Yıl No" />
        <Column dataField="Adi" caption="Adı" />
        <Column dataField="Plaka" caption="Plaka" />
        <Column dataField="AracMarka" caption="Araç Marka" />
        <Column dataField="AracModel" caption="Araç Model" />
        <Column dataField="Tarih" caption="Tarih" dataType="string" />
        <Column dataField="islemTur" caption="İşlem Türü" />
        <Column dataField="BakimKM" caption="Bakım KM" dataType="number" alignment="center" />
        <Column dataField="MalzemeFiyat" caption="Malzeme Fiyat" dataType="number" alignment="center" />
        <Column dataField="IscilikFiyat" caption="İşçilik Fiyat" dataType="number" alignment="center" />
        <Column dataField="ToplamFiyat" caption="Toplam Fiyat" dataType="number" alignment="center" />
        <Column dataField="islemAciklama" caption="İşlem Açıklama" />

        <Summary>
          <TotalItem column="MalzemeFiyat" summaryType="sum" displayFormat=" Malzeme: {0}" alignment="left" />
          <TotalItem column="IscilikFiyat" summaryType="sum" displayFormat=" İşçilik: {0}" alignment="left" />
          <TotalItem column="ToplamFiyat" summaryType="sum" displayFormat=" Toplam: {0}" alignment="left" />
          <GroupItem column="MalzemeFiyat" summaryType="sum" displayFormat="Malzeme Toplam: {0}" />
          <GroupItem column="IscilikFiyat" summaryType="sum" displayFormat="İşçilik Toplam: {0}" />
          <GroupItem column="ToplamFiyat" summaryType="sum" displayFormat="Toplam: {0}" />
        </Summary>

        <Pager visible={true} allowedPageSizes={pageSizes} showPageSizeSelector={true} />
        <Paging defaultPageSize={10} />
      </DataGrid>
    </div>
  );
};

export default MyDataGrid;
