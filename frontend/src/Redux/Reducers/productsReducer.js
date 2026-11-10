import {
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAIL,
  GET_PRODUCT_DETAILS_REQUEST,
  GET_PRODUCT_DETAILS_SUCCESS,
  GET_PRODUCT_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../Constants/productsConstants";

// error: { message, status } | null
export const productsReducers = (
  state = { products: [], loading: true, error: null },
  action
) => {
  switch (action.type) {
    case GET_PRODUCTS_REQUEST:
      return { loading: true, products: [], error: null };
    case GET_PRODUCTS_SUCCESS:
      return { loading: false, products: action.payload, error: null };
    case GET_PRODUCTS_FAIL:
      return { loading: false, products: [], error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};

export const productDetailsReducer = (
  state = { product: null, loading: true, error: null },
  action
) => {
  switch (action.type) {
    case GET_PRODUCT_DETAILS_REQUEST:
      return { product: null, loading: true, error: null };
    case GET_PRODUCT_DETAILS_SUCCESS:
      return { loading: false, product: action.payload, error: null };
    case GET_PRODUCT_DETAILS_FAIL:
      return { loading: false, product: null, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
