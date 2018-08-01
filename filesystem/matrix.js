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

var moduleMatrix = ESP32.getNativeFunction("ModuleMatrix");
if (moduleMatrix === null) {
	log("Unable to find ModuleMatrix");
	module.exports = null;
	return;
}

var internalMatrix = {};
moduleMatrix(internalMatrix);

function matrix() {
	internalMatrix.matrixInit();
	var ret = {
		//
		// getLevel
		// Get the current signal level of the GPIO.
		//
		test: function() {
			console.log("Matrix test OK ###########################");
		}, // getLevel
	}; // End ret
	return ret;
} // matrix

module.exports = matrix;