var GPIO = require("gpio.js");

var led = new GPIO(2);
led.setDirection(GPIO.OUTPUT);

var buttonA = new GPIO(16);
buttonA.setDirection(GPIO.INPUT);
buttonA.setPullMode(GPIO.PULLUP_ONLY);

while( true ) {
    var level = buttonA.getLevel();
    if( level == GPIO.HIGH ) {
        led.setLevel(GPIO.LOW);
    }
    else {
        led.setLevel(GPIO.HIGH);
    }
    DUKF.sleep(50);
}