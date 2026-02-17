import { BrowserRouter,Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Electronics from'./pages/Electronics.jsx'
import ElectronicsDetail from './pages/ElectronicsDetail.jsx';
import Mechanics from './pages/Mechanics.jsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/electronics" element={<Electronics />}/>
        <Route path="/electronics/:id" element={<ElectronicsDetail />}/>
        <Route path="/mechanics" element={<Mechanics />}/>
      </Routes>
    </BrowserRouter>
  
  )
}

export default App
