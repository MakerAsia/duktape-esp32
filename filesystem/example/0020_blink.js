var GPIO = require("gpio.js");

var pin = new GPIO(2);
pin.setDirection(GPIO.OUTPUT);

while( true ) {
    pin.setLevel(GPIO.HIGH);
    DUKF.sleep(1000);
    pin.setLevel(GPIO.LOW);
    DUKF.sleep(500);
}

