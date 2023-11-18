
import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DisplayVendas from './components/Pages/DisplayVendas';
import Navbar from './components/Navbar';
import Comissao from './components/Pages/Comissao';
import CadastrarVenda from './components/Pages/CadastrarVenda';
import EditVendas from './components/Pages/EditVendas';

function App() {

  return (
    
    <div className="App">
      <Router>
        <Navbar/>
          <Routes>
            <Route path="/" element={<DisplayVendas/>} />
            <Route path="/comissao" element={<Comissao/>} />
            <Route path="/novaVenda" element={<CadastrarVenda/>} />
            <Route path="/editarVenda" element={<EditVendas/>} />
            
          </Routes>
      </Router>
      <ToastContainer />
      
    </div>
  );
}

export default App;
