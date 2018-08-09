var LEDC = require("ledc");
var _pwm = new LEDC();
var channel = 0;
var gpio = 13;
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

function tone( frequency ) {
    _pwm.setDuty( channel, frequency * 10000/1000 ); 
} // getLevel
function tone( frequency, duration ) {
    _pwm.setDuty( channel, frequency * 10000/1000 ); 
    DUKF.sleep( duration );
    _pwm.setDuty( channel, 0 ); 
} // getLevel

for( var i=0; i<30; i++ ) {
    tone( 294 );    
}
