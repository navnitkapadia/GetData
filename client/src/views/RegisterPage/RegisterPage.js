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
import { registerUser } from "../../actions/authActions";
import loginPageStyle from "assets/jss/material-kit-react/views/loginPage.jsx";
import image from "assets/img/bg7.jpg";
import TextField from '@material-ui/core/TextField';
import MySnackbarContentWrapper  from "../../components/Snackbar/MySnackbarContentWrapper";
import Snackbar from '@material-ui/core/Snackbar';
import People from "@material-ui/icons/People";
import Nfc from "@material-ui/icons/Nfc";
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);
    // we use this to make the card to appear after the page has been rendered
    this.state = {
      cardAnimaton: "cardHidden",
      name: "",
      topic: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
      showPassword: false,
      showPassword2: false
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

    const newUser = {
      name: this.state.name,
      topic: this.state.topic,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history);
  };
  handleClickShowPassword = () => {
    this.setState(state => ({ showPassword: !state.showPassword }));
  };
  handleClickShowPassword2 = () => {
    this.setState(state => ({ showPassword2: !state.showPassword2 }));
  };
  render() {
    const { classes, ...rest } = this.props;
    const { errors } = this.state;
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
            message= {errors.isApproved}
          />
        </Snackbar>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={4}>
                <Card className={classes[this.state.cardAnimaton]}>
                  <form className={classes.form} noValidate onSubmit={this.onSubmit}>
                    <CardHeader color="primary" className={classes.cardHeader}>
                      <h4>Register</h4>
                    </CardHeader>
                    <CardBody>
                    <TextField
                        id="name"
                        label="Name"
                        className={classes.textField}
                        type="text"
                        autoComplete="email"
                        margin="normal"
                        error={errors.name? true: false}
                        helperText={errors.name}
                        value={this.state.name}
                        onChange={this.onChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <People className={classes.inputIconsColor} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        id="topic"
                        label="Topic"
                        className={classes.textField}
                        type="text"
                        autoComplete="email"
                        margin="normal"
                        error={errors.topic? true: false}
                        helperText={errors.topic}
                        value={this.state.topic}
                        onChange={this.onChange}
                        InputProps={{
                          endAdornment: (
                            <Nfc position="end">
                              <People className={classes.inputIconsColor} />
                            </Nfc>
                          ),
                        }}
                      />
                      <TextField
                        id="email"
                        label="Email..."
                        className={classes.textField}
                        type="email"
                        autoComplete="email"
                        margin="normal"
                        error={errors.email? true: false}
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
                        error={errors.password? true: false}
                        autoComplete="current-password"
                        margin="normal"
                        helperText={errors.password}
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
                      <TextField
                        id="password2"
                        label="Confirm Password"
                        className={classes.textField}
                        type={this.state.showPassword2 ? 'text' : 'password'}
                        error={errors.password2? true: false}
                        autoComplete="confirm-password"
                        margin="normal"
                        helperText={errors.password2}
                        value={this.state.password2}
                        onChange={this.onChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                               <IconButton
                                aria-label="Toggle password visibility"
                                onClick={this.handleClickShowPassword2}
                              >
                                {this.state.showPassword2 ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </CardBody>
                    <CardFooter className={classes.cardFooter}>
                      <Button simple color="primary" size="lg" type="submit">
                        Register
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
RegisterPage.propTypes = {
    registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withStyles(loginPageStyle)(RegisterPage));

