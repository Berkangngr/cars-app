import { ToastContainer } from 'react-toastify'
import './App.css'
import RouterConfig from './config/RouterConfig'
import 'react-toastify/dist/ReactToastify.css';
import GlobalLoadingSpinner from './components/Spinner';
import  useAuthStore  from '../src/zustand/authStore';
import { useEffect } from 'react';

function App() {
  const loadTokenFromCookie = useAuthStore((state) => state.loadTokenFromCookie);

  useEffect(() => {
    loadTokenFromCookie();
  },[loadTokenFromCookie]);
 
  return (
    <>
      <RouterConfig />
      <ToastContainer autoClose={2000}/>
      <GlobalLoadingSpinner />
    </>
  )
}

export default App
