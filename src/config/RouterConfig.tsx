import { Route, Routes } from 'react-router-dom'
import Layout from '../components/Layout'
import CarsPage from '../pages/CarsPage'
import Customers from '../pages/Customers'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NewRepairPage from '../pages/NewRepairPage'
import Receivables from '../pages/Receivables'
import RegisterPage from '../pages/RegisterPage'
import Reports from '../pages/Reports'
import StockReport from '../pages/StockReport'
import Reports2 from '../pages/Report2';
function RouterConfig() {
  return (
  
<Routes>
<Route  path='/home' element={<Layout><HomePage/></Layout>} />
<Route  path='/' element={<LoginPage/>} />
<Route  path='/register' element={<RegisterPage/>} />
<Route  path='/newRepair' element={<Layout><NewRepairPage/></Layout>} />
<Route  path='/receivables' element={<Layout><Receivables/></Layout>} />
<Route  path='/customers' element={<Layout><Customers/></Layout>} />
<Route  path='/report' element={<Layout><Reports/></Layout>} />
<Route path='/cars' element={<Layout><CarsPage/></Layout>} />
<Route path='/report/stockReport' element={<Layout><StockReport/></Layout>} />
<Route path='/report2' element={<Layout><Reports2/></Layout>} />

</Routes>


  )
}

export default RouterConfig

// /member/appuser/index