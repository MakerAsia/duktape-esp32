var LM73 = require("lm73.js");

var lm73 = new LM73();

var temperature = lm73.read();
console.log( temperature );
log( "TEMP >>>>>>>>>>>>>>>>>>>>>>>>>>>> : " + temperature );