import { Routes, Route } from 'react-router-dom';
import Poultryform from './pages/forms.jsx';
import BatchDetail from './pages/BatchDetail.jsx';
import ExpenseDetail from './pages/ExpenseDetail.jsx';
import IncomeDetail from './pages/IncomeDetail.jsx';
import LossDetail from './pages/LossDetail.jsx';
import './index.css'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Poultryform />}></Route>
      <Route path='/batch/:id' element={<BatchDetail />} />
      <Route path='/expense/:id' element={<ExpenseDetail />} />
      <Route path='/income/:id' element={<IncomeDetail />} />
      <Route path='/loss/:id' element={<LossDetail />} />
    </Routes>
  )
}

export default App
