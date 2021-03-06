import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";
import "assets/scss/material-kit-react.scss?v=1.4.0";

import LandingPage from "./views/LandingPage/LandingPage.jsx";
import LoginPage from "views/LoginPage/LoginPage.jsx";
import RegisterPage from "views/RegisterPage/RegisterPage";
import AboutusPage from "views/AboutusPage/AboutusPage";
// import Login from "./components/auth/Login";
import PrivateRoute from "./components/private-route/PrivateRoute";
import PrivateRouteAdmin from "./components/private-route/PrivateRouteAdmin";
import Dashboard from "./components/dashboard/Dashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import AddTopic from "./components/AddTopic/AddTopic";
import PublishData from "./components/PublishData/PublishData";
import Axios from "axios";

const refreshUser = (id) =>{
  Axios
    .post("/api/users/refresh", {id: id })
    .then(res => {
        // Set token to localStorage
        const { token } = res.data;
        if(token){
          localStorage.setItem("jwtToken", token);
          // Set token to Auth header
          setAuthToken(token);
          // Decode token to get user data
          const decoded = jwt_decode(token);
          // Set current user
          store.dispatch(setCurrentUser(decoded));
        }
    })
    .catch(err => {
      console.log("Error", err);
    });
}
// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  refreshUser(decoded.id);
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());

    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/about-us" component={AboutusPage} />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute exact path="/topics" component={AddTopic} />
              <PrivateRoute exact path="/publish-data" component={PublishData} />
              <PrivateRouteAdmin exact path="/admin/dashboard" admin component={AdminDashboard} />
            </Switch>
          </div>
        </Router>
      </Provider>
    );
  }
}
export default App;
