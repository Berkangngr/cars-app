import React from 'react'
import { Routes , Route} from 'react-router-dom'
import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'
import HomePage from '../pages/HomePage'
import NewRepairPage from '../pages/NewRepairPage'
import Service from '../pages/Service'
import Receivables from '../pages/Receivables'
import Customers from '../pages/Customers'
import Reports from '../pages/Reports'
import CarsPage from '../pages/CarsPage'
import StockReport from '../pages/StockReport'


function RouterConfig() {
  return (
  
<Routes>
<Route  path='/home' element={<HomePage/>} />
<Route  path='/' element={<LoginPage/>} />
<Route  path='/register' element={<RegisterPage/>} />
<Route  path='/newRepair' element={<NewRepairPage/>} />
<Route  path='/service' element={<Service/>} />
<Route  path='/receivables' element={<Receivables/>} />
<Route  path='/customers' element={<Customers/>} />
<Route  path='/report' element={<Reports/>} />
<Route path='/cars' element={<CarsPage/>} />
<Route path='/report/stockReport' element={<StockReport/>} />
</Routes>


  )
}

export default RouterConfig

// /member/appuser/index