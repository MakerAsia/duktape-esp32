function button(pinNumber) {
    var GPIO = require("gpio.js");
    var _gpio = new GPIO(pinNumber);
    _gpio.setDirection(GPIO.INPUT); 
    _gpio.setPullMode(GPIO.PULLUP_ONLY);
    
    var ret = {
        gpio: _gpio,
        pin: pinNumber,
            //
		// getLevel
		// Get the current signal level of the GPIO.
		//
		read: function() {
			return _gpio.getLevel();
		}, // getLevel

        isPressed: function() {
            var p = _gpio.getLevel();
            return( p == GPIO.LOW );
        }, // getLevel
        
    }
    return ret;
}

module.exports = button;