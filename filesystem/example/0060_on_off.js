kidbright.init();

var state = 0;
setInterval(function() {
    
    if( kidbright.button1.wasPressed() ) {
        state = !state;
    }
    if( state ) {
        kidbright.ledBT.on();
    }
    else {
        kidbright.ledBT.off();
    }
    kidbright.update();
}, 100);
