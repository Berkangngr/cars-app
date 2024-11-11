/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import axios from "../config/AxiosConfig";
import { UserType } from '../types/Types';

class RegisterPageService {
  // RegisterResponseType tipini burada tanımlıyoruz
  register(newUser: FormData): Promise<{ success: boolean; redirectUrl: string; user: UserType }> {
    return axios.post("/Account/Register", newUser, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response: AxiosResponse<{ success: boolean; redirectUrl: string; user: UserType }>) => response.data)
      .catch((error: any) => {
        console.error("Registration error:", error);
        throw error;
      });
  }
}

export default new RegisterPageService();
