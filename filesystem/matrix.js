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
var matrixScrollID = -1;
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
			console.log("Matrix test OK");
		}, // getLevel
		
		//
		// setInterruptHandler
		// Set the interrupt handler for this GPIO.
		// intrType - One of:
		//  - INTR_ANYEDGE		
		//  - INTR_DISABLE
		//  - INTR_NEGEDGE		
		//  - INTR_POSEDGE
		// 
		drawPixel: function(x, y, color) {
		    internalMatrix.drawPixel(x, y, color);
		},
		
		//
		// getLevel
		// Get the current signal level of the GPIO.
		//
		writeDisplay: function() {
			internalMatrix.writeDisplay();
		},
		
		clear: function() {
			internalMatrix.clear();
		},		
		
		print: function( text ) {
			internalMatrix.print( text );
		},
		
		setCursor: function(x, y) {
		    internalMatrix.setCursor(x, y);
		},

		stopScroll: function(mid) {
			if( mid != -1 )
			{
				cancelInterval(matrixScrollID);
				internalMatrix.clear();
				internalMatrix.writeDisplay();
				return;
			}
			if( matrixScrollID != -1 ) {
				cancelInterval(matrixScrollID);
			}
		},
		
		printScroll: function( text ) {
			if( matrixScrollID != -1 ) {
				cancelInterval(matrixScrollID);
			}
			var that = this;
			var x = 16;
			matrixScrollID = setInterval(function() {
				that.clear();
				that.setCursor( x, 0 );
				that.print( text );
				that.writeDisplay();
				
				x--;
				if( x < (0-(text.length * 8)+16) )
					x = 16;    
			}, 80);
		}
		
	}; // End ret
	return ret;
} // matrix

module.exports = matrix;