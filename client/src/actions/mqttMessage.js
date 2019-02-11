import * as Paho from "paho-mqtt";

var MQTTbroker = 'iot.eclipse.org';
var MQTTport = 80;
var MQTTsubTopic = 'mydevice';
var message;
//mqtt broker
var client = new Paho.Client(MQTTbroker, MQTTport,
    "myclientid_" + parseInt(Math.random() * 100, 10));
client.onMessageArrived = onMessageArrived;
client.onConnectionLost = onConnectionLost;
//mqtt connecton options including the mqtt broker subscriptions
var options = {
    timeout: 3,
    onSuccess: function () {
        console.log("mqtt connected");
        // Connection succeeded; subscribe to our topics
        client.subscribe(MQTTsubTopic, { qos: 1 });
    },
    onFailure: function (message) {
        console.log("Connection failed, ERROR: " + message.errorMessage);
        //window.setTimeout(location.reload(),20000); //wait 20seconds before trying to connect again.
    }
};

//what is done when a message arrives from the broker
function onMessageArrived(message) {
    message = message
};

function onConnectionLost(responseObject) {
    console.log("connection lost: " + responseObject.errorMessage);
    //window.setTimeout(location.reload(),20000); //wait 20seconds before trying to connect again.
};