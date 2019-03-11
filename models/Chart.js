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
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  unit: {
    type: Boolean,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  topic: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Chart = mongoose.model("charts", ChartSchema);