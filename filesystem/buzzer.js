function buzzer(channel,gpio) {
    var LEDC = require("ledc");
    var _ledc = new LEDC();
    var _channel = channel;
    _ledc.configureTimer({
        bitSize: 12,
        freq: 1000,
        timer: 3
    });
    _ledc.configureChannel({
        channel:_channel,
        duty: 0,	
        gpio: gpio,
        timer: 3
    });
    
    var ret = {
        ledc: _ledc,
        channel: _channel,
		tone: function( freq ) {
            _ledc.setFreqency( 3, freq ); 
        }, // getLevel
		volume: function( level ) {
            _ledc.setDuty( this.channel, level ); 
        }, // getLevel        
    }
    return ret;
}

module.exports = buzzer;        