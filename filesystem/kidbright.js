/*
 * Module: gpio
 * 
 * Exposed functions:
 * * getLevel
 * * setDirection
 * * setInterruptHandler
 * * setLevel
 * * setPullMode
 * 
 * Load with:
 * 
 * require("gpio.js")
 * 
 * Example snippet:
 * ----
 * var GPIO = require("gpio");
 * var pin1 = new GPIO(1);
 * pin1.setDirection(GPIO.OUTPUT);
 * pin1.setLevel(GPIO.HIGH);
 * ----
 */

var moduleKidbright = ESP32.getNativeFunction("ModuleKidbright");
if (moduleKidbright === null) {
	log("Unable to find ModuleKidbright");
	module.exports = null;
	return;
}

var internalKidbright = {};
moduleKidbright(internalKidbright);

function kidbright() {
	internalKidbright.kidbrightInit();
	var ret = {
		//
		// getLevel
		// Get the current signal level of the GPIO.
		//
		test: function() {
			console.log("Kidbright test OK ###########################");
		}, // getLevel
	}; // End ret
	return ret;
} // kidbright

module.exports = kidbright;