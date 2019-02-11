import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
const styles = {
  root: {
    flexGrow: 1,
    marginBottom: 48
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Navbar extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { classes } = this.props;
    var buttonEl;
    if (this.props.auth && this.props.auth.isAuthenticated) {
      buttonEl = <Button color="inherit" onClick={this.onLogoutClick}>Logout</Button>
    } else {
      buttonEl = '';
    }
    return (
      <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Get Data
          </Typography>
          {buttonEl}
        </Toolbar>
      </AppBar>
    </div>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(mapStateToProps, { logoutUser })(withStyles(styles)(Navbar));