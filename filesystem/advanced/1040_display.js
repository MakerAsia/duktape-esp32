var Display = require("display.js");
var Matrix = require("matrix.js");

var matrix = new Matrix();
var display = new Display();

display.fillScreen( Display.WHITE );
DUKF.sleep(500);
display.fillScreen( Display.RED );
DUKF.sleep(500);
display.fillScreen( Display.GREEN );
DUKF.sleep(500);
display.fillScreen( Display.BLUE );
DUKF.sleep(500);
display.fillScreen( Display.BLACK );
DUKF.sleep(500);

display.setCursor(10, 10);
display.setTextColor(Display.WHITE);
display.setTextSize(1);
display.drawString("Font 2 ABCabc 012345", 0, 0, 1);

DUKF.sleep(1000);
display.drawRect(100, 100, 50, 50, Display.BLUE);
DUKF.sleep(1000);
display.fillRect(100, 100, 50, 50, Display.BLUE);
DUKF.sleep(1000);
display.drawCircle(100, 100, 50, Display.RED);
DUKF.sleep(1000);
display.fillCircle(100, 100, 50, Display.RED);
DUKF.sleep(1000);
display.drawTriangle(30, 30, 180, 100, 80, 150, Display.YELLOW);
DUKF.sleep(1000);
display.fillTriangle(30, 30, 180, 100, 80, 150, Display.YELLOW);
DUKF.sleep(1000);

var t = setInterval(function() {
  display.fillTriangle(
    Math.random() * (display.width()), 
    Math.random() * (display.height()), 
    Math.random() * (display.width()), 
    Math.random() * (display.height()), 
    Math.random() * (display.width()), 
    Math.random() * (display.height()), 
    Math.random() * (0xfffe)
  );
}, 1);

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

for( var i=0; i<t; i++ ) {
    cancelInterval(i)
}