import {
  legacy_createStore as createStore,
  applyMiddleware,
  compose,
  combineReducers,
} from "redux";
import { thunk } from "redux-thunk";

import { authReducer, userReducer } from "./Redux/Reducers/authReducer";
import { productDetailsReducer, productsReducers } from "./Redux/Reducers/productsReducer";
import { ordersReducer } from "./Redux/Reducers/ordersReducer";
import { cartReducer } from "./Redux/Reducers/cartReducer";
import { reviewsReducer } from "./Redux/Reducers/reviewsReducer";

const reducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  products: productsReducers,
  productDetails: productDetailsReducer,
  orders: ordersReducer,
  cart: cartReducer,
  reviews: reviewsReducer,
});

const composeEnhancers =
  (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) ||
  compose;

const store = createStore(reducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
