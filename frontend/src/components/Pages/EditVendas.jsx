import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "../Styles/CadastrarVenda.module.css";
// import axios from "axios";
import Select from "react-select";
import * as FaIcons from "react-icons/fa";
import {
  fetchClientes,
  fetchProdutos,
  fetchVendedores,
  deleteProdutoVendido,
  updateVendaData,
} from "../../redux/actions";

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
  const editVendas = JSON.parse(localStorage.getItem("editVenda"));

  const clientesData = useSelector((state) => state.venda.clientes);
  const vendedoresData = useSelector((state) => state.venda.vendedores);
  const produtoSearchList = useSelector(
    (state) => state.venda.produtoFormatado
  );
  const isLoading = useSelector((state) => state.venda.loading);
  const isEditedSuccessfully = useSelector(
    (state) => state.venda.editVendaStatus
  );

  useEffect(() => {
    dispatch(fetchClientes());
    dispatch(fetchVendedores());
    dispatch(fetchProdutos());
  }, [dispatch]);

  useEffect(() => {
    checkVendasParaEditar();
  }, []);

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

  useEffect(() => {
    if (isEditedSuccessfully) {
      navigate("/", { state: { editResult: { success: true } } });
      dispatch({ type: "EDITED_SUCCESSFULLY", payload: false });
    }
  }, [isEditedSuccessfully, navigate, dispatch]);

  // ***************Functions*******************

  const checkVendasParaEditar = () => {
    const venda = editVendas;

    const updatedSelectedProdutos = [];
    const clienteInfoArray = [];

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
    dispatch(deleteProdutoVendido(id));
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

    dispatch(updateVendaData(invoice));
  };

  return (
    <div className="container mt-5 min-vh-100">
      <div className="row mb-5">
        <div className="col-8">
          <h3>Produtos</h3>
        </div>
        <div className="col-4">
          <h3>Dados da Venda</h3>
        </div>
      </div>

      <div className="row">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="col-8">
              <div className="">
                <form>
                  <div className="row mb-5">
                    <div className="col-7">
                      <label>Buscar pelo código de barra ou descrição</label>
                      <Select
                        options={produtoSearchList}
                        value={addProduto.produto_id}
                        onChange={(value) =>
                          handleInputChange("produto_id", value)
                        }
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
                    <div className="col-3">
                      <label htmlFor="quantidade">Quantidade de Itens</label>
                      <input
                        type="number"
                        className={`form-control ${styles.quant}`}
                        value={addProduto.quantidade}
                        onChange={(e) =>
                          handleInputChange("quantidade", e.target.value)
                        }
                        disabled
                      />
                    </div>
                    <div className="col-2 mt-4">
                      <button
                        type="button"
                        className={styles.add_btn}
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
                  <table
                    className={`table table-borderless ${styles.produto_table} table-light`}
                  >
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
                                className={styles.action_delete}
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
            <div className={`col-4 ${styles.dados}`}>
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
                      onChange={(e) =>
                        handlePessoa("vendedorId", e.target.value)
                      }
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
                      onChange={(e) =>
                        handlePessoa("clienteId", e.target.value)
                      }
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
                    <div className="col fw-bold mt-2">
                      Valor total da venda:
                    </div>
                    <div className="col text-end fw-bold fs-4">R$ {total}</div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <button className={styles.add_btn}>Cancelar</button>
                    </div>
                    <div className="col text-end">
                      <button
                        className={styles.finalizar_btn}
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
          </>
        )}
      </div>
    </div>
  );
}

export default EditVendas;
