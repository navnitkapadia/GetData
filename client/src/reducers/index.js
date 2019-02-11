import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import getReducer from "./getReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  get: getReducer
});
