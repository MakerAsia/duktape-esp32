kidbright.init();

var state = 0;
kidbright.loop( function() {
    if( kidbright.button(0).wasPressed() ) {
        state = !state;
    }
    if( state ) {
        kidbright.ledBT().on();
    }
    else {
        kidbright.ledBT().off();
    }
});
    
