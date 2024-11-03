import { ToastContainer } from 'react-toastify'
import './App.css'
import RouterConfig from './config/RouterConfig'
import 'react-toastify/dist/ReactToastify.css';
import Spinner from './components/Spinner';

function App() {
 
  return (
    <>
      <RouterConfig />
      <ToastContainer autoClose={2000}/>
      <Spinner />
    </>
  )
}

export default App
