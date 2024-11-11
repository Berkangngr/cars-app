/* eslint-disable @typescript-eslint/no-unused-vars */
import {create} from 'zustand';

interface AuthState {
    username: string;
    password: string;
    token: string | null; //Token'ı burada saklayalım
    isLoading: boolean; //Loading durumunu kontrol eder
    setUsername:(usurname: string) => void;
    setPassword:(password: string) => void;
    setToken: (token: string | null) => void; //Tokenı set etmek için bir fonksiyon
    clearAuth: () => void; //Buda giriş yapıldıktan sonra temizlemek için.
    setLoading:(loading: boolean) => void;
}

const useAuthStore = create <AuthState>((set) => ({
    username:"",
    password:"",
    token:null,
    isLoading:false,
    setUsername:(username) => set({username}),
    setPassword:(password) => set({password}),
    setToken:(token) => set({token}),
    clearAuth:() => set({username:'', password:'',token:null}),
    setLoading:(loading) => set({isLoading: loading}),
}));

export default useAuthStore;