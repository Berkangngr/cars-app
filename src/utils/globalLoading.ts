import {useAuthStore } from '../zustand/authStore'

export const setGlobalLoading = (value : boolean) => {
useAuthStore.getState().setLoading(value);
};