var NVS  = require("nvs.js");

var bootWiFi_ns = NVS.open("bootwifi", "readwrite");
bootWiFi_ns.erase("ssid");
bootWiFi_ns.close();

setTimeout(function() {
    ESP32.reboot();
}, 2000);