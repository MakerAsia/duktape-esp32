kidbright.init();

var level = 1;

kidbright.loop( function() {
	level = !level;
	kidbright.ledBT().gpio.setLevel(level);
	kidbright.ledWIFI().gpio.setLevel(level);
	kidbright.ledNTP().gpio.setLevel(level);
	kidbright.ledIOT().gpio.setLevel(level);

	kidbright.delay( 500 );
});
