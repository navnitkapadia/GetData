import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getChartData } from "../../actions/getActions";
import { withStyles } from '@material-ui/core/styles';
import '@vaadin/vaadin-date-picker/theme/material/vaadin-date-picker.js';
import 'chartjs-plugin-zoom'
import Hoc from '../../hoc/Hoc';
import '@vaadin/vaadin-combo-box/theme/material/vaadin-combo-box.js';
// import Button from '@material-ui/core/Button';
import Chart from "react-apexcharts";
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
            width: window.innerWidth,
            chartOptionsArea: {
                chart: {
                  id: 'chartArea',
                  toolbar: {
                    autoSelected: 'pan',
                    show: false
                  }
                },
                colors: ['#546E7A'],
                stroke: {
                  width: 3
                },
                dataLabels: {
                  enabled: false
                },
                fill: {
                  opacity: 1,
                },
                markers: {
                  size: 0
                },
                xaxis: {
                  type: 'datetime'
                }
              },
              chartOptionsBrush: {
                chart: {
                  id: 'chartBrush',
                  brush: {
                    target: 'chartArea',
                    enabled: true
                  },
                  selection: {
                    enabled: true,
                    xaxis: {
                      tickAmount: 20,
                      min: null,
                      max: null
                    }
                  },
                },
                colors: ['#008FFB'],
                fill: {
                  type: 'gradient',
                  gradient: {
                    opacityFrom: 0.91,
                    opacityTo: 0.1,
                  }
                },
                xaxis: {
                  type: 'datetime',
                  tooltip: {
                    enabled: false
                  }
                },
                yaxis: {
                  tickAmount: 2
                }
            },
            series: [{
                data: []
              }], 
            }
      
        this.updateDimensions = this.updateDimensions.bind(this);
    }
  
    componentWillReceiveProps(nextProps) {
        if (nextProps.chartData) {
            var data=[];
            nextProps.chartData.forEach(function (item) {
                data.push({
                    x: new Date(item.date).getTime(),
                    y: item.value
                })
            });
            var min;
            var max;
            if(data && data[0] && data[0].x){
              min = data[0].x;
              max= data[data.length-1].x;
            }
            this.setState({
                chartOptionsBrush: {
                    ...this.state.chartOptionsBrush,
                    selection: {
                        ...this.state.chartOptionsBrush.selection,
                        xaxis: {
                            min: min,
                            max: max
                        }
                    }
                }
            })
            this.setState({
                series: [{
                    data: data
                }]
            });
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
        return (<Hoc>
            <div className="actions-tabs">
              <vaadin-combo-box ref="combo" label="Select sensor"></vaadin-combo-box>
              <vaadin-date-picker id="start"  label="Start" ref="startDate"></vaadin-date-picker>
              <vaadin-date-picker id="end" label="End" ref="endtDate"></vaadin-date-picker>
            </div>
            <div id="charts">
              <div id="chart1">
                <Chart options={this.state.chartOptionsArea} series={this.state.series} type="line" height="230" />
                </div>
                <div id="chart2">
                <Chart options={this.state.chartOptionsBrush} series={this.state.series} type="area" height="130" />
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
