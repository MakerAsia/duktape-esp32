var LEDC = require("ledc");
log("Configuring timer ...");
LEDC.configureTimer({
	bitSize: 12,
	freq: 1000,
	timer: 0
});

console.log("Configuring channel ...\n");
LEDC.configureChannel({
	channel:0,
	duty: 0,	
	gpio: 2,
	timer: 0
});

console.log("LEDC configured!\n");

var level = 0;
var inc = 80;
var intid = setInterval(function() {
    level += inc;
    if( level > 4095-80 )
        inc = -80;
    if( level < 1+80 )
        inc = 80;
	//log( "" + level + "\n" );
	LEDC.setDuty( 0, level ); 
	DUKF.sleep(1);
}, 50 );
console.log( intid );
console.log( '\n')
for( var i=0; i<intid; i++ ) {
    console.log( i );
    cancelInterval(i);
}