const initialState = {
  // Define your initial state here
  // For example:
  vendas: [],
  produtos:[],
  clientes:[],
  vendedores:[]
};

const vendaReducer = (state = initialState, action) => {
  // Implement your reducer logic based on the action type
  // For example:
  switch (action.type) {
    case 'UPDATE_VENDA_DATA':
      // Update state with fetched vendas
      return {
        ...state,
        vendas: action.payload.length > 0 ? JSON.parse(action.payload) : [],
      };
    // Add other cases as needed
    case 'ADD_PRODUTOS':
      // Handle adding produtos
      return {
        ...state,
        produtos: [...state.produtos, action.payload],
      };

    case 'ADD_CLIENTES':
      // Handle adding clientes
      return {
        ...state,
        clientes: [...state.clientes, action.payload],
      };

    case 'ADD_VENDEDORES':
      // Handle adding vendedores
      return {
        ...state,
        vendedores: [...state.vendedores, action.payload],
      };
    default:
      return state;
  }
};

export default vendaReducer;




  
  
  