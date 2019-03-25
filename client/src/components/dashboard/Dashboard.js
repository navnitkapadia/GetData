import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import * as Chart from 'chart.js';
import { connectSocket } from './socketConnection';
import { withStyles } from '@material-ui/core/styles';
import MasterChart from './MasterChart';
import ExitToApp from '@material-ui/icons/ExitToApp';
import '@vaadin/vaadin-date-picker/theme/material/vaadin-date-picker.js';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import DashboardIcon from '@material-ui/icons/Dashboard';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';
import Nfc from "@material-ui/icons/Nfc";

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
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart1: {},
      myChart2: {},
      myChart3: {},
      myChart4: {},
      mobileOpen: false,
    };
  }
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }));
  };
  componentDidMount() {
    var myChart1 = new Chart(document.getElementById("lineChart1").getContext("2d"), {
      type: 'line',
      data: {
        lables: [],
        datasets: [{
          data: [],
          label: "Sensor 1",
          borderColor: '#3e95cd',
          fill: false
        }]
      },
    });
    this.setState({ myChart1: myChart1 })
    var myChart2 = new Chart(document.getElementById("lineChart2").getContext("2d"), {
      type: 'line',
      data: {
        lables: [],
        datasets: [{
          data: [],
          label: "Sensor 2",
          borderColor: '#3e95cd',
          fill: false
        }]
      }
    });
    this.setState({ myChart2: myChart2 })
    var myChart3 = new Chart(document.getElementById("lineChart3").getContext("2d"), {
      type: 'line',
      data: {
        lables: [],
        datasets: [{
          data: [],
          label: "Sensor 3",
          borderColor: '#3e95cd',
          fill: false
        }]
      }
    });
    this.setState({ myChart3: myChart3 });
    var myChart4 = new Chart(document.getElementById("lineChart4").getContext("2d"), {
      type: 'bar',
      data: {
        lables: [],
        datasets: [{
          data: [],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255,99,132,0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
          ],
          label: "Sensor 4",
          borderColor: '#3e95cd',
          fill: false
        }]
      }
    });
    this.setState({ myChart4: myChart4 });

    connectSocket((message) => {
      this.onMessageArrived(message);
    })
  }
  //what is done when a message arrives from the broker
  onMessageArrived(message) {
    var data = message.message;
    if (!this.props.auth.user.topic.includes(message.topic)) {
      return;
    }
    var today = new Date();
    var t = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (data.id === "Sensor 1") {
      this.removeData(this.state.myChart1);
      this.addData(this.state.myChart1, t, data.value);
    }
    if (data.id === "Sensor 2") {
      this.removeData(this.state.myChart2);
      this.addData(this.state.myChart2, t, data.value);
    }
    if (data.id === "Sensor 3") {
      this.removeData(this.state.myChart3);
      this.addData(this.state.myChart3, t, data.value);
    }
    if (data.id === "Sensor 4") {
      this.removeData(this.state.myChart4);
      this.addData(this.state.myChart4, t, data.value);
    }
  };

  addData(chart, label, value) {
    if (Object.keys(chart).length === 0) {
      return;
    }
    chart && chart.data && chart.data.labels && chart.data.labels.push(label);
    chart && chart.data && chart.data.datasets && chart.data.datasets[0] && chart.data.datasets[0].data.push(value);
    chart && chart.update();
  }
  removeData(chart) {
    if (chart && chart.data && chart.data.labels && chart.data.labels.length > 10) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }
  }
  //can be used to reconnect on connection lost
  onConnectionLost(responseObject) {
    console.log("connection lost: " + responseObject.errorMessage);
  };
  onWebAppClientClick = e => {
    e.preventDefault();
    this.props.history.push("/admin/dashboard");
  };

  addTopic = e => {
    e.preventDefault();
    this.props.history.push("/topics");
  }
  onWebAppDashboard = e => {
    e.preventDefault();
    this.props.history.push("/dashboard");
  }
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
          <Grid className={classes.gridContainer} container spacing={24}>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>
                <canvas id="lineChart1"></canvas>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>
                <canvas id="lineChart2"></canvas>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>
                <canvas id="lineChart3"></canvas>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} >
              <Paper className={classes.paper}>
                <canvas id="lineChart4"></canvas>
              </Paper>
            </Grid>
            <Grid item xs sm md lg>
              <Paper className={classes.paper}>
                <MasterChart />
              </Paper>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(withStyles(styles, { withTheme: true })(Dashboard));
