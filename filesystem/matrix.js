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

var __prnScrlID = -1;

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
			internalMatrix.writeDisplay();
		},
		
		setCursor: function(x, y) {
		    internalMatrix.setCursor(x, y);
		},

		stopScroll: function() {
			if( __prnScrlID != -1 ) {
				cancelInterval( __prnScrlID );
				internalMatrix.clear();
				internalMatrix.writeDisplay();
			}
		},
		
		printScroll: function(text) {
			var x = 16;
			__prnScrlID = setInterval(function() {
				internalMatrix.clear();
				internalMatrix.setCursor( x, 0 );
				internalMatrix.print( text );
				internalMatrix.writeDisplay();
				
				x--;
				if( x < (0-(text.length * 8)) )
					x = 16;    
			}, 80);
		},

		scroll: function(text) {
			this.printScroll( text );
		}
		
	}; // End ret
	return ret;
} // matrix

module.exports = matrix;