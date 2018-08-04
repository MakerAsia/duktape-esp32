/*
 * LEDC module.
 */

/* globals ESP32, log, module */


var moduleLEDC = ESP32.getNativeFunction("ModuleLEDC");
if (moduleLEDC === null) {
	log("Unable to find ModuleLEDC");
	module.exports = null;
	return;
}

var internalLEDC = {};
moduleLEDC(internalLEDC);

function ledc() {
	var ret = {
		//
		// configureChannel
		//
		configureChannel: function(options) {
			internalLEDC.configureChannel({
				channel: options.channel,
				duty: options.duty,
				gpio: options.gpio,			
				timer: options.timer
			});
		}, // configureChannel
		
		//
		// configureTimer
		//
		configureTimer: function(options) {
			internalLEDC.configureTimer({
				bitSize: options.bitSize,			
				freq: options.freq,
				timer: options.timer
			});
		}, // configureTimer
		
		//
		// setDuty
		//
		setDuty: function(channel, value) {
			internalLEDC.setDuty(channel, value);
			internalLEDC.updateDuty(channel);
		} // setDuty
	}; // End ret
	return ret;	
}; // ledc definition

module.exports = ledc;