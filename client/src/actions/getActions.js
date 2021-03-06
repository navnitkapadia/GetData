import axios from "axios";

import { GET_CHART_DATA, GET_USERS } from "./types"

// Register User
export const getChartData = (sensorId, start, end, topic) => dispatch => {
  axios.get('api/charts/all',{
      params: {
        sensorId: sensorId, start: start, end: end, topic: topic
      }
    })
    .then(json => dispatch({
      type: GET_CHART_DATA,
      payload: json.data
    }))
};

// Register User
export const getUsers = () => dispatch => {
  axios.post('../api/users/users')
    .then(json => dispatch({
      type: GET_USERS,
      payload: json.data
    }))
};
