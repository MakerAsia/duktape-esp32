kidbright.init();

kidbright.display().fillScreen( kidbright.DISPLAY.BLACK );

console.log( ESP32.getState().heapSize);

var buffer = new Buffer(1024);

var posnX = 0;
var posnY = 0;

kidbright.display().setCursor(10, 10);
kidbright.display().setTextColor(kidbright.DISPLAY.GREEN,kidbright.DISPLAY.BLACK);
kidbright.display().setTextSize(1);

kidbright.loop(function() {
    var ms = new Date().getTime();
    var key = kidbright.kbxio().getKey();
    if( key ) {
        if( key >= 32 ) {
            var s = String.fromCharCode( key );
            //log( s );
            kidbright.display().drawString(s, posnX, posnY, 1);
            posnX += 8;
        }
        else {
            if( key == 13 ) {
                kidbright.display().drawString(" ", posnX, posnY, 1);
                posnX = 0;
                posnY += 10;
            }
        }
    }
    
    kidbright.display().drawString("_", posnX, posnY, 1);
});
