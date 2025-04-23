/* eslint-disable @typescript-eslint/no-unused-vars */
import {create} from 'zustand';
import { getCookie } from '../utils/cookies';
import axios from '../config/AxiosConfig';

interface AuthState {
    email: string;
    password: string;
    token: string | null; //Token'ı burada saklayalım
    isLoading: boolean; //Loading durumunu kontrol eder
    setEmail:(usurname: string) => void;
    setPassword:(password: string) => void;
    setToken: (token: string | null) => void; //Tokenı set etmek için bir fonksiyon
    //Cookide saklama
    loadTokenFromCookie:() => void;
    clearAuth: () => void; //Buda giriş yapıldıktan sonra temizlemek için.
    setLoading:(loading: boolean) => void;
};




//Kullanıcı auth bilgileri (login logout token vs.)
const useAuthStore = create <AuthState>((set) => ({
    email:"",
    password:"",
    token:null,
    isLoading:false,
    setEmail:(email) => set({email}),
    setPassword:(password) => set({password}),
    setToken:(token) => set({token}),
    clearAuth:() => set({email:'', password:'',token:null}),
    setLoading:(loading) => set({isLoading: loading}),
    loadTokenFromCookie:() => {
        const token = getCookie("token");
        if (token) {
            set({ token });
        }
    },
}));



export  {useAuthStore};