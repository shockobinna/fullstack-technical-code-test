// reducers.js
import { combineReducers } from 'redux';
import vendaReducer from './vendaReducer';

const rootReducer = combineReducers({
  venda: vendaReducer,
  produtos: vendaReducer,
  clientes: vendaReducer,
  vendedores: vendaReducer,
  // Add other reducers if needed
});

export default rootReducer;
