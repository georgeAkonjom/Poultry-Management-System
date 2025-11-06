import { Routes, Route } from 'react-router-dom';
import Poultryform from './pages/forms.jsx'
import './index.css'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Poultryform />}></Route>
    </Routes>
  )
}

export default App
