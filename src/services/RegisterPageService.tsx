import { AxiosResponse } from "axios";
import axios from "../config/AxiosConfig";
import { UserType } from "../types/Types";

class RegisterPageService {
    register(newUser : UserType) : Promise<UserType> {
        return new Promise((resolve : any , reject : any) => {
            axios.post("/Account/Register", {newUser})
            .then((response : AxiosResponse<any, any>) =>resolve(response.data))
            .catch((error : any ) => reject(error));
        })
    }
}

export default new RegisterPageService();