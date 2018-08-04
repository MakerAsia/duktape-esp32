kidbright.init();

setInterval(function() {
    if( kidbright.button1.isPressed(0) ) {
        kidbright.ledBT.on();
    }
    else {
        kidbright.ledBT.off();
    }
    kidbright.update();
}, 100);