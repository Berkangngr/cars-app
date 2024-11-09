import { AxiosResponse } from "axios";
import axios from "../config/AxiosConfig";
import { LoginUserType } from "../types/LoginUserType";

class LoginPageService {
   login() : Promise<LoginUserType []> {
    return new Promise ((resolve : any, reject : any) => {
        axios.get("/member/appuser/index")
        .then((response : AxiosResponse< any, any>) => resolve(response.data))
        .catch((error : any) => reject(error))
    })
   }
}

// https://www.aracimhakkinda.com/member/appuser

export default new LoginPageService();