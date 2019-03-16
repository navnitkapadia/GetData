/*eslint-disable*/
import React, { Component } from "react";
// react components for routing our app without refresh
import { Link } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
// @material-ui/icons
import { Home } from "@material-ui/icons";
import Hoc from '../../hoc/Hoc';
import Button from "components/CustomButtons/Button.jsx";
// core components
import headerLinksStyle from "assets/jss/material-kit-react/components/headerLinksStyle.jsx";

class HeaderLinks extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { classes } = this.props;
    var links;
  if (this.props.auth.isAuthenticated) {
    links =  <Hoc>
       <ListItem className={classes.listItem}>
        <Link
          to="/dashboard"
          color="transparent"
          className={classes.navLink}
        >
          Webapp
      </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
      <Button
          color="transparent"
          onClick={this.onLogoutClick}
          className={classes.navLink}
        >
        Logout
        </Button>
    </ListItem>
    </Hoc>
  } else {
   links= <Hoc>
      <ListItem className={classes.listItem}>
        <Link
          to="/register"
          color="transparent"
          className={classes.navLink}
        >
          Register
      </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Link
          to="/login"
          color="transparent"
          className={classes.navLink}
        >
          Login
      </Link>
      </ListItem>
    </Hoc>
  }
    return (
      <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Link
          to="/"
          color="transparent"
          className={classes.navLink}
        >
          <Home className={classes.icons} /> Home
        </Link>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Link
          to="/about-us"
          color="transparent"
          className={classes.navLink}
        >
          About us
      </Link>
      </ListItem>
      {links}
    </List>
    );
  }
}
HeaderLinks.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { logoutUser })(withStyles(headerLinksStyle)(HeaderLinks));