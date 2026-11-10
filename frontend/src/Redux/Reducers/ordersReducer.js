import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAIL,
  MY_ORDERS_REQUEST,
  MY_ORDERS_SUCCESS,
  MY_ORDERS_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../Constants/ordersConstants";

const initialState = {
  orders: [],
  orderDetails: null,
  order: null,
  loading: false,
  creating: false,
  error: null,
};

export const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return { ...state, creating: true, error: null };
    case MY_ORDERS_REQUEST:
      return { ...state, loading: true, error: null };
    case ORDER_DETAILS_REQUEST:
      return { ...state, loading: true, error: null, orderDetails: null };
    case CREATE_ORDER_SUCCESS:
      return { ...state, creating: false, order: action.payload?.order || null };
    case MY_ORDERS_SUCCESS:
      return { ...state, loading: false, orders: action.payload };
    case ORDER_DETAILS_SUCCESS:
      return { ...state, loading: false, orderDetails: action.payload };
    case CREATE_ORDER_FAIL:
      return { ...state, creating: false, error: action.payload };
    case MY_ORDERS_FAIL:
    case ORDER_DETAILS_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
