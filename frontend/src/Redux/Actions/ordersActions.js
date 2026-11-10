import api, { getApiErrorMessage } from "../../api/axios";
import { toast } from "react-toastify";
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
import { resetCart } from "./cartActions";

export const createOrder = (orderData) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });
  try {
    const { data } = await api.post("/api/v1/order/new", orderData);
    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
    await api.put("/api/v1/order/clear/cart");
    dispatch(resetCart());
    return data;
  } catch (error) {
    const message = getApiErrorMessage(error);
    dispatch({ type: CREATE_ORDER_FAIL, payload: message });
    toast.error(message);
    return null;
  }
};

export const getUserOrders = () => async (dispatch) => {
  dispatch({ type: MY_ORDERS_REQUEST });
  try {
    const { data } = await api.get("/api/v1/orders");
    dispatch({ type: MY_ORDERS_SUCCESS, payload: data.orders || [] });
  } catch (error) {
    // Бекендът връща 404, когато потребителят няма поръчки — това е празно състояние, не грешка.
    if (error.status === 404) {
      dispatch({ type: MY_ORDERS_SUCCESS, payload: [] });
      return;
    }
    dispatch({ type: MY_ORDERS_FAIL, payload: getApiErrorMessage(error) });
  }
};

export const getOrderDetails = (orderId) => async (dispatch) => {
  dispatch({ type: ORDER_DETAILS_REQUEST });
  try {
    const { data } = await api.get(`/api/v1/order/${orderId}`);
    dispatch({ type: ORDER_DETAILS_SUCCESS, payload: data.order });
  } catch (error) {
    dispatch({ type: ORDER_DETAILS_FAIL, payload: getApiErrorMessage(error) });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
