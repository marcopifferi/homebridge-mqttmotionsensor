// MQTT Switch Accessory plugin for HomeBridge
//
// Remember to add accessory to config.json. Example:
// "accessories": [
//     {
//            "accessory": "mqttswitch",
//            "name": "PUT THE NAME OF YOUR SWITCH HERE",
//            "url": "PUT URL OF THE BROKER HERE",
//			  "username": "PUT USERNAME OF THE BROKER HERE",
//            "password": "PUT PASSWORD OF THE BROKER HERE"
// 			  "caption": "PUT THE LABEL OF YOUR SWITCH HERE",
// 			  "topics": {
// 				"statusGet": 	"PUT THE MQTT TOPIC FOR THE GETTING THE STATUS OF YOUR SWITCH HERE",
// 				"statusSet": 	"PUT THE MQTT TOPIC FOR THE SETTING THE STATUS OF YOUR SWITCH HERE"
// 			  },
//			  "onValue": "OPTIONALLY PUT THE VALUE THAT MEANS ON HERE (DEFAULT true)",
//			  "offValue": "OPTIONALLY PUT THE VALUE THAT MEANS OFF HERE (DEFAULT false)",
//			  "integerValue": "OPTIONALLY SET THIS TRUE TO USE 1/0 AS VALUES",
//     }
// ],
//
// When you attempt to add a device, it will ask for a "PIN code".
// The default code for all HomeBridge accessories is 031-45-154.

'use strict';

var Service, Characteristic;
var mqtt = require("mqtt");


function MqttMotionSensorAccessory(log, config) {
  	this.log          	= log;
  	this.name 			= config["name"];
  	this.url 			= config["url"];
    this.publish_options = {
      qos: ((config["qos"] !== undefined)? config["qos"]: 0)
    };
	this.client_Id 		= 'mqttjs_' + Math.random().toString(16).substr(2, 8);
	this.options = {
	    keepalive: 10,
    	clientId: this.client_Id,
	    protocolId: 'MQTT',
    	protocolVersion: 4,
    	clean: true,
    	reconnectPeriod: 1000,
    	connectTimeout: 30 * 1000,
		will: {
			topic: 'WillMsg',
			payload: 'Connection Closed abnormally..!',
			qos: 0,
			retain: false
		},
	    username: config["username"],
	    password: config["password"],
    	rejectUnauthorized: false
	};
	this.caption		= config["caption"];
	this.topicStatusGet	= config["topics"].statusGet;
    this.onValue = (config["onValue"] !== undefined) ? config["onValue"]: "true";
    this.offValue = (config["offValue"] !== undefined) ? config["offValue"]: "false";
	if (config["integerValue"]) {
		this.onValue = "1";
		this.offValue = "0";
	}
    
	this.motionDetected = false;

	this.service = new Service.MotionSensor(this.name);
  	this.service
    	.getCharacteristic(Characteristic.MotionDetected)
        .on('get', this.getStatus.bind(this));

	// connect to MQTT broker
	this.client = mqtt.connect(this.url, this.options);
	var that = this;
	this.client.on('error', function () {
		that.log('Error event on MQTT');
	});
    
	var that = this;
	this.client.on('message', function (topic, message) {
		if (topic == that.topicStatusGet) {
			var status = message.toString();
			that.motionDetected = (status == that.onValue) ? true : false;
		   	that.service.getCharacteristic(Characteristic.MotionDetected).setValue(that.motionDetected, undefined, 'fromSetValue');
		}
	});
    this.client.subscribe(this.topicStatusGet);
}

module.exports = function(homebridge) {
  	Service = homebridge.hap.Service;
  	Characteristic = homebridge.hap.Characteristic;

  	homebridge.registerAccessory("homebridge-mqttmotionsensor", "mqttmotionsensor", MqttMotionSensorAccessory);
}

MqttMotionSensorAccessory.prototype.getStatus = function(callback) {
    this.log('MqttMotionSensorAccessory: getStatus');
    callback(null, this.motionDetected);
}

MqttMotionSensorAccessory.prototype.getServices = function() {
  return [this.service];
}
