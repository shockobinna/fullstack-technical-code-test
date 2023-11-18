import React, { useEffect, useState, useRef } from "react";
import "../CadastrarVenda.css";
import axios from "axios";
import Select from "react-select";
import * as FaIcons from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';


function CadastrarVenda() {

  const navigate = useNavigate();

    // from redux store [produtos, clientes,vendedores, produtoSearchList]
  const produtos = useSelector(state => state.produtos['produtos'][0] || []);
  const clientes = useSelector(state => state.clientes['clientes'][0] || []);
  const vendedores = useSelector(state => state.vendedores['vendedores'][0] || []);
  const produtoSearchList = useSelector(state => state.produtoFormatado['produtoFormatado'][0] || [])
  
  const [displayprodutoSelected, setDisplayProdutoSelected] = useState([]); // Display produto in the table
  const [selectedProdutos, setSelectedProdutos] = useState({
    produto_id: '',
    quantidade: null,
  }); // selected produto id for query in the produtos state and also for adicionar button disable logic
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [invoiceDetailField, setInvoiceDetailField] = useState({
    cliente_id: '',
    vendedor_id: '',
  }) // Finalizar button disabled and abled logic
  const [total, setTotal] = useState(0); // Dynamically calculates invoice total
  
  

  useEffect(() => {
    setCurrentDateTime(getFullDateTime());

    // Update every second
    const intervalId = setInterval(() => {
      setCurrentDateTime(getFullDateTime());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [currentDateTime]);


  // Recalculate the invoice total value whenever the total changes
  useEffect(() => {
    const newTotal = displayprodutoSelected.reduce(
      (acc, produto) => acc + produto.total,
      0
    );
    setTotal(newTotal);
  }, [displayprodutoSelected]);

  
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
        produto_id: '',
        quantidade: '',
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
      setDisplayProdutoSelected([])
      setSelectedProdutos({
        produto_id: '',
        quantidade: '',
      });
      setInvoiceDetailField({
        cliente_id: '',
        vendedor_id: '',
      })
      navigate('/', { state: { actionResult: { success: true } } });

    })
    .catch(error =>{
      console.log(error + 'Produto não salvo')
    })
    
  }


  return (
    <div>{  
      <div className="container-fluid mt-5 min-vh-100">
        <div className="row mb-5">
          <div className="col-8"><h3>Produtos</h3> </div>
          <div className="col-4"><h3>Dados da Venda</h3></div>
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
                      onChange={(e) =>
                        handleInputChange("quantidade", Number(e.target.value))
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
                <table className="table table-borderless produto_table table-light">
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
                  <label htmlFor="vendedor">Escolha um vendedor</label>
                  <select className="form-control form-select" 
                  id="vendedor"
                  value={invoiceDetailField.vendedor_id}
                  onChange={(e) => handleFinalizeChange('vendedor_id', e.target.value)}
                  // defaultValue=""
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
                  <label htmlFor="cliente">Escolha um cliente</label>
                  <select className="form-control form-select" 
                  id="cliente"
                  value={invoiceDetailField.cliente_id}
                  onChange={(e) => handleFinalizeChange('cliente_id', e.target.value)}
                  // defaultValue=""
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
    }
    </div>
  );
}

export default CadastrarVenda;
