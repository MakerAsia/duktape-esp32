var GPIO = require( "gpio.js" );

kidbright.init();

var level = GPIO.LOW;

var lasttime = 0;

kidbright.button(0).gpio.setInterruptHandler(GPIO.INTR_NEGEDGE, function(pin) {
	log("The pin went low!: " + pin);
	var ms = new Date().getTime()
	if( (ms - lasttime) < 50 )
	    return;
	lasttime = ms;
	level = !level;
    if( level == GPIO.HIGH ) {
        kidbright.ledBT().on();
    }
    else {
        kidbright.ledBT().off();
    }	
});


kidbright.matrix().printScroll("MakerLAB by MakerAsia");



