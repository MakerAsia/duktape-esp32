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

var moduleDisplay = ESP32.getNativeFunction("ModuleDisplay");
if (moduleDisplay === null) {
	log("Unable to find moduleDisplay");
	module.exports = null;
	return;
}

var internalDisplay = {};
moduleDisplay(internalDisplay);

function display() {
	internalDisplay.displayInit();
	var ret = {
		//
		// getLevel
		// Get the current signal level of the GPIO.
		//
		test: function() {
			console.log("Display test OK ###########################");
		}, // getLevel
		
		fillScreen: function( color ) {
			internalDisplay.fillScreen( color );
		},		
		
		setCursor: function(x, y) {
		    internalDisplay.setCursor(x, y);
		},		

		setTextColor: function(color) {
		    internalDisplay.setTextColor(color);
		},		

		setTextSize: function(size) {
		    internalDisplay.setTextSize(size);
		},		

		drawString: function(text, x, y, color) {
		    internalDisplay.drawString(text, x, y, color);
		},		

	}; // End ret
	return ret;
} // display

display.BLACK           = internalDisplay.BLACK;
display.NAVY            = internalDisplay.NAVY;
display.DARKGREEN       = internalDisplay.DARKGREEN;
display.DARKCYAN        = internalDisplay.DARKCYAN;
display.MAROON          = internalDisplay.MAROON;
display.PURPLE          = internalDisplay.PURPLE;
display.OLIVE           = internalDisplay.OLIVE;
display.LIGHTGREY       = internalDisplay.LIGHTGREY;
display.DARKGREY        = internalDisplay.DARKGREY;
display.BLUE            = internalDisplay.BLUE;
display.GREEN           = internalDisplay.GREEN;
display.CYAN            = internalDisplay.CYAN;
display.RED             = internalDisplay.RED;
display.MAGENTA         = internalDisplay.MAGENTA;
display.YELLOW          = internalDisplay.YELLOW;
display.WHITE           = internalDisplay.WHITE;
display.ORANGE          = internalDisplay.ORANGE;
display.GREENYELLOW     = internalDisplay.GREENYELLOW;
display.PINK            = internalDisplay.PINK;

module.exports = display;
