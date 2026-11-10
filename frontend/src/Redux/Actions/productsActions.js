import api, { getApiErrorMessage } from "../../api/axios";
import {
  GET_PRODUCTS_REQUEST,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_FAIL,
  GET_PRODUCT_DETAILS_REQUEST,
  GET_PRODUCT_DETAILS_SUCCESS,
  GET_PRODUCT_DETAILS_FAIL,
  CLEAR_ERRORS,
} from "../Constants/productsConstants";

export const getProducts = (cat) => async (dispatch) => {
  dispatch({ type: GET_PRODUCTS_REQUEST });
  try {
    const { data } = await api.get(`/api/v1/products/${encodeURIComponent(cat)}`);
    dispatch({ type: GET_PRODUCTS_SUCCESS, payload: data.products || [] });
  } catch (error) {
    // „Products not found“ от бекенда = празна категория.
    if (error.status === 404 && /products not found/i.test(error.response?.data?.errMessage || "")) {
      dispatch({ type: GET_PRODUCTS_SUCCESS, payload: [] });
      return;
    }
    dispatch({
      type: GET_PRODUCTS_FAIL,
      payload: { message: getApiErrorMessage(error), status: error.status },
    });
  }
};

export const getProductDetails = (cat, id) => async (dispatch) => {
  dispatch({ type: GET_PRODUCT_DETAILS_REQUEST });
  try {
    const { data } = await api.get(
      `/api/v1/products/${encodeURIComponent(cat)}/${id}`
    );
    dispatch({ type: GET_PRODUCT_DETAILS_SUCCESS, payload: data.product });
  } catch (error) {
    dispatch({
      type: GET_PRODUCT_DETAILS_FAIL,
      payload: { message: getApiErrorMessage(error), status: error.status },
    });
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
