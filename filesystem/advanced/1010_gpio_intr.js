
var buttonA = new GPIO(16);
buttonA.setDirection(GPIO.INPUT);
buttonA.setPullMode(GPIO.PULLUP_ONLY);

var level = GPIO.HIGH;

buttonA.setInterruptHandler(GPIO.INTR_NEGEDGE, function(pin) {
	log("The pin went high!: " + pin);
	level = !level;
    if( level == GPIO.HIGH ) {
        kidbright.ledBT.on();
    }
    else {
        kidbright.ledBT.off();
    }	
});