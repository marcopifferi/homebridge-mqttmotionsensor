# homebridge-mqttmotionsensor
An homebridge plugin that create an HomeKit Motion Sensor accessory mapped on MQTT topics

# Installation
Follow the instruction in [homebridge](https://www.npmjs.com/package/homebridge) for the homebridge server installation.
The plugin is published through [NPM](https://www.npmjs.com/package/homebridge-mqttmotionsensor) and should be installed "globally" by typing:

    npm install -g homebridge-mqttmotionsensor
    
# Release notes
Version 0.0.1
+ Initial public draft

# Configuration
Remember to configure the plugin in config.json in your home directory inside the .homebridge directory. Configuration parameters:
+ "accessory": "mqttswitch",
+ "name": "PUT THE NAME OF YOUR SWITCH HERE",
+ "url": "PUT URL OF THE BROKER HERE",
+ "username": "PUT USERNAME OF THE BROKER HERE",
+ "password": "PUT PASSWORD OF THE BROKER HERE",
+ "caption": "PUT THE LABEL OF YOUR SWITCH HERE",
+ "topics": {
 	"statusGet": 	"PUT THE MQTT TOPIC FOR THE GETTING THE STATUS OF YOUR SWITCH HERE",
 	"statusSet": 	"PUT THE MQTT TOPIC FOR THE SETTING THE STATUS OF YOUR SWITCH HERE"
	}
+ "onValue": "OPTIONALLY PUT THE VALUE THAT MEANS ON HERE (DEFAULT true)",
+ "offValue": "OPTIONALLY PUT THE VALUE THAT MEANS OFF HERE (DEFAULT false)",
+ "integerValue": "OPTIONALLY SET THIS TRUE TO USE 1/0 AS VALUES"

Look for a sample config in [config.json example](https://github.com/marcopifferi/homebridge-mqttswitch/blob/master/config.json)
# homebridge-mqttmotionsensor
# homebridge-mqttmotionsensor
