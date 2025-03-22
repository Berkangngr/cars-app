import React from 'react'
import { Routes , Route} from 'react-router-dom'
import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'
import HomePage from '../pages/HomePage'
import NewRepairPage from '../pages/NewRepairPage'
import Receivables from '../pages/Receivables'
import Customers from '../pages/Customers'
import Reports from '../pages/Reports'
import CarsPage from '../pages/CarsPage'
import StockReport from '../pages/StockReport'
import Layout from '../components/Layout'


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
</Routes>


  )
}

export default RouterConfig

// /member/appuser/index