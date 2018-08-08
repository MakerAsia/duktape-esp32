function button(pinNumber) {
    var GPIO = require("gpio.js");
    var _gpio = new GPIO(pinNumber);
    _gpio.setDirection(GPIO.INPUT); 
    _gpio.setPullMode(GPIO.PULLUP_ONLY);
    var t = new Date().getTime();
    var l = _gpio.getLevel();
    
    var ret = {
        gpio: _gpio,
        pin: pinNumber,
        state: l,
        _dbTime: 5,
        _time: t,
        _lastChange: t,
        _changed: 0,
        _lastState: l,
            //
		// getLevel
		// Get the current signal level of the GPIO.
		//
		read: function() {
            var ms = new Date().getTime();
            var pinVal = _gpio.getLevel();
            if (ms - this._lastChange < this._dbTime) {
                this._lastTime = this._time;
                this._time = ms;
                this._changed = 0;
                return this._state;
            }
            else {
                this._lastTime = this._time;
                this._lastState = this._state;
                this._state = pinVal;
                this._time = ms;
                if (this._state != this._lastState)   {
                    this._lastChange = ms;
                    this._changed = 1;
                }
                else {
                    this._changed = 0;
                }
                return this._state;
            }            
		}, // getLevel

        isPressed: function() {
            return( this._state == 0 ? 1 : 0 );
        }, // getLevel
        wasPressed: function() {
            return( !this._state && this._changed );
        }
    }
    return ret;
}

module.exports = button;