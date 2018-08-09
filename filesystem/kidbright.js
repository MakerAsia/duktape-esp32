
function kidbright() {
    const __ledPin = [17,2,15,12];
    const __btnPin = [16,14];

    var __loop = undefined;
    var __led = [undefined, undefined, undefined, undefined];
    var __btn = [undefined, undefined];
    var __ldr = undefined;
    var __lm73 = undefined;
    var __matrix = undefined;
    var __dweet = undefined;
    var ret = {
        loop: function( loopCallback ) {
            __loop = loopCallback;
        },
        delay: function( time ) {
            DUKF.sleep(time);
        },
        update: function() {
            for( var i=0; i<2; i++ ) {
                if( __btn[i] ) {
                    __btn[i].read();
                }
            }
            if( __loop != undefined ) {
                __loop();
            }
        },
        init: function() {
            __loop = undefined;
            for( var i=0; i<4; i++ ) {
                this.led(i).off();
            }
            this.matrix().stopScroll();
            this.matrix().clear();
            DUKF.gc();
            log( ESP32.getState().heapSize );
        },
        led: function( idx ) {
            var LED = require("led.js");
            if( __led[idx] == undefined ) {
                __led[idx] = new LED(__ledPin[idx]);
            }
            return __led[idx]
        },
        ledBT: function() {
            return this.led(0);
        },
        ledWIFI: function() {
            return this.led(1);
        },
        ledNTP: function() {
            return this.led(2);
        },
        ledIOT: function() {
            return this.led(3);
        },
        button: function( idx ) {
            var BUTTON = require("button.js");
            if( __btn[idx] == undefined ) {
                __btn[idx] = new BUTTON(__btnPin[idx]);
            }
            return __btn[idx]            
        },
        ldr: function() {
            var LDR = require("ldr.js");
            if( __ldr == undefined ) {
                __ldr = new LDR();
            }
            return __ldr;
        },
        temperature: function() {
            var LM73 = require("lm73.js");
            if( __lm73 == undefined ) {
                __lm73 = new LM73();
            }
            return __lm73;
        },
        matrix: function() {
            var MATRIX = require("matrix.js");
            if( __matrix == undefined ) {
                __matrix = new MATRIX();
            }
            return __matrix;
        },
        dweet: function() {
            var DWEET = require("dweet.js");
            if( __dweet == undefined ) {
                __dweet = new DWEET();
            }
            return __dweet;
        },
        setAutoStart: function(path) {
            var NVS = require("nvs");

            var esp32duktapeNS = NVS.open("esp32duktape", "readwrite");
            esp32duktapeNS.set("start", path, "string");
            esp32duktapeNS.close();
        },
        getAutoStart: function(path) {
            var NVS = require("nvs");

            var esp32duktapeNS = NVS.open("esp32duktape", "readwrite");
            var startProgram = esp32duktapeNS.get("start", "string");
            esp32duktapeNS.close();

            return startProgram;
        },
        clearAutoStart: function(path) {
            var NVS = require("nvs");

            var esp32duktapeNS = NVS.open("esp32duktape", "readwrite");
            esp32duktapeNS.erase("start");
            esp32duktapeNS.close();
        }
    }
    return ret;
}

module.exports = kidbright;    