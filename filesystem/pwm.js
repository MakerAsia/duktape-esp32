function pwm(channel,gpio) {
    var LEDC = require("ledc");
    var _pwm = new LEDC();
    _pwm.configureTimer({
        bitSize: 12,
        freq: 1000,
        timer: 0
    });
    _pwm.configureChannel({
        channel:channel,
        duty: 0,	
        gpio: gpio,
        timer: 0
    });
    
    var ret = {
        pwm: _pwm,
		setDuty: function( level ) {
            _pwm.setDuty( channel, level * 4096/100 ); 
        }, // getLevel
    }
    return ret;
}

module.exports = pwm;        