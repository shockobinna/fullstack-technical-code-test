const initialState = {
  // Define your initial state here
  // For example:
  vendas: [],
};

const vendaReducer = (state = initialState, action) => {
  // Implement your reducer logic based on the action type
  // For example:
  switch (action.type) {
    case 'UPDATE_VENDA_DATA':
      // Update state with fetched vendas
      return {
        ...state,
        vendas: JSON.parse(action.payload),
      };
    // Add other cases as needed
    default:
      return state;
  }
};

export default vendaReducer;




  
  
  