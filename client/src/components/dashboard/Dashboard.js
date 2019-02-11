import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { getChartData } from "../../actions/getActions";
import * as Chart from 'chart.js';
import * as Paho from 'paho-mqtt';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myChart1: {},
      myChart2: {},
      myChart3: {},
      myChart4: {}
    };
  }

  componentDidMount() {
    // this.props.getChartData();
    this.connectMqtt();
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
      }
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
    this.setState({ myChart1: myChart2 })
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
  }
  //what is done when a message arrives from the broker
  onMessageArrived(message) {
    var data = JSON.parse(message.payloadString);
    var today = new Date();
    var t = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    if (data.id === "Sensor 1") {
      this.removeData(this.state.myChart1);
      this.addData(this.state.myChart1,t,data);
    }
    if (data.id === "Sensor 2") {
      this.removeData(this.state.myChart2);
      this.addData(this.state.myChart2,t,data);
    }
    if (data.id === "Sensor 3") {
      this.removeData(this.state.myChart3);
      this.addData(this.state.myChart3,t,data);
    }
    if (data.id === "Sensor 4") {
      this.removeData(this.state.myChart4);
      this.addData(this.state.myChart4,t,data);
    }
  };

  addData(chart, label, value) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(value);
  }
  removeData(chart) {
    if (chart && chart.data && chart.data.labels.length > 10) {
      chart.data.labels.shift();
      chart.data.datasets[0].data.shift();
    }
  }
  //can be used to reconnect on connection lost
  onConnectionLost(responseObject) {
    console.log("connection lost: " + responseObject.errorMessage);
  };

  connectMqtt() {
    var MQTTbroker = 'iot.eclipse.org';
    var MQTTport = 80;
    var MQTTsubTopic = 'mydevice';
    //mqtt broker
    var client = new Paho.Client(MQTTbroker, MQTTport,
      "myclientid_" + parseInt(Math.random() * 100, 10));
    client.onMessageArrived = this.onMessageArrived.bind(this);
    client.onConnectionLost = this.onConnectionLost.bind(this);

    //mqtt connecton options including the mqtt broker subscriptions
    var options = {
      timeout: 3,
      onSuccess: function () {
        console.log("mqtt connected");
        // Connection succeeded; subscribe to our topics
        client.subscribe(MQTTsubTopic, { qos: 1 });
      },
      onFailure: function (message) {
        console.log("Connection failed, ERROR: " + message.errorMessage);
        //window.setTimeout(location.reload(),20000); //wait 20seconds before trying to connect again.
      }
    };
    client.connect(options);
  }
  static defaultProps = {
    displayTitle: true,
    displayLegend: false,
    legendPosition: 'right'
  }
  render() {
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
)(Dashboard);
