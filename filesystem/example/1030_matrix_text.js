var Matrix = require("matrix.js");

var matrix = new Matrix();

var x = 16;
setInterval(function() {
    matrix.clear();
    matrix.setCursor( x, 0 );
    matrix.print( "MakerLAB by MakerAsia" );
    matrix.writeDisplay();
    
    x--;
    if( x < -126 )
        x = 16;    
}, 80);


