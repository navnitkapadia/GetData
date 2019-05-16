import { SET_CURRENT_USER, USER_LOADING, SET_TOPIC, UPDATE_SENSORS, UPDATE_MOBILE } from "../actions/types";

const isEmpty = require("is-empty");

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_TOPIC: 
      return {
        ...state,
        user: {...state.user, topic: action.payload}
      }
    case UPDATE_SENSORS:
      return {
        ...state,
        user: {
          ...state.user,
          sensorPoints: action.payload
        }
      }
    case UPDATE_MOBILE:
      return {
        ...state,
        user: {
          ...state.user,
          mobile: action.payload
        }
      }
    default:
      return state;
  }
}
