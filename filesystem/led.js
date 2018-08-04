function led(pinNumber) {
    var GPIO = require("gpio.js");
    var _gpio = new GPIO(pinNumber);
    _gpio.setDirection(GPIO.OUTPUT); 
    _gpio.setLevel(GPIO.HIGH);
    var _timerid = new Number();
    _timerid = -1;
    
    var ret = {
        gpio: _gpio,
        pin: pinNumber,
        timerid: _timerid,
            //
		// getLevel
		// Get the current signal level of the GPIO.
		//
		on: function() {
			_gpio.setLevel(GPIO.LOW);
            if( _timerid != -1 )
                cancelInterval(_timerid);
		}, // getLevel

        off: function() {
            _gpio.setLevel(GPIO.HIGH);
            if( _timerid != -1 )
                cancelInterval(_timerid);
        }, // getLevel
        
        blink: function( time_on, time_off ) {
            var that = this;
            _timerid = setInterval(function() {
                _gpio.setLevel(GPIO.LOW);
                var t = setTimeout(function(){ 
                    _gpio.setLevel(GPIO.HIGH); 
                }, time_on);
            }, time_on+time_off);
        }
    }
    return ret;
}

module.exports = led;