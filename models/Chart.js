const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ChartSchema = new Schema({
  labels: {
    type: Array,
    required: true
  },
  datasets: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: Number,
    required: true
  },
  isApproved: {
    type: Boolean,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Chart = mongoose.model("charts", ChartSchema);