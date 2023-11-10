
import './App.css';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import DisplayVendas from './components/Pages/DisplayVendas';
import Navbar from './components/Navbar';
import Comissao from './components/Pages/Comissao';
import CadastrarVenda from './components/Pages/CadastrarVenda';


function App() {
  return (
    
    <div className="App">
      <Router>
        <Navbar/>
          <Routes>
            <Route path="/" element={<DisplayVendas/>} />
            <Route path="/comissao" element={<Comissao/>} />
            <Route path="/novaVenda" element={<CadastrarVenda/>} />
            
          </Routes>
      </Router>
      
    </div>
  );
}

export default App;
