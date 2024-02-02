// actions.jsx
import axios from "axios";

const fetchVendasRequest = () => ({
  type: "FETCH_VENDAS_REQUEST",
});

export const fetchAllVendas = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchVendasRequest());
      const response = await axios.get("http://127.0.0.1:8000/listallvendas/");
      dispatch({ type: "ALL_VENDAS", payload: response.data });
    } catch (error) {
      console.log("Error fetching Produtos:", error);
    }
  };
};

export const fetchProdutos = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchVendasRequest());
      const response = await axios.get("http://127.0.0.1:8000/produtos/");
      const formattedOptions = response.data.map((produto) => ({
        value: produto.id,
        label: `${produto.codigo} - ${produto.descricao}`,
        codigo: produto.codigo, // Add the product code to the option for filtering
      }));
      dispatch({ type: "ADD_PRODUTOS", payload: response.data });
      dispatch({ type: "SEARCH_PRODUTO", payload: formattedOptions });
    } catch (error) {
      console.log("Error fetching Produtos:", error);
    }
  };
};

export const fetchClientes = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchVendasRequest());
      const response = await axios.get("http://127.0.0.1:8000/clientes/");
      dispatch({ type: "ADD_CLIENTES", payload: response.data });
    } catch (error) {
      console.error("Error fetching Clientes:", error);
    }
  };
};

export const fetchVendedores = () => {
  return async (dispatch) => {
    try {
      dispatch(fetchVendasRequest());
      const response = await axios.get("http://127.0.0.1:8000/vendedores/");
      dispatch({ type: "ADD_VENDEDORES", payload: response.data });
    } catch (error) {
      console.error("Error fetching Vendodores:", error);
    }
  };
};

export const deleteVenda = (id) => {
  return async (dispatch) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/vendas/${id}`);
      console.log(response.status);
      if (response.status === 204) {
        dispatch({ type: "DELETE_VENDA", payload: id });
      }
    } catch (error) {
      console.log("Error fetching Produtos:", error);
    }
  };
};

export const updateVendaData = (updatedData) => ({
  type: "UPDATE_VENDA_DATA",
  payload: updatedData,
});
