import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import PropTypes from "prop-types";
// core components
import Header from "components/Header/Header.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import image from "assets/img/bg7.jpg";
import TextField from '@material-ui/core/TextField';
import MySnackbarContentWrapper from "../../components/Snackbar/MySnackbarContentWrapper";
import Snackbar from '@material-ui/core/Snackbar';

import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      email: "",
      password: "",
      errors: {},
      open: false,
      showPassword: false
    };
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  };

  componentDidMount() {
    // we add a hidden class to the card and after 700 ms we delete it and the transition appears
    setTimeout(
      function () {
        this.setState({ cardAnimaton: "" });
      }.bind(this),
      700
    );

    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
      if (nextProps.errors.isApproved) {
        this.setState({ open: true });
      }
    }
  }
  onChange = e => {
    this.setState({ errors: {} });
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    this.props.loginUser(userData);
  };
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };

  render() {
    const { classes, ...rest } = this.props;
    const { errors } = this.state;
    var emailError = errors.email || errors.emailnotfound ? true : false;
    var passwordError = errors.passwordincorrect || errors.password ? true : false;
    return (
      <div>
        <Header
          absolute
          color="transparent"
          brand="Get data"
          rightLinks={<HeaderLinks />}
          {...rest}
        />
        <div
          className={classes.pageHeader}
          style={{
            backgroundImage: "url(" + image + ")",
            backgroundSize: "cover",
            backgroundPosition: "top center"
          }}
        >
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
          >
            <MySnackbarContentWrapper
              onClose={this.handleClose}
              variant="error"
              message={errors.isApproved}
            />
          </Snackbar>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Login</h4>
                    </CardHeader>
                    <CardBody>
                      <TextField
                        id="email"
                        label="Email..."
                        className={classes.textField}
                        type="email"
                        error={emailError}
                        autoComplete="email"
                        margin="normal"
                        helperText={errors.emailnotfound || errors.email}
                        value={this.state.email}
                        onChange={this.onChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        id="password"
                        label="Password"
                        className={classes.textField}
                        type={this.state.showPassword ? 'text' : 'password'}
                        error={passwordError}
                        autoComplete="current-password"
                        margin="normal"
                        helperText={errors.passwordincorrect || errors.password}
                        value={this.state.password}
                        onChange={this.onChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="Toggle password visibility"
                                onClick={this.handleClickShowPassword}
                              >
                                {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button simple color="primary" size="lg" type="submit">
                        Login
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </GridItem>
            </GridContainer>
          </div>
          <Footer whiteFont />
        </div>
      </div>
    );
  }
}
LoginPage.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(withStyles(loginPageStyle)(LoginPage));

