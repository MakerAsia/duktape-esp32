kidbright.init();

const delay_time = 100;

kidbright.loop( function() {
    kidbright.ledBT().on();
    kidbright.delay(delay_time);
    kidbright.ledBT().off();
    kidbright.delay(delay_time);

    kidbright.ledWIFI().on();
    kidbright.delay(delay_time);
    kidbright.ledWIFI().off();
    kidbright.delay(delay_time);

    kidbright.ledNTP().on();
    kidbright.delay(delay_time);
    kidbright.ledNTP().off();
    kidbright.delay(delay_time);

    kidbright.ledIOT().on();
    kidbright.delay(delay_time);
    kidbright.ledIOT().off();
    kidbright.delay(delay_time);
});