kidbright.init();

const delay_time = 100;

kidbright.loop( function() {
    for( var i=0; i<4; i++ ) {
        kidbright.led(i).on();
        kidbright.delay(delay_time);
        kidbright.led(i).off();
    }
    for( i=2; i>0; i-- ) {
        kidbright.led(i).on();
        kidbright.delay(delay_time);
        kidbright.led(i).off();
    }
});