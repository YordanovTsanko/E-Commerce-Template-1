import api, { getApiErrorMessage } from "../../api/axios";
import { toast } from "react-toastify";
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

export const getCart = () => async (dispatch) => {
  dispatch({ type: GET_CART_REQUEST });
  try {
    const { data } = await api.get("/api/v1/cart");
    dispatch({ type: GET_CART_SUCCESS, payload: data.cart || [] });
  } catch (error) {
    dispatch({ type: GET_CART_FAIL, payload: getApiErrorMessage(error) });
  }
};

/**
 * Бекендът добавя по 1 брой на заявка, затова за quantity > 1
 * изпращаме заявките последователно.
 */
export const addToCart =
  (productId, quantity = 1, { silent = false } = {}) =>
  async (dispatch) => {
    dispatch({ type: ADD_TO_CART_REQUEST, payload: productId });
    try {
      let cart = [];
      for (let i = 0; i < Math.max(1, quantity); i += 1) {
        const { data } = await api.put(`/api/v1/cart/add/${productId}`);
        cart = data.cart;
      }
      dispatch({ type: ADD_TO_CART_SUCCESS, payload: cart });
      if (!silent) {
        toast.success(
          quantity > 1
            ? `Добавихте ${quantity} бр. в количката.`
            : "Продуктът е добавен в количката."
        );
      }
      return true;
    } catch (error) {
      const message = getApiErrorMessage(error);
      dispatch({ type: ADD_TO_CART_FAIL, payload: message });
      toast.error(message);
      return false;
    }
  };

export const removeFromCart = (productId) => async (dispatch) => {
  dispatch({ type: REMOVE_FROM_CART_REQUEST, payload: productId });
  try {
    const { data } = await api.delete(`/api/v1/cart/delete/${productId}`);
    dispatch({ type: REMOVE_FROM_CART_SUCCESS });
    dispatch({ type: GET_CART_SUCCESS, payload: data.cart || [] });
    toast.info("Продуктът е премахнат от количката.");
    return true;
  } catch (error) {
    const message = getApiErrorMessage(error);
    dispatch({ type: REMOVE_FROM_CART_FAIL, payload: message });
    toast.error(message);
    return false;
  }
};

export const resetCart = () => ({ type: GET_CART_SUCCESS, payload: [] });
