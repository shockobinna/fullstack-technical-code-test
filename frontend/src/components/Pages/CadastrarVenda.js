import React, { useEffect, useState, useRef } from "react";
import "../CadastrarVenda.css";
import axios from "axios";
import Select from "react-select";
import * as FaIcons from "react-icons/fa";
import { useDispatch,useSelector } from 'react-redux';
import EditVendas from "./EditVendas";
// import { useLocation } from 'react-router-dom';

function CadastrarVenda() {
  const [produtos, setProdutos] = useState([]); // All produtos from the backend
  const [displayprodutoSelected, setDisplayProdutoSelected] = useState([]); // Display produto in the table
  const [produtoSearchList, setProdutoSerachList] = useState([]); // produto displayed in the search following figma design
  const [selectedProdutos, setSelectedProdutos] = useState({
    produto_id: '',
    quantidade: 0,
  }); // selected produto id for query in the produtos state and also for adicionar button disable logic
  const [clientes, setClientes] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [invoiceDetailField, setInvoiceDetailField] = useState({
    cliente_id: '',
    vendedor_id: '',
  }) // Finalizar button disabled and abled logic
  const [total, setTotal] = useState(0); // Dynamically calculates invoice total
  
  const [editVendas, setEditVendas] = useState(useSelector(state => state.venda || [])); // Use a state to hold the parsed editData
  const [pessoal, setPessoal] = useState({
    nomeVendedor:'',
    nomeCliente: ''
  })

  const dispatch = useDispatch();
 
  useEffect(() => {
    // Fetch all produtos data when the component mounts
    const fetchProdutos = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/produtos/");

        const formattedOptions = response.data.map((produto) => ({
          value: produto.id,
          label: `${produto.codigo} - ${produto.descricao}`,
          codigo: produto.codigo, // Add the product code to the option for filtering
        }));

        setProdutoSerachList(formattedOptions);
        setProdutos(response.data);
        console.log(response.data);
        
      } catch (error) {
        console.error("Error fetching data1:", error);
      }
    };
    

    fetchProdutos();
  }, []); // Empty dependency array to ensure the effect runs only once

  useEffect(() => {
    // Fetch all clientes data when the component mounts
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/clientes/");
        setClientes(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data1:", error);
      }
    };

    fetchClientes();
  }, []); // Empty dependency array to ensure the effect runs only once

  useEffect(() => {
    // Fetch all clientes data when the component mounts
    const fetchVendedores = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/vendedores/");
        setVendedores(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching data1:", error);
      }
    };

    fetchVendedores();
  }, []); // Empty dependency array to ensure the effect runs only once
  

  useEffect(() => {
    setCurrentDateTime(getFullDateTime());

    // Update every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(getFullDateTime());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentDateTime]);

  useEffect(() => {
    console.log(editVendas)
    
      checkVendasParaEditar();
  }, [editVendas]);

  // Recalculate the invoice total value whenever the total changes
  useEffect(() => {
    const newTotal = displayprodutoSelected.reduce(
      (acc, produto) => acc + produto.total,
      0
    );
    setTotal(newTotal);
  }, [displayprodutoSelected]);

  

  const checkVendasParaEditar = () => {
    
      const vendaArray = Object.values(editVendas);
      const updatedSelectedProdutos = [];
  
      vendaArray.forEach((venda) => {
        setPessoal({
          nomeVendedor:venda.vendedor,
          nomeCliente: venda.cliente
        })
        console.log(venda.produtos);
        const produtos = venda.produtos;
  
        if (produtos && produtos.length > 0) {
          produtos.forEach((code) => {
            console.log(code.id);
            console.log(code.quantidade);
  
            // Create a new object for each product
            const produtoEdit = {
              id: code.id,
              codigo: code.codigo,
              descricao: code.descricao,
              comissao: code.percentual_comissao,
              preco: code.valor_unitario,
              quantidade: code.quantidade,
              total: code.quantidade * code.valor_unitario,
            };
            updatedSelectedProdutos.push(produtoEdit);
          });
        }
      });
  
      // Update the displayProdutoSelected state once outside the loops
      setDisplayProdutoSelected(updatedSelectedProdutos);
      console.log('Products to edit:', updatedSelectedProdutos);
      console.log('displayed to edit:', displayprodutoSelected);
    
  };
  
  

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
    setSelectedProdutos((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleFinalizeChange = (field, value) => {
    setInvoiceDetailField((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleAddicionar = () => {
    if(produtos){
    const produto_a_vender = produtos.find(
      (produto) => produto.id === selectedProdutos.produto_id["value"]
    );
    console.log(produto_a_vender);
    if (produto_a_vender) {
      const quant = selectedProdutos.quantidade;
      const preco = produto_a_vender.valor_unitario;

      const obj = {
        ...produto_a_vender,
        quantidade: quant,
        total: quant * preco,
      };

      setDisplayProdutoSelected((prevData) => [...prevData, obj]);

      setSelectedProdutos({
        produto_id: null,
        quantidade: 0,
      });
    } else {
      console.log("Produto não existe");
    }
  }
  };

  // Function to get current date and time as a string
  const getFullDateTime = () => {
    const currentDate = new Date();
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return (
      currentDate.toLocaleDateString("pt-BR", options) +
      " - " +
      currentDate.toLocaleTimeString("pt-BR", { hour12: false })
    );
  };

  // Function to check whether the search field and quantity field are filled before clicking on Adicional
  const areFieldsFilled = () => {
    return selectedProdutos.produto_id && selectedProdutos.quantidade;
  };

  // Function to check whether the all invoice fields are filled before clicking on Finalizar
  const areInvoiceFieldsFilled = () =>{
    return displayprodutoSelected.length > 0 && invoiceDetailField.cliente_id && invoiceDetailField.vendedor_id;

  }

  //Deletar venda sendo cadastrada
  const handleDelete = (produto) =>{
    const removeItem = displayprodutoSelected.filter((item) => item.id !== produto )
    setDisplayProdutoSelected(removeItem)
  }
  // Finalizar Compras
  const handleSubmit= (e) =>{
    e.preventDefault();
    
    const invoice = {}
    invoice.cliente = invoiceDetailField.cliente_id;
    invoice.vendedor = invoiceDetailField.vendedor_id;
    invoice.produtovendido_set = displayprodutoSelected.map((item) =>({
      produto: item.id,
      quantidade: item.quantidade
    }))

    axios.post('http://127.0.0.1:8000/vendas/', invoice,{
      'Content-Type': 'multipart/form-data',
    })
    .then(response => {
      setProdutos(response.data)
      setDisplayProdutoSelected([])
      setSelectedProdutos({
        produto_id: null,
        quantidade: 0,
      });
      setInvoiceDetailField({
        cliente_id: '',
        vendedor_id: '',
      })
    })
    .catch(error =>{
      console.log(error + 'Produto não salvo')
    })
    
  }


  return (
    <div>{
      displayprodutoSelected.length > 0 ?(
        <EditVendas
        displayprodutoSelected={displayprodutoSelected}
        clientes = {clientes}
        vendedores = {vendedores}
        vendedorCliente = {pessoal}
        produtoSearchList = {produtoSearchList}
        ></EditVendas>
      ):(
      
      
    <div className="container-fluid mt-5">
      <div className="row mb-5">
        <div className="col-8">Produtos</div>
        <div className="col-4">Dados da Venda</div>
      </div>

      <div className="row">
        <div className="col-8">
          <div className="">
            <form>
              <div className="row mb-5">
                <div className="col-6">
                  <label>Buscar pelo código de barra ou descrição</label>
                  <Select
                    options={produtoSearchList}
                    value={selectedProdutos.produto_id}
                    onChange={(value) => handleInputChange("produto_id", value)}
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
                  <input
                    type="number"
                    className="form-control quant"
                    value={selectedProdutos.quantidade}
                    // placeholder="0"
                    onChange={(e) =>
                      handleInputChange("quantidade", e.target.value)
                    }
                  />
                </div>
                <div className="col-2 mt-4 text-center">
                  <button
                    type="button"
                    className="btn btn-secondary ml-3"
                    onClick={handleAddicionar}
                    disabled={!areFieldsFilled()}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="row">
            <div className="col table-responsive">
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
                  {displayprodutoSelected.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr>
                        <td>
                          {item.codigo}-{item.descricao}
                        </td>
                        <td>{item.quantidade}</td>
                        <td> R${item.valor_unitario}</td>
                        <td> R${item.total}</td>
                        <td> <i className="action-delete" onClick={ () => handleDelete(item.id)}><FaIcons.FaTrash /> </i> </td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-3 dados">
          <div className="">
            <form>
              <div className="form-group mb-4">
                <label htmlFor="date">Data e Hora da Venda</label>
                <input
                  type="text"
                  value={currentDateTime}
                  className="form-control"
                  disabled
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="vendedor">Escolher um vendedor</label>
                <select className="form-control form-select" 
                id="vendedor"
                value={invoiceDetailField.vendedor_id}
                onChange={(e) => handleFinalizeChange('vendedor_id', e.target.value)}
                defaultValue=""
                >
                  <option selected disabled value="">
                    Selecione o nome
                  </option>
                  {vendedores.map((vendedor) => (
                    <option key={vendedor.id} value={vendedor.id}>
                      {vendedor.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-5">
                <label htmlFor="cliente">Escolher um cliente</label>
                <select className="form-control form-select" 
                id="cliente"
                value={invoiceDetailField.cliente_id}
                onChange={(e) => handleFinalizeChange('cliente_id', e.target.value)}
                defaultValue=""
                >
                  <option selected disabled value="">
                    Selecione o nome
                  </option>
                  {clientes.map((cliente) => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="row mb-5">
                <div className="col">Valor total da venda:</div>
                <div className="col text-end">R$ {total}</div>
              </div>

              <div className="row">
                <div className="col">
                  <button className="btn btn-secondary">Cancelar</button>
                </div>
                <div className="col text-end">
                  <button className="btn btn-secondary"
                  onClick={handleSubmit}
                  disabled={!areInvoiceFieldsFilled()}
                  >
                    Finalizar</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    )}
    </div>
  );
}

export default CadastrarVenda;
