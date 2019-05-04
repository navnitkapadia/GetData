import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING,
  SET_TOPIC,
  APPROVE_USER,
  DISAPPROVE_USER,
  UPDATE_SENSORS
} from "./types";

// Approve User
export const approveUser = id => dispatch => {
  return axios
    .post("../api/users/approve", { id: id })
    .then(res => {
      dispatch({
        type: APPROVE_USER
      });
      return true;
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Disapprove User
export const disapproveUser = id => dispatch => {
  return axios
    .post("../api/users/disapprove", { id: id })
    .then(res => {
      dispatch({
        type: DISAPPROVE_USER
      });
      return true;
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login?action=register-successful"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - get user token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage

      // Set token to localStorage
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Set logged in user
export const publishMessage = (topic, message, id) => dispatch => {
  axios
    .post("/api/users/publish-message", {
      topic: topic,
      message: message,
      id: id
    })
    .then(res => {
      dispatchEvent(new CustomEvent("data-published", { bubbles: true }));
    })
    .catch(err => {
      console.log("Error", err);
    });
};
// Set logged in user
export const setTopic = (topic, id) => dispatch => {
  axios
    .post("/api/users/topic", { topic: topic, id: id })
    .then(res => {
      dispatch({
        type: SET_TOPIC,
        payload: res.data.topic
      });
    })
    .catch(err => {
      console.log("Error", err);
    });
};

export const removeTopicItem = (topicId, id) => dispatch => {
  axios
    .post("/api/users/remove-topic", { topicId: topicId, id: id })
    .then(res => {
      dispatch({
        type: SET_TOPIC,
        payload: res.data.topic
      });
    })
    .catch(err => {
      console.log("Error", err);
    });
};

export const updateSensorPoints = (id, sensorPoints) => dispatch => {
  axios
    .post("/api/users/update-sensor-point", {
      sensorPoints: sensorPoints,
      id: id
    })
    .then(res => {
      dispatch({
        type: UPDATE_SENSORS,
        payload: res.data.sensorPoints
      });
    })
    .catch(err => {
      console.log("Error", err);
    });
};

// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
