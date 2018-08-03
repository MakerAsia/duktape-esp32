function led(pinNumber) {
    var GPIO = require("gpio.js");
    var _gpio = new GPIO(pinNumber);
    _gpio.setDirection(GPIO.OUTPUT); 
    _gpio.setLevel(GPIO.HIGH);
    var ret = {
        gpio: _gpio,
            //
		// getLevel
		// Get the current signal level of the GPIO.
		//
		on: function() {
			_gpio.setLevel(GPIO.LOW);
		}, // getLevel

        off: function() {
			_gpio.setLevel(GPIO.HIGH);
        }, // getLevel
        
        blink: function( time_on, time_off ) {
            var that = this;
            setInterval(function() {
                that.on();
                DUKF.sleep(time_on);
                that.off();
                DUKF.sleep(time_off);
            }, 1000);
        }
    }
    return ret;
}

module.exports = led;