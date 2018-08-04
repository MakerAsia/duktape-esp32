console.log("Dweet");

setInterval(function() {
    log( ">>>>>>>>>>> " + ESP32.getState().heapSize );
    var light = kidbright.ldr.read();
    console.log("Value: " + light);
    kidbright.matrix.clear();
    kidbright.matrix.setCursor(0,0);
    kidbright.matrix.print( ""+light );
    kidbright.matrix.writeDisplay();
    kidbright.dweet.send(ESP32.getState().cpuid,"light",light);
    log( "<<<<<<<<<<<< " + ESP32.getState().heapSize );
}, 15000);

//https://dweet.io/get/dweets/for/<ID>

