
function kidbright() {
    const __ledPin = [17,2,15,12];
    const __btnPin = [16,14];

    var __loop = undefined;
    var __led = [undefined, undefined, undefined, undefined];
    var __btn = [undefined, undefined];
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
            log( "KIDBRIGHT INIT >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" );
            __loop = undefined;
            for( var i=0; i<4; i++ ) {
                this.led(i).off();
                log( "LED OFF " + i );
            }
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
        }
    }
    return ret;
}

module.exports = kidbright;    