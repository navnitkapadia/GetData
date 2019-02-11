import { GET_CHART_DATA, GET_USERS } from "../actions/types";

const initialState = {
    chartData: {},
    users: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CHART_DATA:
      return {
          ...state,
          chartData: action.payload
      }
      case GET_USERS:
      return {
          ...state,
          users: action.payload
      }
    default:
      return state;
  }
}
