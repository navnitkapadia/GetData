import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import { withStyles } from '@material-ui/core/styles';
import ExitToApp from '@material-ui/icons/ExitToApp';
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
import PrivateRouteAdmin from "../components/private-route/PrivateRouteAdmin";
import PrivateRoute from "../components/private-route/PrivateRoute";
import Dashboard from "../components/dashboard/Dashboard";
import { BrowserRouter as Router } from "react-router-dom";
import AdminDashboard from "../components/admin/AdminDashboard";

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
});
class Webapp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false
        };
    }
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    handleDrawerToggle = () => {
        this.setState(state => ({ mobileOpen: !state.mobileOpen }));
    };

    onWebAppClientClick = e => {
        e.preventDefault();
        this.props.history.push("/admin/dashboard");
    };

    static defaultProps = {
        displayTitle: true,
        displayLegend: false,
        legendPosition: 'right'
    }
    render() {
        const { classes, theme } = this.props;

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
                <main className={classes.content}>
                    {/* {this.props.children} */}
                    {/* <Router> */}
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRouteAdmin exact path="/admin/dashboard" admin component={AdminDashboard} />
                {/* </Router> */}
                </main>
            </div>
        );
    }
}

Webapp.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(withStyles(styles, { withTheme: true })(Webapp));
