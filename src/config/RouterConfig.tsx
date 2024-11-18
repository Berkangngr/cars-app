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


function RouterConfig() {
  return (
  
<Routes>
<Route  path='/' element={<HomePage/>} />
<Route  path='/login' element={<LoginPage/>} />
<Route  path='/register' element={<RegisterPage/>} />
<Route  path='/newRepair' element={<NewRepairPage/>} />
<Route  path='/service' element={<Service/>} />
<Route  path='/receivables' element={<Receivables/>} />
<Route  path='/customers' element={<Customers/>} />
<Route  path='/report' element={<Reports/>} />
</Routes>


  )
}

export default RouterConfig