function button(pinNumber,dbTime=5) {
    var GPIO = require("gpio.js");
    var _gpio = new GPIO(pinNumber);
    _gpio.setDirection(GPIO.INPUT); 
    _gpio.setPullMode(GPIO.PULLUP_ONLY);
    var t = new Date().getTime();
    
    var ret = {
        gpio: _gpio,
        pin: pinNumber,
        state: 1,
        _dbTime: dbTime,
        _time: t,
        _lastChange: t,
        _changed = 0,
            //
		// getLevel
		// Get the current signal level of the GPIO.
		//
		read: function() {
            var ms = new Date().getTime();
            var pinVal = _gpio.getLevel();
            if (ms - _lastChange < _dbTime) {
                _lastTime = _time;
                _time = ms;
                _changed = 0;
                return _state;
            }
		}, // getLevel

        isPressed: function() {
            var p = _gpio.getLevel();
            return( p == GPIO.LOW );
        }, // getLevel
        
    }
    return ret;
}

module.exports = button;