//https://dweet.io/get/dweets/for/<ID>

console.log("Dweet: https://dweet.io/get/dweets/for/"+ESP32.getState().cpuid);

setInterval(function() {
    var light = kidbright.ldr.read();
    console.log("Value: " + light);
    kidbright.matrix.clear();
    kidbright.matrix.setCursor(0,0);
    kidbright.matrix.print( ""+light );
    kidbright.dweet.send(ESP32.getState().cpuid,"light",light);
}, 15000);


