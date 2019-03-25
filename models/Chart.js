const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ChartSchema = new Schema({
  sensorId: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  lat: {
    type: Number,
    required: false
  },
  lng: {
    type: Number,
    required: false
  },
  unit: {
    type: String,
    required: false
  },
  type: {
    type: String,
    required: false
  },
  topic: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Chart = mongoose.model("charts", ChartSchema);