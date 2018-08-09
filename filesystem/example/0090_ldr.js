kidbright.init();

setInterval( function() {
	console.log("Value: " + kidbright.ldr().read());
}, 5000);
