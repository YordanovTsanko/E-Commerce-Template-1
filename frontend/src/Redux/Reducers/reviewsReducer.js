import {
  CREATE_REVIEW_REQUEST, CREATE_REVIEW_SUCCESS, CREATE_REVIEW_FAIL,
  GET_PRODUCT_REVIEWS_REQUEST, GET_PRODUCT_REVIEWS_SUCCESS, GET_PRODUCT_REVIEWS_FAIL,
  EDIT_REVIEW_REQUEST, EDIT_REVIEW_SUCCESS, EDIT_REVIEW_FAIL,
  DELETE_REVIEW_REQUEST, DELETE_REVIEW_SUCCESS, DELETE_REVIEW_FAIL, CLEAR_ERRORS,
} from "../Constants/reviewsConstants";

const initialState = { reviews: [], loading: false, error: null };

export const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_REVIEW_REQUEST:
    case GET_PRODUCT_REVIEWS_REQUEST:
    case EDIT_REVIEW_REQUEST:
    case DELETE_REVIEW_REQUEST:
      return { ...state, loading: true, error: null };
    case CREATE_REVIEW_SUCCESS:
      return {
        ...state, loading: false, error: null,
        reviews: state.reviews.some((review) => review._id === action.payload._id)
          ? state.reviews
          : [...state.reviews, action.payload],
      };
    case EDIT_REVIEW_SUCCESS:
      return {
        ...state, loading: false, error: null,
        reviews: state.reviews.map((review) =>
          review._id === action.payload._id ? action.payload : review
        ),
      };
    case DELETE_REVIEW_SUCCESS:
      return {
        ...state, loading: false, error: null,
        reviews: state.reviews.filter((review) => review._id !== action.payload),
      };
    case GET_PRODUCT_REVIEWS_SUCCESS:
      return { ...state, loading: false, error: null, reviews: action.payload || [] };
    case CREATE_REVIEW_FAIL:
    case GET_PRODUCT_REVIEWS_FAIL:
    case EDIT_REVIEW_FAIL:
    case DELETE_REVIEW_FAIL:
      return { ...state, loading: false, error: action.payload };
    case CLEAR_ERRORS:
      return { ...state, error: null };
    default:
      return state;
  }
};
