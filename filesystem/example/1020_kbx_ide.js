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

var code = "";
var runTimer;

var led1 = kidbright.ledBT();
var led2 = kidbright.ledWIFI();
var led3 = kidbright.ledNTP();
var led4 = kidbright.ledIOT();
var matrix = kidbright.matrix();
var printText = "";
var printX = 0;
function print( text ) {
    if( text == printText ) {
        return;
    }
    printText = text;
    printX = 16;
    matrix.clear();
    matrix.setCursor(printX,0);
    matrix.print( printText );
}
function update() {
    printX--;
	if( printX < (0-(printText.length * 8)) )
		printX = 16;    
    matrix.clear();
    matrix.setCursor(printX,0);
    matrix.print( printText );
    
}
function delay( t ) {
    DUKF.sleep( t );
}

kidbright.loop(function() {
    if( running ) {
        if( kidbright.button(0).wasPressed() ) {
            cancelInterval( runTimer );
            running = false;
            kidbright.kbxio().enable(); 
        }
    }
    else {
        if( kidbright.button(1).wasPressed() ) {
            running = true;
            kidbright.kbxio().disabled = true; 
            code = "runTimer = setInterval(function() {\n"
            code = code + "if( kidbright.button(0).wasPressed() ) {\n"
            code = code + "cancelInterval( runTimer );\n"
            code = code + "running = false;\n"
            code = code + "kidbright.kbxio().disabled = false;\n"
            code = code + "}\n"

            for( var i=0; i<lines.length; i++ ) {
                code = code + lines[i];
                code = code + "\n";
            }
            code = code + "update();\n"
            code = code + "},50);\n"
            log( code );
            try {
                eval( code );
            }
            catch( e ) {
                cancelInterval( runTimer );
                running = false;
                kidbright.kbxio().disabled = false; 
            }
        }        
    }
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
                else {
                    log( "8 line start" );
                    if( lineIndex > 0 ) {
                        kidbright.display().drawString("  ", posnX, posnY, 1);
                        log( "line" + currentLine );
                        lineIndex--;
                        currentLine = lines[lineIndex];
                        log( "line" + currentLine );
                        currentPosn = currentLine.length;
                        posnX = currentLine.length * 7;
                        posnY -= 10;
                        log( "OK" );
                    }
                }
            }
            else if( key == 13 ) {
                kidbright.display().drawString(" ", posnX, posnY, 1);
                posnX = 0;
                posnY += 10;
                log( currentLine );
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
