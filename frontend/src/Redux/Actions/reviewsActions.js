import api, { getApiErrorMessage } from "../../api/axios";
import { toast } from "react-toastify";
import {
  CREATE_REVIEW_REQUEST,
  CREATE_REVIEW_SUCCESS,
  CREATE_REVIEW_FAIL,
  GET_PRODUCT_REVIEWS_REQUEST,
  GET_PRODUCT_REVIEWS_SUCCESS,
  GET_PRODUCT_REVIEWS_FAIL,
  CLEAR_ERRORS,
  EDIT_REVIEW_REQUEST,
  EDIT_REVIEW_SUCCESS,
  EDIT_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST,
  DELETE_REVIEW_SUCCESS,
  DELETE_REVIEW_FAIL,
} from "../Constants/reviewsConstants";

const fail = (dispatch, type, error) => {
  const message = getApiErrorMessage(error);
  dispatch({ type, payload: message });
  toast.error(message);
  return false;
};

export const createReview = (reviewData) => async (dispatch) => {
  dispatch({ type: CREATE_REVIEW_REQUEST });
  try {
    const { data } = await api.post("/api/v1/review/new", reviewData);
    dispatch({ type: CREATE_REVIEW_SUCCESS, payload: data.review });
    toast.success("Благодарим! Ревюто ви е публикувано.");
    return true;
  } catch (error) {
    return fail(dispatch, CREATE_REVIEW_FAIL, error);
  }
};

export const getProductReviews = (productId) => async (dispatch) => {
  dispatch({ type: GET_PRODUCT_REVIEWS_REQUEST });
  try {
    const { data } = await api.get(`/api/v1/review/${productId}`);
    dispatch({ type: GET_PRODUCT_REVIEWS_SUCCESS, payload: data.reviews || [] });
  } catch (error) {
    dispatch({ type: GET_PRODUCT_REVIEWS_FAIL, payload: getApiErrorMessage(error) });
  }
};

export const editReview = (newData, reviewId) => async (dispatch) => {
  dispatch({ type: EDIT_REVIEW_REQUEST });
  try {
    const { data } = await api.put(`/api/v1/review/edit/${reviewId}`, newData);
    dispatch({ type: EDIT_REVIEW_SUCCESS, payload: data.review });
    toast.success("Ревюто е обновено.");
    return true;
  } catch (error) {
    return fail(dispatch, EDIT_REVIEW_FAIL, error);
  }
};

export const deleteReviews = (reviewId) => async (dispatch) => {
  dispatch({ type: DELETE_REVIEW_REQUEST });
  try {
    await api.delete(`/api/v1/review/delete/${reviewId}`);
    dispatch({ type: DELETE_REVIEW_SUCCESS, payload: reviewId });
    toast.info("Ревюто е изтрито.");
    return true;
  } catch (error) {
    return fail(dispatch, DELETE_REVIEW_FAIL, error);
  }
};

export const clearErrors = () => (dispatch) => dispatch({ type: CLEAR_ERRORS });
