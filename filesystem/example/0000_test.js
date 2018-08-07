console.log("MAC: " + ESP32.getState().MAC);
console.log("ID: " + ESP32.getState().cpuid);

console.log("Sockets: " + JSON.stringify(_sockets));
var counter = 0;
for (var i in _sockets) {
	if (_sockets.hasOwnProperty(i)) {
		if (_sockets[i].listening) {
			console.log(" - socket: " + _sockets[i]._sockfd + ", listening, port: " + _sockets[i].localPort + ", creationTime: " + _sockets[i]._createTime);
		} else {
			console.log(" - socket: " + _sockets[i]._sockfd + ", creationTime: " + _sockets[i]._createTime);
		}

		counter++;
	}
}
console.log("Number of sockets being used: " + counter);
console.log("Timers: " + JSON.stringify(_timers));	
console.log("Heap: " + ESP32.getState().heapSize);
console.log("Flash: " + ESP32.getState().flashSize);
console.log("IP address: " + WIFI.getState().staIp );
	
	