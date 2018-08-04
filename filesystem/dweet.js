var http = require("http.js");
var net = require("net.js");

// https://dweet.io/dweet/for/my-thing-name?hello=world

function logHTTP(obj) {
    log("HTTP Status Code: " + obj.httpStatus);
    log("Headers: " + JSON.stringify(obj.headers));
}
function consoleLogHTTP(obj) {
    console.log("HTTP Status Code: " + obj.httpStatus);
}

function DWEET() {
    var ret = {
        send: function( dweet_id, name, value ) {
            DUKF.gc();
            var host = "dweet.io";
            var port = 80;
            var path = "/dweet/for/"+dweet_id+"?"+name+"="+value;
            
            var sock = new net.Socket();
            sock.connect({
                address : host,
                port : port,
                path : path,
                useSSL: false
            }, function() {
                var requestMessage = "GET" +" " + path + " HTTP/1.1\r\n" +
                    "Host: " + host + ":" + port + "\r\n";
                sock.write(requestMessage); // Send the message to the HTTP server.	
                sock.write("\r\n");
            });
            sock.on("data", function(data) {
                log("**************")
                log("Response data:");
                log(data);
                log("**************")
            });
            
            sock.on("end", function() {
                log("**********************")
                log("*** Response complete");
                log("**********************")
            });	
        }
    }
    return ret;
}

module.exports = DWEET;
