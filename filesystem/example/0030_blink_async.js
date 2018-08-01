var GPIO = require("gpio.js");

var pin = new GPIO(2);
pin.setDirection(GPIO.OUTPUT);

var level = GPIO.HIGH;
setInterval(function() {
	pin.setLevel(level);
	level = !level;
}, 1000);
