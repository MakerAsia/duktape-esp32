console.log("Dweet");

setInterval(function() {
    var light = kidbright.ldr.read();
	console.log("Value: " + light);
	kidbright.matrix.print( light );
    kidbright.dweet.send(ESP32.getState().cpuid,"light",light);
}, 15000);

//https://dweet.io/get/dweets/for/my-thing-name

