console.log("Dweet");

setInterval(function() {
    var light = kidbright.ldr.read();
    console.log("Value: " + light);
    kidbright.matrix.clear();
    kidbright.matrix.setCursor(0,0);
    kidbright.matrix.print( ""+light );
    kidbright.matrix.writeDisplay();
    kidbright.dweet.send(ESP32.getState().cpuid,"light",light);
}, 5000);

//https://dweet.io/get/dweets/for/my-thing-name

