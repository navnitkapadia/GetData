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
var client = mqtt.connect('mqtt://iot.eclipse.org');

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
  }
  )
  return socket;
});

client.on('connect', function () {
  client.subscribe('mydevice');
  console.log('client has subscribed successfully');
});

client.on('message', function (topic, message) {
  socket.emit('chart', message.toString());
});

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
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
app.use(express.static('client/build'));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
})
const port = process.env.PORT || 5000;

io.listen(port, () => console.log(`Server up and running on port ${port} !`));