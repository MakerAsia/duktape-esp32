kidbright.init();

var ledBT = kidbright.ledBT();

kidbright.loop( function() {
    ledBT.on();
    kidbright.delay(1000);
    ledBT.off();
    kidbright.delay(1000);
});