var http = require("http.js");
var net = require("net.js");

// https://dweet.io/dweet/for/my-thing-name?hello=world

function DWEET() {
    var ret = {
        send: function( dweet_id, name, value ) {
            var address = "dweet.io"; // httpbin.org
            console.log("ID: " + ESP32.getState().cpuid );
            log("Address: " + address);
            if (address === null) {
                return;
            }
            function logHTTP(obj) {
                log("HTTP Status Code: " + obj.httpStatus);
                log("Headers: " + JSON.stringify(obj.headers));
            }
            function consoleLogHTTP(obj) {
                console.log("HTTP Status Code: " + obj.httpStatus);
            }
            var path = "/dweet/for/"+dweet_id+"?"+name+"="+value
        
            http.request({
                host : address,
                port : 80,
                path : path
            }, function(response) {
                log("HTTP Response ready ...");
                response.on("data", function(data) {
                    log("**************")
                    log("Response data:");
                    logHTTP(response);
                    log(data);
                    log("**************")
                });
                response.on("end", function() {
                    log("**********************")
                    log("*** Response complete");
                    logHTTP(response);
                    log("**********************")
                    consoleLogHTTP(response);
                })
            });
        }      
    }
    return ret;
}

module.exports = DWEET;
