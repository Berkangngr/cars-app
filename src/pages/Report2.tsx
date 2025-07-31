import React, { useEffect, useState } from 'react';
import DataGrid, {
  Column,
  Grouping,
  GroupPanel,
  Pager,
  Paging,
  Summary,
  TotalItem,
  GroupItem,
} from 'devextreme-react/data-grid';
import api from '../config/AxiosConfig';
import { loadMessages, locale } from 'devextreme/localization';
import '/src/css/Report2.css';
// Türkçe mesajların bazılarını yüklüyoruz, sadece group panel mesajını değiştiriyoruz
const messages = {
  'en-US': {
    'dxDataGrid-groupPanelEmptyText': 'Drag a column header here to group by that column', // varsayılan İngilizce
  },
  'tr': {
    'dxDataGrid-groupPanelEmptyText': 'Gruplamak için sütun başlığını buraya sürükleyin',
    'dxDataGrid-searchPanelPlaceholder': 'Arama'
  },
};
loadMessages(messages);
locale('tr');
const pageSizes = [10, 25, 50, 100];

const MyDataGrid = () => {
  const [data, setData] = useState([]);

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

  return (
    <DataGrid
  dataSource={data}
  allowColumnReordering={true}
  rowAlternationEnabled={true}
  showBorders={true}
  width="100%"
  groupPanel={{ visible: true }}
  grouping={{ autoExpandAll: false }}
  allowColumnResizing={true}
  searchPanel={{ visible: true, highlightCaseSensitive: true }}
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
      <Column dataField="MalzemeFiyat" caption="Malzeme Fiyat" dataType="number"  alignment="center" />
      <Column dataField="IscilikFiyat" caption="İşçilik Fiyat" dataType="number" alignment="center" />
      <Column dataField="ToplamFiyat" caption="Toplam Fiyat" dataType="number"  alignment="center" />
      <Column dataField="islemAciklama" caption="İşlem Açıklama" />

      {/* Toplamlar (Footer'da) */}
      <Summary>
        <TotalItem
          column="MalzemeFiyat"
          summaryType="sum"
          displayFormat=" Malzeme: {0}"  alignment="left"
        />
        <TotalItem
          column="IscilikFiyat"
          summaryType="sum"
          displayFormat=" İşçilik: {0}" alignment="left"
        />
        <TotalItem
          column="ToplamFiyat"
          summaryType="sum"
          displayFormat=" Toplam: {0}"  alignment="left"
        />

        {/* Grup içi toplamlar */}
        <GroupItem
          column="MalzemeFiyat"
          summaryType="sum"
          displayFormat="Malzeme Toplam: {0}"
        />
        <GroupItem
          column="IscilikFiyat"
          summaryType="sum"
          displayFormat="İşçilik Toplam: {0}"
        />
        <GroupItem
          column="ToplamFiyat"
          summaryType="sum"
          displayFormat="Toplam: {0}"
        />
      </Summary>

      <Pager visible={true} allowedPageSizes={pageSizes} showPageSizeSelector={true} />
      <Paging defaultPageSize={10} />
    </DataGrid>
  );
};

export default MyDataGrid;
