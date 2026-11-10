import {
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  ADD_TO_CART_FAIL,
  GET_CART_REQUEST,
  GET_CART_SUCCESS,
  GET_CART_FAIL,
  REMOVE_FROM_CART_REQUEST,
  REMOVE_FROM_CART_SUCCESS,
  REMOVE_FROM_CART_FAIL,
} from "../Constants/cartConstants";

const initialState = {
  cartItems: [],
  loading: false,
  pendingId: null, // продуктът, върху който тече заявка (за спинър на бутона)
  error: null,
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CART_REQUEST:
      return { ...state, loading: state.cartItems.length === 0 };
    case ADD_TO_CART_REQUEST:
    case REMOVE_FROM_CART_REQUEST:
      return { ...state, pendingId: action.payload, error: null };
    case ADD_TO_CART_SUCCESS:
    case GET_CART_SUCCESS:
      return {
        ...state,
        loading: false,
        pendingId: null,
        cartItems: Array.isArray(action.payload) ? action.payload : [],
      };
    case REMOVE_FROM_CART_SUCCESS:
      return { ...state, pendingId: null };
    case ADD_TO_CART_FAIL:
    case GET_CART_FAIL:
    case REMOVE_FROM_CART_FAIL:
      return { ...state, loading: false, pendingId: null, error: action.payload };
    default:
      return state;
  }
};
