import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getChartData } from "../../actions/getActions";
import * as Chart from 'chart.js';
import { withStyles } from '@material-ui/core/styles';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import 'chartjs-plugin-zoom'
import Hoc from '../../hoc/Hoc';
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
import Button from '@material-ui/core/Button';
const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    button: {
        margin: theme.spacing.unit,
        marginTop: '32px',
        marginLeft: '24px'
      },
  });
class MasterChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSensor: '',
            startDate: '',
            endDate: '',
            mainChart: {},
            height: window.innerHeight, 
            width: window.innerWidth
        };
        this.updateDimensions = this.updateDimensions.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        var self = this;
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.chartData) {
            var data = this.state.mainChart.data.datasets[0].data;
            this.state.mainChart.data.datasets[0].data.splice(0, data.length);
            nextProps.chartData.forEach(function (item) {
                self.state.mainChart.data.datasets[0].data.push({
                    x: new Date(item.date).getTime(),
                    y: item.value
                })
            });
            this.state.mainChart.resetZoom()
            this.state.mainChart.update();
        }
    }
    onResetZoom(){
        this.state.mainChart.resetZoom()
    }
    updateDimensions() {
        this.setState({
          height: window.innerHeight, 
          width: window.innerWidth
        });
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }
    componentDidMount() {
        this.vaadinListener();
        window.addEventListener("resize", this.updateDimensions);
        var mainChart = new Chart(document.getElementById("lineChart5").getContext("2d"), {
            type: 'line',
            data: {
                datasets: [{
                    label: "Dataset with point data",
                    data: [],
                    borderColor: "rgba(9,50,28,0.4)",
                    backgroundColor: "rgba(199,92,201,0.5)",
                    pointBorderColor: "rgba(112,243,120,0.7)",
                    pointBackgroundColor: "rgba(177,189,56,0.5)",
                    pointBorderWidth: 1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: "Previous chart Time Scale"
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
        this.setState({ mainChart: mainChart })
    }


    callChartApi(sensorId, start, end) {
        if (!sensorId) {
            sensorId = this.state.activeSensor;
        }
        if (!start) {
            start = this.state.startDate;
        }
        if (!end) {
            end = this.state.endDate;
        }
        if (!sensorId || !start || !end) {
            return;
        }
        this.props.getChartData(sensorId, start, end);
    }
    vaadinListener() {
        var self = this;
        var start = this.refs.startDate;
        var end = this.refs.endtDate;
        var comboBox = this.refs.combo;
        if (comboBox) {
            comboBox.items = ['Sensor 1', 'Sensor 2', 'Sensor 3', 'Sensor 4'];
        }
        comboBox.addEventListener('value-changed', function () {
            self.setState({ activeSensor: comboBox.value })
            self.callChartApi(comboBox.value, null, null)
        });
        start.addEventListener('change', function () {
            end.min = start.value;
            self.setState({ startDate: start.value })
            self.callChartApi(null, start.value, null)
            // Open the second date picker when the user has selected a value
            if (start.value) {
                end.open();
            }
        });

        end.addEventListener('change', function () {
            start.max = end.value;
            self.setState({ endDate: end.value });
            self.callChartApi(null, null, end.value)
        });
    }
    render() {
        const { classes } = this.props;
        var className = 'layout horizontal';
        if(this.state.width < 1200) {
            className = "layout vertical"
        } else {
            className = "layout horizontal"
        }
        return (<Hoc>
            <div className={className}>
            <div className="layout horizontal center-center">
                <vaadin-combo-box ref="combo" label="Select sensor"></vaadin-combo-box>
                <vaadin-date-picker id="start"  label="Start" ref="startDate"></vaadin-date-picker>
            </div>
            <div className="layout horizontal center-center">
                <vaadin-date-picker id="end" label="End" ref="endtDate"></vaadin-date-picker>
                <Button color="primary" className={classes.button} onClick={this.onResetZoom.bind(this)}>
                    Reset zoom
                </Button>
            </div>
            </div>
            <div className="row">
                <div className="col s12 m12 l12">
                    <div className="card">
                        <canvas id="lineChart5"></canvas>
                    </div>
                </div>
            </div>
        </Hoc>);
    }
}

MasterChart.propTypes = {
    getChartData: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
    chartData: state.get.chartData
});

export default connect(
    mapStateToProps,
    { getChartData }
)(withStyles(styles, { withTheme: true })(MasterChart));