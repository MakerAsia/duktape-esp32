var http = require("http.js");
var net = require("net.js");

// https://dweet.io/dweet/for/my-thing-name?hello=world

var address = "dweet.io"; // httpbin.org
var path = "/dweet/for/"+ESP32.getState().cpuid+"?light="

function http_test1(light) {
	
	log("Address: " + address);
	if (address === null) {
		return;
	}
	function logHTTP(obj) {
		log("HTTP Status Code: " + obj.httpStatus);
		log("Headers: " + JSON.stringify(obj.headers));
	}

	http.request({
		host : address,
		port : 80,
		path : path + light
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
		})
	});
}

setInterval(function() {
    var light = kidbright.ldr.read();
	console.log("Value: " + light);
    http_test1(light);
}, 15000);

//https://dweet.io/get/dweets/for/my-thing-name

