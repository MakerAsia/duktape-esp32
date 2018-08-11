kidbright.init();

kidbright.display().fillScreen( kidbright.DISPLAY.BLACK );

console.log( ESP32.getState().heapSize);

var lines = [];
var lineIndex = 0;
var currentLine = "";
var currentPosn = 0;

var posnX = 0;
var posnY = 0;
//kidbright.matrix().scroll( "OK" );

kidbright.display().setCursor(10, 10);
kidbright.display().setTextColor(kidbright.DISPLAY.GREEN,kidbright.DISPLAY.BLACK);
kidbright.display().setTextSize(1);

kidbright.kbxio().getKey();

var running = false;

kidbright.loop(function() {
    if( running )
        return;
    var ms = new Date().getTime();
    var key = kidbright.kbxio().getKey();
    if( key ) {
        if( key >= 32 ) {
            var s = String.fromCharCode( key );
            //log( s );
            kidbright.display().drawString(s, posnX, posnY, 1);
            posnX += 7;
            
            if( currentPosn == currentLine.length ) {
                currentLine += s;
                currentPosn++;
            }
        }
        else {
            if( key == 8 ) {
                if( (currentPosn > 0) && (currentPosn == currentLine.length) ) {
                    currentLine = currentLine.substr(0,currentLine.length-1);
                    posnX -= 7;
                    kidbright.display().drawString("  ", posnX, posnY, 1);
                    currentPosn--;
                }
            }
            else if( key == 13 ) {
                kidbright.display().drawString(" ", posnX, posnY, 1);
                posnX = 0;
                posnY += 10;
                log( currentLine );
                running = true;
                kidbright.kbxio().disabled = true; 
                eval( currentLine );
                // To do -- its never come out... ha ha
                lines[lineIndex] = currentLine;
                lineIndex++;
                currentLine = ""
                currentPosn = 0;
            }
        }
    }
    
    kidbright.display().drawString("_", posnX, posnY, 1);
    //log( ">>>>>>>>>>>>>>>>>> LOOP >>>>>>>>>>>>>>>>>>>>>>" );
});
