var level = 1;

setInterval(function() {
	level = !level;
	kidbright.ledBT.gpio.setLevel(level);
	kidbright.ledWIFI.gpio.setLevel(level);
	kidbright.ledNTP.gpio.setLevel(level);
	kidbright.ledIOT.gpio.setLevel(level);
}, 1000);

