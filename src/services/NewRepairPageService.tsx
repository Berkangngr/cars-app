/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosResponse } from "axios";
import axios from "../config/AxiosConfig";



class NewRepairPageService {
    workOrder(newOrder : {FirmaSahisId: any, AppUserID: any, Yil:number, Tarih: string, BakimKm: number,
        Detaylar: {
        islemTur: string;
        MalzemeFiyat: number;
        iscilikFiyat: number;
        islemAciklama: string;
        ToplamFiyat: number;
        AppUserID: any;
        AracId: any;
        FirmaSahisId: any;
      }[];}) {
        return axios.post("/member/islemNew/islemKayit",newOrder, {
            headers: { "Content-Type": "application/json" },
            
        })
    }
}



         
         
          
       


export default new NewRepairPageService();


  
