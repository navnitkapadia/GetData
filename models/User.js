const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
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
  topic: {
    type: Array,
    required: false
  },
  date: {
    type: Date,
    default: Date.now
  },
  sensorPoints: {
    type: Object,
    required: false
  }
});

module.exports = User = mongoose.model("users", UserSchema);
