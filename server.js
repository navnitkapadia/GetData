const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const path = require("path");
const users = require("./routes/api/users");
const charts = require("./routes/api/charts");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const eventEmitter = require("./plugins/EventEmitter/eventEmitter");
const mqtt = require("mqtt");
const config = require("./config/config");
var client = mqtt.connect(config.MqttBroker);
const Chart = require("./models/Chart");
const User = require("./models/User");
var nodemailer = require("nodemailer");
const { find } = require("lodash");
let userDetails = {};

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.Email,
    pass: config.Password
  }
});

sendMail = (to, value, mobile) => {
  const mailOptions = {
    from: config.fromEmail, // sender address
    to: to, // list of receivers
    subject: config.subject, // Subject line
    text: config.Message + value // plain text body
  };
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) console.log(err);
    else console.log("sent");
  });
if(mobile) {
  // Twilio Credentials
  const accountSid = config.accountSid;
  const authToken = config.authToken;
  // require the Twilio module and create a REST client
  const twilio = require('twilio')(accountSid, authToken);

  twilio.messages
  .create({
    to: '+91'+mobile,
    from: config.fromMobile,
    body: config.Message + value,
  })
  .then((message) => console.log(message.sid)).catch((error)=> console.log(error));
}
};

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

var socket = io.on("connection", socket => {
  console.log("User Connected");
  socket.on("disconnect", function() {
    console.log("User Disconnected");
  });
  return socket;
});
client.on("connect", function() {
  console.log("connected");
  User.find({ isApproved: true }).then(user => {
    for (i = 0; i < user.length; i++) {
      for (j = 0; j < user[i].topic.length; j++) {
        let topic = user[i].topic[j];
        let userEmail = user[i].email;
        let mobile = user[i].mobile;
        let sensorPoints;
        if (user[i].sensorPoints) {
          sensorPoints = user[i].sensorPoints[topic];
        }
        userDetails[topic] = {
          userEmail: userEmail,
          mobile: mobile,
          sensorPoints: sensorPoints
        };
        client.subscribe(topic);
        console.log("topic",topic);
      }
    }
    // console.log(userDetails);
  });
  console.log("client has subscribed successfully");
});

eventEmitter.on("update-subscription", id => {
  User.findById(id, (err, user) => {
    if (err) {
      console.log(err);
    }
    var topic = user.topic || [];
    for (i = 0; i < topic.length; i++) {
      client.subscribe(topic[i]);
      console.log(topic[i]);
    }
  });
});
eventEmitter.on("remove-subscription", id => {
  User.findById(id, (err, user) => {
    if (err) {
      console.log(err);
    }
    var topic = user.topic || [];
    for (i = 0; i < topic.length; i++) {
      client.unsubscribe(topic[i]);
      console.log(topic[i]);
    }
  });
});
eventEmitter.on("publish-message", (topic, message) => {
  client.publish(topic, message);
});

eventEmitter.on("update-sensor-points", (email, sensorPoints, topic) => {
  let personDetail = userDetails[topic];
  personDetail.sensorPoints = sensorPoints[topic];
});


eventEmitter.on("mobile-number-update", (email, mobile) => {
  let personDetail = find(userDetails, {userEmail: email})
  personDetail.mobile = mobile;
});

client.on("disconnecting", function(e) {
  client = mqtt.connect(config.MqttBroker);
});

client.on("disconnected", function(e) {
  client = mqtt.connect(config.MqttBroker);
});

client.on("message", function(topic, message) {
  var messageString = message.toString();
  function IsValidJSONString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  if (IsValidJSONString(messageString)) {
    let data = JSON.parse(messageString);
    if (data && typeof data === "object") {
      const newChart = new Chart({
        sensorId: data.id,
        topic: topic,
        value: data.value,
        lat: data.lat,
        lng: data.lng,
        unit: data.unit,
        description: data.description
      });
      newChart
        .save()
        .then()
        .catch(err => console.log("Error:", err));
      socket.emit("chart", { message: data, topic: topic });
      let userDetail = userDetails[topic];
      
      if(!userDetail.sensorPoints){
        return;
      }
      if (data.id === "Sensor 1") {
        if (userDetail.sensorPoints.sensor1 && userDetail.sensorPoints.sensor1 <= data.value) {
          sendMail(userDetail.userEmail, data.value, userDetail.mobile);
        }
      }
      if (data.id === "Sensor 2") {
        if (userDetail.sensorPoints.sensor2 && userDetail.sensorPoints.sensor2 <= data.value) {
          sendMail(userDetail.userEmail, data.value, userDetail.mobile);
        }
      }
      if (data.id === "Sensor 3") {
        if (userDetail.sensorPoints.sensor3 && userDetail.sensorPoints.sensor3 <= data.value) {
          sendMail(userDetail.userEmail, data.value, userDetail.mobile);
        }
      }
      if (data.id === "Sensor 4") {
        if (userDetail.sensorPoints.sensor4 && userDetail.sensorPoints.sensor4 <= data.value) {
          sendMail(userDetail.userEmail, data.value, userDetail.mobile);
        }
      }
    }
  }
});

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
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
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
  });
}
const port = process.env.PORT || 5000;

http.listen(port, function() {
  console.log(`Server up and running on port ${port} !`);
});
