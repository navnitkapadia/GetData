const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require('path');
const users = require("./routes/api/users");
const charts = require("./routes/api/charts");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const mqtt = require('mqtt');
const config = require("./config/config");
var client = mqtt.connect(config.MqttBroker);
const Chart = require("./models/Chart");
const User = require("./models/User");
const eventEmitter = require('./EventEmitter/eventEmitter');
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

var socket = io.on('connection', (socket) => {
  console.log('User Connected')
  socket.on('disconnect', function () {
    console.log('User Disconnected');
  })
  return socket;
});

eventEmitter.on('update-subscription', (event) => {
  User.find({ isApproved: true }).then(user => {
    for (i = 0; i < user.length; i++) {
      client.subscribe(user[i].topic);
      console.log("Subscribe: New Topic");
    }
  });
});

eventEmitter.on('remove-subscription', (event) => {
  User.find({ isApproved: false }).then(user => {
    for (i = 0; i < user.length; i++) {
      client.subscribe(user[i].topic);
      console.log("Subscription removed");
    }
  });
});

client.on('connect', function () {
  User.find({ isApproved: true }).then(user => {
    for (i = 0; i < user.length; i++) {
      client.subscribe(user[i].topic);
      console.log(user[i].topic);
    }
  });
  console.log('client has subscribed successfully');
});

client.on('message', function (topic, message) {
  var message = JSON.parse(message);
  if (message && typeof message === "object") {
    const newChart = new Chart({
      sensorId: message.id,
      topic: topic,
      value: message.value,
      lat: message.lat,
      lng: message.lng,
      unit: message.unit,
      type: message.type,
      description: message.description
    });
    newChart.save().then(newChart => console.log('Successfully added'))
      .catch(err => console.log(err));
    socket.emit('chart', { message: message, topic: topic });
  }
});

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Routes
app.use("/api/users", users);
app.use("/api/charts", charts);

// Serve statics assets if in production
// app.use(express.static('client/build'));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'client/build','index.html'));
// })

const port = process.env.PORT || 5000;

http.listen(port, function () {
  console.log(`Server up and running on port ${port} !`);
});
