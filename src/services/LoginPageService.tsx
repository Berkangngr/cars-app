/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { toast } from 'react-toastify';
import axios from '../config/AxiosConfig';


interface LoginResponse {
   success: boolean;
   message?: string;
   token?:string; //Geri dönecek bir token varmı yok mu?
   redirectUrl?:string;
}

const login = async(email: string, password: string, returnUrl: string = "/"): Promise<LoginResponse> => {
    
    try {
        const response = await axios.post("/api/Account/Login", {
            email,
            password,
            ReturnUrl: returnUrl,
        });
        // console.log(response.data);
        if (response.data.success) {
            toast.success("Giriş Başarılı!");
        

        return {
            success: true,
            message:"Login başarılı!",
            token:response.data.token,  // Eğer token dönüyorsa
            redirectUrl: response.data?.redirectUrl || returnUrl, // API’den gelen redirect URL’i al anlamında.
        };
        }else {
            throw new Error(response.data.message || "Giriş başarısız oldu.")
        }

    } catch (error: any) {
        const errorMessage = error.response?.data?.message || 'Giriş hatası!';

        toast.error(errorMessage);
        
        return {
            success: false,
            message: error.response?.data?.message || 'Giriş hatası!',
        };
    }
};

export default {
    login,
}

