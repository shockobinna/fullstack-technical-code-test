// reducers.js
import { combineReducers } from "redux";
import vendaReducer from "./vendaReducer";

const rootReducer = combineReducers({
  venda: vendaReducer,
});

export default rootReducer;
