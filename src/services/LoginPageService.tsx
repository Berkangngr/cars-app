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

const login = async(username: string, password: string, returnUrl: string = "/"): Promise<LoginResponse> => {
    try {
        const response = await axios.post("/Account/Login", {
            username,
            password,
            ReturnUrl: returnUrl,
        });

        return {
            success: true,
            message:"Login başarılı!",
            token:response.data.token,  // Eğer token dönüyorsa
            redirectUrl: response.data.redirectUrl, // API’den gelen redirect URL’i al anlamında.
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.response?.data?.message || 'Giriş hatası!',
        };
    }
};

export default {
    login,
}

