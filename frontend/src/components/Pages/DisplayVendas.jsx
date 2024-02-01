import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Styles/DisplayVendas.module.css";
import * as FaIcons from "react-icons/fa";
import DeleteVendaModal from "./DeleteVendaModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllVendas } from "../../redux/actions";

const DisplayVendas = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allVendas = useSelector((state) => state.venda.allVendas[0]);
  const isLoading = useSelector((state) => state.venda.loading);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toastDisplayed, setToastDisplayed] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [produtoId, setProdutoId] = useState(null);
  const [produtoDeletado, setProdutoDeletado] = useState(false);
  const [initialRender, setInitialRender] = useState(true); // logica para a função fetchVendas  funcionar quando o componente é renderizado
  const [totalsForRow, setTotalsForRow] = useState({
    totalQuantidade: 0,
    totalRowProduto: 0,
    totalComissao: 0,
  });
  const location = useLocation();
  console.log(allVendas);

  useEffect(() => {
    if (initialRender) {
      dispatch(fetchAllVendas());
      setInitialRender(false);
    }

    if (produtoDeletado) {
      dispatch(fetchAllVendas());
      setProdutoDeletado(false);
    }
  }, [produtoDeletado, initialRender, dispatch]); // dependencias para o fetchVendas fucionar dinamicamente

  useEffect(() => {
    if (allVendas) {
      setSalesData(allVendas);
    }
  }, [allVendas]);

  useEffect(() => {
    // Check the nested state property
    const actionResult = location.state?.actionResult;
    const isSuccess = actionResult?.success;
    const editResult = location.state?.editResult;
    const isEditSuccess = editResult?.success;

    if (!initialRender && isSuccess && !toastDisplayed) {
      // Show success toast with a delay
      const toastId = setTimeout(() => {
        toast.success("VENDA REALIZADA COM SUCESSO!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            backgroundColor: "#78D6C6",
            width: "575px",
            color: "white",
          },
        });
      }, 500);
      setToastDisplayed(true);
      return () => {
        // Cleanup function to clear the toast when the component unmounts
        toast.dismiss(toastId);
      };
    } else if (!initialRender && isEditSuccess && !toastDisplayed) {
      const toastId = setTimeout(() => {
        toast.success("VENDA ALTERADA COM SUCESSO!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            backgroundColor: "#78D6C6",
            width: "575px",
            color: "white",
          },
        });
      }, 500);

      setToastDisplayed(true);
      return () => {
        // Cleanup function to clear the toast when the component unmounts
        toast.dismiss(toastId);
      };
    }
  }, [location.state, toastDisplayed, initialRender]);

  const toggleRow = (rowId) => {
    setSalesData((prevData) =>
      prevData.map((item) => ({
        ...item,
        isExpanded: item.id === rowId && !item.isExpanded,
      }))
    );
    const calculateTotalsForRows = calculateTotalsForRow(rowId);
    setTotalsForRow(calculateTotalsForRows);
  };

  const handleUpdate = (item) => {
    // Add code to handle "Update" action here
    const data = JSON.stringify(item);
    dispatch({ type: "UPDATE_VENDA_DATA", payload: data });
    navigate("/editarVenda", { state: { editData: item.nota_fiscal } });
  };

  const calculateTotalsForRow = (rowId) => {
    // Find the object with the matching 'id' in salesData
    const selectedItem = salesData.find((item) => item.id === rowId);

    if (selectedItem) {
      let totalQuantidade = 0;
      let totalRowProduto = 0;
      let totalComissao = 0;

      selectedItem.produtos.forEach((produto) => {
        totalQuantidade += produto.quantidade;
        totalRowProduto += parseFloat(
          produto.valor_unitario * produto.quantidade
        );
        if (produto.comissao_a_receber !== null) {
          totalComissao += parseFloat(produto.comissao_a_receber);
        }
      });

      return {
        totalQuantidade,
        totalRowProduto,
        totalComissao,
      };
    }

    return null; // Return null if no item with matching 'id' is found
  };

  const handleDeleteClick = (id) => {
    // Open the delete confirmation modal
    setDeleteModalOpen(true);
    setProdutoId(id);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/vendas/${produtoId}`
      );

      if (response.status === 204) {
        setProdutoDeletado(true);
        toast.success("VENDA REMOVIDO COM SUCESSO!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            backgroundColor: "#78D6C6",
            width: "575px",
            color: "white",
          },
        });
      } else {
        console.log("Falha em deletar o produto");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteModalOpen(false);
    }
  };

  const handleModalClose = () => {
    // Close the delete confirmation modal
    setDeleteModalOpen(false);
  };

  const formatarData = (data) => {
    const formatada = new Date(data)
      .toLocaleString("pt-BR", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        timeZone: "UTC",
      })
      .replace(/,/g, " -");
    return formatada;
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between mb-5">
        <div>
          {" "}
          <h3 className={styles.vendas_titulo}>Vendas Realizadas</h3>
        </div>
        <div>
          <Link to="/novaVenda">
            <button className={styles.btn_nova_venda}>
              Inserir Nova Venda
            </button>
          </Link>
        </div>
      </div>
      <div className={styles.VendaTableContainer}>
        <table className={`table table-light ${styles.stickyVendaHeader}`}>
          <thead>
            <tr className={styles.mainTableHead}>
              <th>Nota Fiscal</th>
              <th>Cliente</th>
              <th>Vendedor</th>
              <th>Data da Venda</th>
              <th>Valor Total</th>
              <th style={{ paddingLeft: "40px" }}>Opcões</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              salesData.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className={styles.venda_table}>
                    <td>{item.nota_fiscal}</td>
                    <td>{item.cliente}</td>
                    <td>{item.vendedor}</td>
                    <td>{formatarData(item.datetime)}</td>
                    <td style={{ paddingLeft: "50px" }}>
                      {item.total_compras}
                    </td>
                    <td>
                      <tr>
                        <td>
                          {" "}
                          <i
                            className={styles.action_ver}
                            onClick={() => toggleRow(item.id)}
                          >
                            {item.isExpanded ? "Fechar" : "Ver Itens"}
                          </i>
                        </td>
                        <td>
                          {" "}
                          <i
                            className={styles.action_edit}
                            onClick={() => handleUpdate(item)}
                          >
                            <FaIcons.FaEdit />
                          </i>
                        </td>
                        <td>
                          {" "}
                          <i
                            className={styles.action_delete}
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            <FaIcons.FaTrash />{" "}
                          </i>{" "}
                        </td>
                      </tr>
                    </td>
                  </tr>
                  {item.isExpanded && (
                    <td colspan="6">
                      <table className="table table-borderless">
                        <thead>
                          <tr className={styles.expandadbleTableHead}>
                            <th>Produtos/Serviço</th>
                            <th>Quantidade</th>
                            <th>Preço unitario</th>
                            <th>Total do Produto</th>
                            <th>% de Comissão</th>
                            <th>Comissão</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.produtos.map((produto) => (
                            <tr
                              className={styles.expandadbleTableDetails}
                              key={produto.id}
                            >
                              <td>{produto.descricao}</td>
                              <td style={{ paddingLeft: "50px" }}>
                                {produto.quantidade}
                              </td>
                              <td style={{ paddingLeft: "50px" }}>
                                R${produto.valor_unitario}
                              </td>
                              <td style={{ paddingLeft: "50px" }}>
                                R${produto.valor_unitario * produto.quantidade}
                              </td>
                              <td style={{ paddingLeft: "50px" }}>
                                {produto.comissao_configurada}%
                              </td>
                              <td style={{ paddingLeft: "30px" }}>
                                R${produto.comissao_a_receber}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className={styles.footerInfo}>
                            <th className="produto_servico">Total de Venda</th>
                            <th style={{ paddingLeft: "50px" }}>
                              {totalsForRow.totalQuantidade}
                            </th>
                            <th>&nbsp;</th>
                            <th style={{ paddingLeft: "50px" }}>
                              R$ {totalsForRow.totalRowProduto}
                            </th>
                            <th></th>
                            <th style={{ paddingLeft: "30px" }}>
                              R$ {totalsForRow.totalComissao}
                            </th>
                          </tr>
                        </tfoot>
                      </table>
                    </td>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
      <DeleteVendaModal
        isOpen={isDeleteModalOpen}
        onClose={handleModalClose}
        onDelete={handleDeleteConfirm}
      />
    </div>
  );
};

export default DisplayVendas;
