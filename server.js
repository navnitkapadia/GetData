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
const eventEmitter = require('./plugins/EventEmitter/eventEmitter');
const mqtt = require('mqtt');
const config = require("./config/config");
var client = mqtt.connect(config.MqttBroker);
const Chart = require("./models/Chart");
const User = require("./models/User");
var nodemailer = require('nodemailer');
const { filter } = require('lodash');
let usersTopic = [];

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: config.email,
         pass: config.Password
     }
 });

sendMail = (to,value)=>{
  const mailOptions = { 
    from: config.fromEmail, // sender address
    to: to, // list of receivers
    subject: config.subject, // Subject line
    text: config.Message + value // plain text body
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
  });
}

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

client.on('connect', function () {
  User.find({isApproved: true}).then(user => {
    for (i = 0; i < user.length; i++) { 
        for(j=0; j < user[i].topic.length; j++){
          usersTopic.push({
            userEmail: user[i].email,
            topic: user[i].topic[j]
          });
          client.subscribe(user[i].topic[j]);
          console.log("topics:", user[i].topic[j]);
        }
    }
  });
  console.log('client has subscribed successfully');
});
eventEmitter.on('update-subscription', (id) => {
  User.findById(id, (err, user) => {
    if (err) {
      console.log(err);
    } 
    var topic = user.topic || [];
    for(i=0; i < topic.length; i++){
      client.subscribe(topic[i]);
      console.log(topic[i]);
    }
  });
});
eventEmitter.on('remove-subscription', (id) => {
  User.findById(id, (err, user) => {
    if (err) {
      console.log(err);
    } 
    var topic = user.topic || [];
    for(i=0; i < topic.length; i++){
      client.unsubscribe(topic[i]);
      console.log(topic[i]);
    }
  });
});
eventEmitter.on('publish-message', (topic, message) => {
  client.publish(topic, message);
});
client.on('disconnecting', function(e){
  client = mqtt.connect(config.MqttBroker);
})
client.on('disconnected', function(e){
  client = mqtt.connect(config.MqttBroker);
})
client.on('message', function (topic, message) {
  var messageString = message.toString();
  console.log(messageString);
  function IsValidJSONString(str) {
      try {
          JSON.parse(str);
      } catch (e) {
          return false;
      }
      return true;
  }
  if(IsValidJSONString(messageString)){
    let data = JSON.parse(messageString);
    if(data && typeof data === "object"){
      const newChart = new Chart({
        sensorId: data.id,
        topic: topic,
        value: data.value,
        lat: data.lat,
        lng: data.lng,
        unit: data.unit,
        description: data.description
      });
      newChart.save().then()
        .catch(err => console.log("Error:", err));
      socket.emit('chart', {message: data, topic: topic});
      if(data.value > config.exhaustedValue){
        let userDetail =  filter(usersTopic, {topic:  topic});
        userDetail.forEach(function(item){ 
          sendMail(item.userEmail, data.value);
        })
      }
    }
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
if(process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client/build','index.html'));
  })
}
const port = process.env.PORT || 5000;

http.listen(port, function () {
  console.log(`Server up and running on port ${port} !`);
});
