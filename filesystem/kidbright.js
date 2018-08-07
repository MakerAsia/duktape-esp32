
function kidbright() {
    var __loop = undefined;
    var __ledBT = undefined;
    var ret = {
        loop: function( loopCallback ) {
            __loop = loopCallback;
        },
        delay: function( time ) {
            DUKF.sleep(time);
        },
        update: function() {
            if( __loop != undefined ) {
                __loop();
            }
        },
        init: function() {
            __loop = undefined;
            DUKF.gc();
            log( ESP32.getState().heapSize );
            var _that = this;
        },
        ledBT: function() {
            if( __ledBT == undefined ) {
                var LED = require("led.js");
                __ledBT = new LED(17);
            }
            return __ledBT;
        }
    }
    return ret;
}

module.exports = kidbright;    