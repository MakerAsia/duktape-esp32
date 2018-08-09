kidbright.init();

kidbright.loop( function() {
    if( kidbright.button(0).isPressed() ) {
        kidbright.ledBT().on();
    }
    else {
        kidbright.ledBT().off();
    }
});

