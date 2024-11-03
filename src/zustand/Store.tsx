import { create } from 'zustand'
import { LoginUserType } from '../types/LoginUserType'

export interface AppSliceType {
 currentUser : LoginUserType | null,
 loading : boolean
}

export const appSlice = create((set) => ({

}))