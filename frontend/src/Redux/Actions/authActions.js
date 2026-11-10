import api, { getApiErrorMessage } from "../../api/axios";
import { toast } from "react-toastify";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAIL,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAIL,
  PASSWORD_UPDATE_REQUEST,
  PASSWORD_UPDATE_SUCCESS,
  PASSWORD_UPDATE_FAIL,
  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAIL,
  CLEAR_ERRORS,
} from "../Constants/authConstants";
import { GET_CART_SUCCESS } from "../Constants/cartConstants";

// Бекендът връща целия документ (включително хеша на паролата) — не го пазим в стейта.
const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
};

/** Връща потребителя при успех или null при грешка. */
export const login = (email, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const { data } = await api.post("/api/v1/login", {
      email: email.trim().toLowerCase(),
      password,
    });
    const user = sanitizeUser(data.user);
    dispatch({ type: LOGIN_SUCCESS, payload: user });
    return user;
  } catch (error) {
    dispatch({ type: LOGIN_FAIL, payload: getApiErrorMessage(error) });
    return null;
  }
};

export const register = (userData) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const { data } = await api.post("/api/v1/register", userData);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: "Регистрацията е успешна. Вече можете да влезете в профила си.",
    });
    return data;
  } catch (error) {
    dispatch({ type: REGISTER_FAIL, payload: getApiErrorMessage(error) });
    return null;
  }
};

/** Проверява дали има активна сесия. 401 е нормален отговор за гост — не е грешка. */
export const loadUser = () => async (dispatch) => {
  dispatch({ type: LOAD_USER_REQUEST });
  try {
    const { data } = await api.get("/api/v1/isloggedin");
    dispatch({ type: LOAD_USER_SUCCESS, payload: sanitizeUser(data.user) });
  } catch (error) {
    dispatch({ type: LOAD_USER_FAIL });
  }
};

export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT_REQUEST });
  try {
    await api.post("/api/v1/logout");
    dispatch({ type: LOGOUT_SUCCESS });
    dispatch({ type: GET_CART_SUCCESS, payload: [] });
    return true;
  } catch (error) {
    dispatch({ type: LOGOUT_FAIL, payload: getApiErrorMessage(error) });
    return false;
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  dispatch({ type: PROFILE_UPDATE_REQUEST });
  try {
    const { id, ...payload } = userData;
    const { data } = await api.put(`/api/v1/user/edit/${id}`, payload);
    dispatch({ type: PROFILE_UPDATE_SUCCESS, payload: data.success });
    toast.success("Данните са запазени.");
    dispatch(loadUser());
    return true;
  } catch (error) {
    const message = getApiErrorMessage(error);
    toast.error(message);
    dispatch({ type: PROFILE_UPDATE_FAIL, payload: message });
    return false;
  }
};

export const updatePassword = (userId, passwords) => async (dispatch) => {
  dispatch({ type: PASSWORD_UPDATE_REQUEST });
  try {
    const { data } = await api.put(`/api/v1/user/edit/${userId}`, passwords);
    dispatch({ type: PASSWORD_UPDATE_SUCCESS, payload: data.success });
    toast.success("Паролата е сменена.");
    return true;
  } catch (error) {
    const message = getApiErrorMessage(error);
    toast.error(message);
    dispatch({ type: PASSWORD_UPDATE_FAIL, payload: message });
    return false;
  }
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
