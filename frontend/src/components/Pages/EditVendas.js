import React, { useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import "../CadastrarVenda.css";
import axios from "axios";
import Select from "react-select";
import * as FaIcons from "react-icons/fa";


function EditVendas({displayprodutoSelected, clientes, vendedores, vendedorCliente, produtoSearchList, produtos}) {

  const navigate = useNavigate();
  const [editProduto, setEditProduto] = useState([])
  const [editPessoa, setEditPessoa] = useState({})
  const [addProduto, setAddproduto] = useState({
    produto_id: null,
    quantidade: 0,
  })
  const [total, setTotal] = useState(0); // Dynamically calculates invoice total
  const [timeNow, setTimeNow] = useState("")
  

  useEffect(() => {
    setEditProduto([...displayprodutoSelected])
    setEditPessoa({...vendedorCliente})
    
  }, [displayprodutoSelected,vendedores,clientes])

  useEffect(() => {
    setTimeNow(getFullDateTime());

    // Update every second
    const intervalId = setInterval(() => {
      setTimeNow(getFullDateTime());
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [timeNow]);

  useEffect(() => {
    const newTotal = editProduto.reduce(
      (acc, produto) => acc + produto.total,
      0
    );
    setTotal(newTotal);
  }, [editProduto]);

 

//   // ***************Functions*******************

  const handleInputChange = (field, value) => {
    setAddproduto((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handlePessoa = (field, value) => {
    setEditPessoa((prevValues) => ({
      ...prevValues,
      [field]: value,
    }));
  };

  const handleEditAddicionar = () => {
    // if(produtos){
      console.log(produtoSearchList)
      console.log(addProduto)
      console.log(editProduto)
    const produto_a_editar = produtos.find(
      (produto) => produto.id === addProduto.produto_id['value']
    );
    console.log(produto_a_editar);
    if (produto_a_editar) {

      const obj = {
              id: produto_a_editar.id,
              codigo: produto_a_editar.codigo,
              descricao: produto_a_editar.descricao,
              percentual_comissao: produto_a_editar.percentual_comissao,
              preco: produto_a_editar.valor_unitario,
              quantidade: addProduto.quantidade,
              total: addProduto.quantidade * produto_a_editar.valor_unitario,
      };

      setEditProduto((prevData) => [...prevData, obj]);

      setAddproduto({
        produto_id: null,
        quantidade: 0,
      });
    } else {
      console.log("Produto não existe");
    }
  // }
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
    return addProduto.produto_id && addProduto.quantidade;
  };

  // Function to check whether the all invoice fields are filled before clicking on Finalizar
  const areInvoiceFieldsFilled = () =>{
    return editProduto.length > 0 && editPessoa.clienteId && editPessoa.vendedorId;

  }

  //Deletar venda sendo cadastrada
  const handleEditDelete = (id) =>{
    const removedItem = editProduto.filter((item) => item.id !== id )
    console.log(id)
    setEditProduto(removedItem)
    axios.delete(`http://127.0.0.1:8000/produtosvendidos/${id}/`).
    then(response => console.log(response)).
    catch(error => console.log(error))
    
  }
  // Finalizar Compras
  const handleSubmit= (e) =>{
    e.preventDefault();
    
    const invoice = {}
    invoice.id = editPessoa.vendaId;
    invoice.nota_fiscal = editPessoa.notaFiscal
    invoice.cliente = editPessoa.clienteId;
    invoice.vendedor = editPessoa.vendedorId;
    invoice.datetime = editPessoa.datetime


    axios.patch(`http://127.0.0.1:8000/vendas/${invoice.id}/`, invoice,{
      headers: {
        'Content-Type': 'application/json',
    }
    })
    .then(response => {
      console.log(response)
      navigate('/')
      
    })
    .catch(error =>{
      console.log(error + 'Produto não salvo')
    })
    
  }


  return (
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
                    value={addProduto.produto_id}
                    onChange={(value) => handleInputChange("produto_id", value)}
                    // filterOption={filterOptions}
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
                    value={addProduto.quantidade}
                    // // placeholder="0"
                    onChange={(e) =>
                      handleInputChange("quantidade", e.target.value)
                    }
                  />
                </div>
                <div className="col-2 mt-4 text-center">
                  <button
                    type="button"
                    className="btn btn-secondary ml-3"
                    onClick={handleEditAddicionar}
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
                  {editProduto.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr>
                        <td>
                          {item.codigo}-{item.descricao}
                        </td>
                        <td>{item.quantidade}</td>
                        <td> R${item.preco}</td>
                        <td> R${item.total}</td>
                        <td> <i className="action-delete" onClick={ () => handleEditDelete(item.id)}><FaIcons.FaTrash /> </i> </td>
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
                  value={timeNow}
                  className="form-control"
                  disabled
                />
              </div>
              <div className="form-group mb-4">
                <label htmlFor="vendedor">Escolher um vendedor</label>
                <select className="form-control form-select" 
                id="vendedor"
                value={editPessoa.vendedorId}
                onChange={(e) => handlePessoa('vendedorId', e.target.value)}
                defaultValue=""
                >
                  <option selected disabled value="">
                    {editPessoa.nomeVendedor}
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
                value={editPessoa.clienteId}
                onChange={(e) => handlePessoa('clienteId', e.target.value)}
                defaultValue=""
                >
                  <option selected disabled value="">
                    {editPessoa.nomeCliente}
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
  );
}

export default EditVendas;
