var PWM = require("pwm");

kidbright.init();

var level = 0;
var inc = 2;

var pwm = new PWM(0,kidbright.ledIOT().pin);
kidbright.loop( function() {
    level += inc;
    if( level > 98 )
        inc = -2;
    if( level < 2 )
        inc = 2;

	pwm.setDuty( level ); 
});

