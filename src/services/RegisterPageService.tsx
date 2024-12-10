/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
import axios from "../config/AxiosConfig";
import { UserType } from '../types/Types';

class RegisterPageService {
  // RegisterResponseType tipini burada tanımlıyoruz
  register(newUser: any): Promise<{ success: boolean; redirectUrl: string; user: UserType }> {

    let requestData;
    let headers;

    // Eğer image gönderilmiyorsa JSON formatında gönder
    if (newUser.image === undefined || newUser.image === null) {
      requestData = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userName: newUser.userName,
        password: newUser.password,
        email: newUser.email,
      };
      headers = { "Content-Type": "application/json" };
    } else {
      // Eğer image varsa FormData formatında gönder
      const formData = new FormData();
      formData.append("firstName", newUser.firstName);
      formData.append("lastName", newUser.lastName);
      formData.append("userName", newUser.userName);
      formData.append("password", newUser.password);
      formData.append("email", newUser.email);
      formData.append("image", newUser.image);
      requestData = formData;
      headers = { "Content-Type": "multipart/form-data" };
    }

    return axios.post("/Account/Register", requestData, { headers})
    .then((response: AxiosResponse<{ success: boolean; redirectUrl: string; user: UserType }>) => response.data)
      .catch((error: any) => {
        console.error("Registration error:", error);
        throw error;
      });
  }
}

export default new RegisterPageService();
