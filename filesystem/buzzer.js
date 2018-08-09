function buzzer(channel,gpio) {
    var LEDC = require("ledc");
    var _pwm = new LEDC();
    _pwm.configureTimer({
        bitSize: 12,
        freq: 10000,
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
		tone: function( frequency ) {
            _pwm.setDuty( channel, frequency * 4096/1000 ); 
        }, // getLevel
		tone: function( frequency, duration ) {
            _pwm.setDuty( channel, frequency * 4096/1000 ); 
            DUKF.sleep( duration );
            _pwm.setDuty( channel, 0 ); 
        }, // getLevel
    }
    return ret;
}

module.exports = buzzer;        