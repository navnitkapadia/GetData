import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getChartData } from "../../actions/getActions";
import * as Chart from 'chart.js';
import * as zoom from 'chartjs-plugin-zoom'
import { connectSocket } from './socketConnection';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/core/styles';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
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
      activeSensor: '',
      mainChart: {}
    };
  }
  // shouldComponentUpdate ( nextProps, nextState ) {
  //   console.log( '[UPDATE App.js] Inside shouldComponentUpdate', nextProps, nextState );
  // }
  componentWillReceiveProps(nextProps) {
    console.log(this.props.chartData);
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.chartData) {
      var config = {
        data: {
          datasets: [
            {
              label: "Dataset with point data",
              data: [],
              fill: false
            }
          ]
        },
      };
      var data=[];
      nextProps.chartData.forEach(function(item) {
        data.push({
            x: new Date(item.date).getTime(),
            y: item.value
          })
      });
      this.state.mainChart.data.datasets[0].data = data;
      this.state.mainChart.update();
      console.log(nextProps.chartData)
    }
  }
  componentDidMount() {
    this.dateListener();
    var mainChart = new Chart(document.getElementById("lineChart5").getContext("2d"), {
      type: 'line',
      data: {
        datasets: [{
          label: "Dataset with point data",
          data: []
        }]
      },
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Chart.js Time Scale"
        },
        scales: {
          xAxes: [
            {
              type: "time",
              time: {
                format: 'MM/DD/YYYY HH:mm',
                // round: 'day'
                tooltipFormat: "ll HH:mm"
              },
              scaleLabel: {
                display: true,
                labelString: "Date"
              },
              ticks: {
                maxRotation: 0
              }
            }
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: "value"
              }
            }
          ]
        },
        pan: {
          enabled: true,
          mode: "x",
          speed: 10,
          threshold: 10
        },
        zoom: {
          enabled: true,
          drag: false,
          mode: "xy",
          limits: {
            max: 10,
            min: 0.5
          }
        }
      }
    });
    this.setState({mainChart: mainChart})
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
    var data = JSON.parse(message);
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

  handleChange(e) {
    this.setState({ activeSensor: e.target.value })
    this.callChartApi();
  };
  dateListener() {
    var self = this;
    var start = this.refs.startDate;
    var end = this.refs.endtDate;
    start.addEventListener('change', function () {
      end.min = start.value;

      // Open the second date picker when the user has selected a value
      if (start.value) {
        end.open();
      }
    });

    end.addEventListener('change', function () {
      start.max = end.value;
      self.callChartApi();
    });
  }
  callChartApi() {
    var sensorId = this.state.activeSensor;
    var start = this.refs.startDate.value;
    var end = this.refs.endtDate.value;
    if (!sensorId) {
      return;
    }
    this.props.getChartData(sensorId, start, end)
  }
  static defaultProps = {
    displayTitle: true,
    displayLegend: false,
    legendPosition: 'right'
  }
  render() {
    const { classes } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col s12 m12 l6">
            <div className="card">
              <canvas id="lineChart1"></canvas>
            </div>
          </div>
          <div className="col s12 m12 l6">
            <div className="card">
              <canvas id="lineChart2"></canvas>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col s12 m12 l6">
            <div className="card">
              <canvas id="lineChart3"></canvas>
            </div>
          </div>
          <div className="col s12 m12 l6">
            <div className="card">
              <canvas id="lineChart4"></canvas>
            </div>
          </div>
        </div>
        <div className="row">
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">Select Chart</InputLabel>
            <Select
              value={this.state.activeSensor}
              onChange={(e) => this.handleChange(e)}>
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Sensor 1">Sensor 1</MenuItem>
              <MenuItem value='Sensor 2'>Sensor 2</MenuItem>
              <MenuItem value='Sensor 3'>Sensor 3</MenuItem>
              <MenuItem value='Sensor 4'>Sensor 4</MenuItem>
            </Select>
          </FormControl>
          <vaadin-date-picker id="start" label="Start" ref="startDate"></vaadin-date-picker>
          <vaadin-date-picker id="end" label="End" ref="endtDate"></vaadin-date-picker>
        </div>
        <div className="row">
          <div className="col s12 m12 l12">
            <div className="card">
              <canvas id="lineChart5"></canvas>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  getChartData: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  chartData: state.get.chartData
});

export default connect(
  mapStateToProps,
  { getChartData, logoutUser }
)(withStyles(styles, { withTheme: true })(Dashboard));
