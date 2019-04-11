import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, publishMessage } from "../../actions/authActions";
import { withStyles } from '@material-ui/core/styles';
import ExitToApp from '@material-ui/icons/ExitToApp';
import '@vaadin/vaadin-date-picker/theme/material/vaadin-date-picker.js';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
import Nfc from "@material-ui/icons/Nfc";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TextField from '@material-ui/core/TextField';
import InputAdornment from "@material-ui/core/InputAdornment";
import SaveIcon from '@material-ui/icons/Save';
import Button from '@material-ui/core/Button';

import MySnackbarContentWrapper from "../../components/Snackbar/MySnackbarContentWrapper";
import Snackbar from '@material-ui/core/Snackbar';
const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex'
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    gridContainer: {
        marginTop: '48px'
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
    form: {
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        marginTop: "16px",
        marginLeft: "24px"
    },
    vaadin: {
        marginTop: "10px"
    }
});
class PublishData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
            topic: '',
            message: '',
            open: false,
        };
        this.dataPublish = this.dataPublish.bind(this);
    }
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    addTopic = e => {
        e.preventDefault();
        this.props.history.push("/topics");
    }
    gotoPublish = e => {
        e.preventDefault();
        this.props.history.push("/publish-data");
    }

    //can be used to reconnect on connection lost
    onConnectionLost(responseObject) {
        console.log("connection lost: " + responseObject.errorMessage);
    };
    componentDidMount() {
        this.vaadinListener();
        window.addEventListener("data-published", this.dataPublish);
    }
    componentWillMount(){
        window.removeEventListener("data-published", this.dataPublish);
    }
    dataPublish(){
        this.setState({ open: true });
    }
    vaadinListener() {
        var self = this;
        var topicBox = this.refs.topic;
        if(topicBox){
          topicBox.items = this.props.auth.user.topic;
        }
        topicBox.addEventListener('value-changed', ()=>{
          self.setState({ topic: topicBox.value })
        })
    }
    onWebAppDashboard = e => {
        e.preventDefault();
        this.props.history.push("/dashboard");
    }
    onWebAppClientClick = e => {
        e.preventDefault();
        this.props.history.push("/admin/dashboard");
    };

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({ open: false });
    };

    onRemoveItem = idx => {
        this.props.removeTopicItem(idx, this.props.auth.user.id);
    }
    onSubmit = e => {
        e.preventDefault();
        if (this.state.topic && this.state.message) {
            this.props.publishMessage(this.state.topic, this.state.message, this.props.auth.user.id);
            this.setState({message: ''});
            this.setState({topic: ''});
           var topicBox = this.refs.topic;
           topicBox.value = "";
        }
    };
    render() {
        const { classes, theme } = this.props;
        // var topic = (this.props && this.props.auth && this.props.auth.user && this.props.auth.user.topic) || [];
        const drawer = (
            <div>
                <List>
                    <ListItem button onClick={this.onLogoutClick}>
                        <ListItemIcon >
                            <ExitToApp />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                    {
                        this.props.auth.user.role === 1 ? <ListItem button onClick={this.onWebAppClientClick}>
                            <ListItemIcon >
                                <KeyboardReturn />
                            </ListItemIcon>
                            <ListItemText primary="Admin" />
                        </ListItem> : null
                    }
                    <ListItem button onClick={this.onWebAppDashboard}>
                        <ListItemIcon >
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button onClick={this.addTopic}>
                        <ListItemIcon >
                            <Nfc />
                        </ListItemIcon>
                        <ListItemText primary="Add topic" />
                    </ListItem>
                    <ListItem button onClick={this.gotoPublish}>
                        <ListItemIcon >
                            <Nfc />
                        </ListItemIcon>
                        <ListItemText primary="Publish Message" />
                    </ListItem>
                </List>
            </div>
        );
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerToggle}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap>
                            Get Data
          </Typography>
                    </Toolbar>
                </AppBar>
                <div className={classes.drawer}>
                    {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                    <Hidden smUp implementation="css">
                        <Drawer
                            container={this.props.container}
                            variant="temporary"
                            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}>
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden xsDown implementation="css">
                        <Drawer
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            variant="permanent"
                            open>
                            {drawer}
                        </Drawer>
                    </Hidden>
                </div>
                <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.open}
            autoHideDuration={2000}
            onClose={this.handleClose}
          >
            <MySnackbarContentWrapper
              onClose={this.handleClose}
              variant="success"
              message="Your message is published"
            />
          </Snackbar>
                <main className={classes.content}>
                    <Grid justify="center"
                        alignItems="center" className={classes.gridContainer} container spacing={24}>
                        <Grid item xs={12} sm={12} >
                            <Paper className={classes.paper}>
                                <form className={classes.form} noValidate onSubmit={this.onSubmit.bind(this)}>
                                    <vaadin-combo-box ref="topic" className={classes.vaadin} label="Select topic"></vaadin-combo-box>
                                    <TextField
                                        id="message"
                                        label="Message"
                                        className={classes.textField}
                                        type="text"
                                        autoComplete="publish"
                                        margin="normal"
                                        value={this.state.message}
                                        onChange={this.onChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <Nfc className={classes.inputIconsColor} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    <Button variant="contained" size="small" type="submit" className={classes.button}>
                                        <SaveIcon />
                                        Publish
                                    </Button>
                                </form>
                            </Paper>
                        </Grid>
                    </Grid>
                </main>
            </div>
        );
    }
}

PublishData.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    publishMessage: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser, publishMessage }
)(withStyles(styles, { withTheme: true })(PublishData));
