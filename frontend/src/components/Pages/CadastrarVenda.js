import React, { useEffect, useState } from 'react';
import '../CadastrarVenda.css'
import axios from 'axios';
import Select from 'react-select';


function CadastrarVenda() {
  const [produtos, setProdutos]  = useState([]);
  const [displayprodutoSelected, setDisplayProdutoSelected] = useState([]);
  const [produtoSearchList, setProdutoSerachList] = useState([]);
  const [selectedProdutos, setSelectedProdutos] = useState({
            produto_id : null,
            quantidade : 0

        });
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState('');


  useEffect(() => {
    // Fetch all produtos data when the component mounts
    const fetchProdutos = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/produtos/');

        const formattedOptions = response.data.map(produto => ({
          value: produto.id,
          label: `${produto.codigo} - ${produto.descricao}`,
          codigo: produto.codigo, // Add the product code to the option for filtering
        }));
    
        setProdutoSerachList(formattedOptions);
        setProdutos(response.data)
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data1:', error);
      }
    };

    fetchProdutos();
  }, []); // Empty dependency array to ensure the effect runs only once

  useEffect(() => {
    // Fetch all clientes data when the component mounts
    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/clientes/');
        setClientes(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data1:', error);
      }
    };

    fetchClientes();
  }, []); // Empty dependency array to ensure the effect runs only once


  useEffect(() => {
    // Fetch all clientes data when the component mounts
    const fetchVendedores = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/vendedores/');
        setVendedores(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching data1:', error);
      }
    };

    fetchVendedores();
  }, []); // Empty dependency array to ensure the effect runs only once


  useEffect(()=>{
    setCurrentDateTime(getFullDateTime());

    // Update every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(getFullDateTime());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  })

    // ***************Functions*******************

  const filterOptions = ({ label, value, codigo }, inputValue) => {
    const searchValue = inputValue.toLowerCase();

    // Check if the label, value, or code includes the search value
    return (
      label.toLowerCase().includes(searchValue) ||
      (value && value.toString().includes(searchValue)) ||
      (codigo && codigo.toString().includes(searchValue))
    );
  };

  const handleInputChange = (field, value) => {
    setSelectedProdutos(prevValues => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleAddicionar=() =>{
    const produto_a_vender = produtos.find(produto => produto.id ===selectedProdutos.produto_id['value'] )
    console.log(produto_a_vender)
    if (produto_a_vender){
      
      const quant = selectedProdutos.quantidade
      const preco = produto_a_vender.valor_unitario
      

      const obj = {...produto_a_vender, quantidade: quant, total :(quant * preco) }

      setDisplayProdutoSelected(prevData =>[...prevData,obj])
      
      
      
    }
    else{
      console.log('Produto não existe')
    }

  }

  // Function to get current date and time as a string
  const getFullDateTime = () => {
    const brasiliaTimezoneOffset = -3 * 60; // Brasília time is UTC-3
      const currentDate = new Date(new Date().getTime() + brasiliaTimezoneOffset * 60000);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return currentDate.toLocaleDateString('en-US', options);
  };
  
  // const handleSubmit= (e) =>{
  //   e.preventDefault();
  //     console.log(selectedProdutos.produto_id['value'])
  //     console.log(selectedProdutos.quantidade)
  //     console.log("_______________________________________")
  // }


  return (
    <div className='container-fluid mt-5'>
    
    <div className='row mb-5'>
      <div className='col-8'>Produtos</div>
      <div className='col-4'>Dados da Venda</div>

    </div>

    <div className='row'>
      <div className='col-8'>
          <div className=''>
          <form>
              <div className="row mb-5">
                <div className="col-6">
                {/* <label htmlFor="search">Buscar pelo código de barra ou descrição</label>
                  <input type="text" className="form-control" placeholder="Digite o nome ou o código do produto"/> */}
                   <label>Digite o nome ou o código do produto</label>
                    <Select
                      options={produtoSearchList}
                      value={selectedProdutos.produto_id}
                      onChange={value => handleInputChange('produto_id', value)}
                      filterOption={filterOptions}
                      isSearchable
                      placeholder="Digite o código ou o nome do produto"
                      styles={{
                        indicatorSeparator: () => ({ display: "none" }),
                        dropdownIndicator: () => ({ display: "none" }),
                      }}
                    />
                </div>
                <div className="col-2">
                <label htmlFor="quantidade">Quantidade de Itens</label>
                  <input type="number" 
                  className="form-control quant" 
                  placeholder="0"
                  onChange={e => handleInputChange('quantidade', e.target.value)}
                  />
                </div>
                <div className="col-2 mt-4 text-center">
                <button 
                type="button" 
                className="btn btn-secondary ml-3"
                onClick={handleAddicionar}
                >
                  Adicionar
                  </button>
                </div>
              </div>
          </form>
          </div>

          <div className='row'>
            <div className='col table-responsive'>
            <table className="table table-borderless produto_table">
              <thead>
                <tr>
                  <th scope="col">Produtos/Serviços</th>
                  <th scope="col">Quantidade</th>
                  <th scope="col">Preço unitário</th>
                  <th scope="col">Total</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {
                  displayprodutoSelected.map(item => (
                    <React.Fragment key={item.id}>
                      <tr>
                        <td>{item.codigo}-{item.descricao}</td>
                        <td>{item.quantidade}</td>
                        <td> R${item.valor_unitario}</td>
                        <td> R${item.total}</td>
                      </tr>
                    </React.Fragment>
                  ))
                }
              </tbody>
            </table>
            </div>
          </div>

      </div>
      <div className='col-3 dados'>
        <div className=''>
          <form>
            <div className="form-group mb-4">
              <label htmlFor="date">Data e Hora da Venda</label>
              <input type="text" value={currentDateTime} className="form-control" disabled/>
            </div>
            <div className="form-group mb-4">
              <label htmlFor="vendedor">Escolher um vendedor</label>
              <select className="form-control form-select" id="vendedor">
                <option selected disabled value="SelecioneNome">Selecione o nome</option>
                  {
                    vendedores.map(vendedor =>(
                      <option key={vendedor.id} value={vendedor.id}>
                        {vendedor.nome}
                      </option>
                    ))
                  }
                
                
              </select>
            </div>
            <div className="form-group mb-5">
              <label htmlFor="cliente">Escolher um cliente</label>
              <select className="form-control form-select" id="cliente">
                <option selected disabled value="SelecioneNome">Selecione o nome</option>
                {
                  clientes.map(cliente =>(
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))
                }
              </select>
            </div>


            <div className='row mb-5'>
              <div className='col'>Valor total da venda:</div>
              <div className='col text-end'>R$ 7,50</div>
            </div>

            <div className='row'>
              <div className='col'>
                <button className='btn btn-secondary'>Cancelar</button>
              </div>
              <div className='col text-end'>
              <button className='btn btn-secondary'>Finalizar</button>
              </div>
            </div>

          </form>
        </div>
      
      </div>

    </div>
    
    
    </div>
  )
}

export default CadastrarVenda