/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosResponse } from "axios";
import axios from "../config/AxiosConfig";




export const changePassword = async (oldPassword : any, newPassword : any) => {
try {
    const response = await axios.post("/ChangePassword", { //Bu api hatalı doğrusunu bulup yaz
        OldPassword: oldPassword,
        newPassword: newPassword,
    });

 return response.data;
} catch (error) {
    console.error("İstek hatası:", error);
   throw error;
}
}