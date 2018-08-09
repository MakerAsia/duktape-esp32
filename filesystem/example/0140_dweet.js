//https://dweet.io/get/dweets/for/<ID>
kidbright.init();

console.log("Dweet: https://dweet.io/get/dweets/for/"+ESP32.getState().cpuid);

setInterval(function() {
    var light = kidbright.ldr().read();
    var temp = kidbright.temperature().read();
    var mem = ESP32.getState().heapSize;
    console.log("Value: " + light + ", " + temp + ", " + mem );
    kidbright.matrix().clear();
    kidbright.matrix().setCursor(0,0);
    kidbright.matrix().print( ""+light );
    kidbright.dweet().send(ESP32.getState().cpuid, {
        "light": light,
        "temperature": temp,
        "memory": mem
    });
    DUKF.gc();
}, 15000);