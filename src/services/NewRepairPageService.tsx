import { AxiosResponse } from "axios";
import axios from "../config/AxiosConfig";



class NewRepairPageService {
    workOrder(newOrder : {PlakaNo:string, SasiNo:string, MüsteriIsmi:string, KayıtlıAraclar:string, BakımKm:number, 
        Detay: {
        IslemTürü: string;
        MalzemeFiyat: number;
        IscilikFiyat: number;
        Açıklama: string;
        ToplamFiyat: number;
      }[];}) {
        return axios.post("/member/Islem/CreateIslem",newOrder, {
            headers: { "Content-Type": "application/json" },
            
        })
        .catch((error : any) => {
            console.error("Work Order Error:", error);
            throw error;
        });
    }
}




export default new NewRepairPageService();


  
