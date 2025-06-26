/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosResponse } from "axios";
import axios from "../config/AxiosConfig";
import { toast } from "react-toastify";




export const changePassword = async (oldPassword : any, newPassword : any) => {
try {
    const response = await axios.post("/api/UserSetting/ChangePassword", { //Bu api hatalı doğrusunu bulup yaz
        OldPassword: oldPassword,
        newPassword: newPassword,
    });
    if (response.data.success === false) {
      toast.error(response.data.message)  
    }else {
        toast.success("Şifre başarı ile değiştirildi.")
    }
    
 return response.data;
} catch (error) {
    console.error("İstek hatası:", error);
   throw error;
}
}