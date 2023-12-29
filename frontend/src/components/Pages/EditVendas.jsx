import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../CadastrarVenda.css";
import axios from "axios";
import Select from "react-select";
import * as FaIcons from "react-icons/fa";

// function EditVendas({displayprodutoSelected, clientes, vendedores, vendedorCliente, produtoSearchList, produtos}) {
function EditVendas() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [editProduto, setEditProduto] = useState([]);
  const [editPessoa, setEditPessoa] = useState({});
  const [addProduto, setAddproduto] = useState({
    produto_id: null,
    quantidade: null,
  });
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [total, setTotal] = useState(0); // Dynamically calculates invoice total
  // const [timeNow, setTimeNow] = useState("")
  const editVendas = useSelector((state) => state.venda || []);
  const produtosData = useSelector(
    (state) => state.produtos["produtos"][0] || []
  );
  const clientesData = useSelector(
    (state) => state.clientes["clientes"][0] || []
  );
  const vendedoresData = useSelector(
    (state) => state.vendedores["vendedores"][0] || []
  );
  const produtoSearchList = useSelector(
    (state) => state.produtoFormatado["produtoFormatado"][0] || []
  );

  useEffect(() => {
    checkVendasParaEditar();
  }, [
    editVendas,
    vendedoresData,
    clientesData,
    produtoSearchList,
    produtosData,
  ]);

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
    const newTotal = editProduto.reduce(
      (acc, produto) => acc + produto.total,
      0
    );
    setTotal(newTotal);
  }, [editProduto]);

  //   // ***************Functions*******************

  const checkVendasParaEditar = () => {
    const vendaArray = Object.values(editVendas);
    const updatedSelectedProdutos = [];
    const clienteInfoArray = [];

    vendaArray.forEach((venda) => {
      const clienteInfo = {
        vendedorId: venda.vendedor_id,
        nomeVendedor: venda.vendedor,
        clienteId: venda.cliente_id,
        nomeCliente: venda.cliente,
        vendaId: venda.id,
        notaFiscal: venda.nota_fiscal,
        datetime: venda.datetime,
      };

      clienteInfoArray.push(clienteInfo);

      const produtos = venda.produtos;

      if (produtos && produtos.length > 0) {
        produtos.forEach((code) => {
          // Create a new object for each product
          const produtoEdit = {
            id: code.id,
            produto_id: code.produto_id,
            codigo: code.codigo,
            descricao: code.descricao,
            percentual_comissao: code.percentual_comissao,
            preco: code.valor_unitario,
            quantidade: code.quantidade,
            total: code.quantidade * code.valor_unitario,
            comissao_configurada: code.comissao_configurada,
            comissao_a_receber: code.comissao_a_receber,
          };
          updatedSelectedProdutos.push(produtoEdit);
        });
      }
    });

    setEditProduto(updatedSelectedProdutos);
    setEditPessoa(clienteInfoArray[0]);
  };

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
  const areInvoiceFieldsFilled = () => {
    return (
      editProduto.length > 0 && editPessoa.clienteId && editPessoa.vendedorId
    );
  };

  //Deletar venda sendo cadastrada
  const handleEditDelete = (id) => {
    const removedItem = editProduto.filter((item) => item.id !== id);
    setEditProduto(removedItem);
    axios
      .delete(`http://127.0.0.1:8000/produtosvendidos/${id}/`)
      .then()
      .catch((error) => console.log(error));
  };
  // Finalizar Compras
  const handleSubmit = (e) => {
    e.preventDefault();

    const invoice = {};
    invoice.id = editPessoa.vendaId;
    invoice.nota_fiscal = editPessoa.notaFiscal;
    invoice.cliente = editPessoa.clienteId;
    invoice.vendedor = editPessoa.vendedorId;
    invoice.datetime = editPessoa.datetime;

    axios
      .patch(`http://127.0.0.1:8000/vendas/${invoice.id}/`, invoice, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        dispatch({ type: "UPDATE_VENDA_DATA", payload: [] });
        navigate("/", { state: { editResult: { success: true } } });
      })
      .catch((error) => {
        console.log(error + "Produto não salvo");
      });
  };

  return (
    <div className="container-fluid mt-5 min-vh-100">
      <div className="row mb-5">
        <div className="col-8">
          <h3>Produtos</h3>
        </div>
        <div className="col-4">
          <h3>Dados da Venda</h3>
        </div>
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
                    isDisabled
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
                    disabled
                  />
                </div>
                <div className="col-2 mt-4 text-center">
                  <button
                    type="button"
                    className="btn btn-secondary ml-3"
                    // onClick={handleEditAddicionar}
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
                  {editProduto.map((item) => (
                    <React.Fragment key={item.id}>
                      <tr>
                        <td>
                          {item.codigo}-{item.descricao}
                        </td>
                        <td>{item.quantidade}</td>
                        <td> R${item.preco}</td>
                        <td> R${item.total}</td>
                        <td>
                          {" "}
                          <i
                            className="action-delete"
                            onClick={() => handleEditDelete(item.id)}
                          >
                            <FaIcons.FaTrash />{" "}
                          </i>{" "}
                        </td>
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
                <select
                  className="form-control form-select"
                  id="vendedor"
                  value={editPessoa.vendedorId}
                  onChange={(e) => handlePessoa("vendedorId", e.target.value)}
                  // defaultValue="vendedor"
                >
                  <option selected disabled value="">
                    {editPessoa.nomeVendedor}
                  </option>
                  {vendedoresData.map((vendedor) => (
                    <option key={vendedor.id} value={vendedor.id}>
                      {vendedor.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group mb-5">
                <label htmlFor="cliente">Escolha um cliente</label>
                <select
                  className="form-control form-select"
                  id="cliente"
                  value={editPessoa.clienteId}
                  onChange={(e) => handlePessoa("clienteId", e.target.value)}
                  // defaultValue="cliente"
                >
                  <option selected disabled value="">
                    {editPessoa.nomeCliente}
                  </option>
                  {clientesData.map((cliente) => (
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
                  <button
                    className="btn btn-secondary"
                    onClick={handleSubmit}
                    disabled={!areInvoiceFieldsFilled()}
                  >
                    Finalizar
                  </button>
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
