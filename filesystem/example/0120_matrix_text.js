kidbright.init();

setInterval(function() {
	var light = kidbright.ldr().read();
	kidbright.matrix().clear();
	kidbright.matrix().setCursor(0,0);
	kidbright.matrix().print(""+light);
}, 1000);