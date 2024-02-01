const initialState = {
  allVendas: [],
  vendas: [],
  produtos: [],
  clientes: [],
  vendedores: [],
  produtoFormatado: [],
  loading: false,
};

const vendaReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_VENDAS_REQUEST":
      // Set loading state to true when starting to fetch data
      return {
        ...state,
        loading: true,
      };
    case "ALL_VENDAS":
      // Update state with fetched vendas from API
      return {
        ...state,
        allVendas: [...state.allVendas, action.payload],
        loading: false,
      };
    case "UPDATE_VENDA_DATA":
      // Update venda
      return {
        ...state,
        vendas: action.payload.length > 0 ? JSON.parse(action.payload) : [],
        loading: false,
      };
    // Update state with fetched produtos
    case "ADD_PRODUTOS":
      // Handle adding produtos
      return {
        ...state,
        produtos: [...state.produtos, action.payload],
        loading: false,
      };

    case "ADD_CLIENTES":
      // Handle adding clientes
      return {
        ...state,
        clientes: [...state.clientes, action.payload],
        loading: false,
      };

    case "ADD_VENDEDORES":
      // Handle adding vendedores
      return {
        ...state,
        vendedores: [...state.vendedores, action.payload],
        loading: false,
      };

    case "SEARCH_PRODUTO":
      return {
        ...state,
        produtoFormatado: [...state.produtoFormatado, action.payload],
        loading: false,
      };
    default:
      return state;
  }
};

export default vendaReducer;
