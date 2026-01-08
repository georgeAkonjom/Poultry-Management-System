import { Routes, Route } from 'react-router-dom';
import Poultryform from './pages/forms.jsx';
import BatchDetail from './pages/BatchDetail.jsx';
import ExpenseDetail from './pages/ExpenseDetail.jsx';
import SaleDetail from './pages/SaleDetail.jsx';
import LossDetail from './pages/LossDetail.jsx';
import AllBatches from './pages/AllBatches.jsx';
import AllExpenses from './pages/AllExpenses.jsx';
import AllSales from './pages/AllSales.jsx';
import AllLosses from './pages/AllLosses.jsx';
import EditBatch from './pages/EditBatch.jsx';
import EditExpense from './pages/EditExpense.jsx';
import EditSale from './pages/EditSale.jsx';
import EditLoss from './pages/EditLoss.jsx';
import Dashboard from './pages/dash.jsx';
import BatchSummary from './pages/BatchSummary.jsx';
import './index.css'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Dashboard />}></Route>
      <Route path='/add-batch' element={<Poultryform />}></Route>
      <Route path='/batch/:id' element={<BatchDetail />} />
      <Route path='/batch/edit/:id' element={<EditBatch />} />
      <Route path='/batch-summary/:id' element={<BatchSummary />} />
      <Route path='/expense/:id' element={<ExpenseDetail />} />
      <Route path='/expense/edit/:id' element={<EditExpense />} />
      <Route path='/sale/:id' element={<SaleDetail />} />
      <Route path='/sale/edit/:id' element={<EditSale />} />
      <Route path='/loss/:id' element={<LossDetail />} />
      <Route path='/loss/edit/:id' element={<EditLoss />} />
      <Route path='/all-batches' element={<AllBatches />} />
      <Route path='/all-expenses' element={<AllExpenses />} />
      <Route path='/all-sales' element={<AllSales />} />
      <Route path='/all-losses' element={<AllLosses />} />
    </Routes>
  )
}

export default App
