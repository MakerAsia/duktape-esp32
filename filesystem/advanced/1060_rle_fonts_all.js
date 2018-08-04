var Display = require("display.js");
var display = new Display();

display.fillScreen( Display.BLACK );
DUKF.sleep(500);

display.setCursor(10, 10);
display.setTextColor(Display.GREEN);
display.setTextSize(1);

var y = 0;
//display.drawString("Font 1 ABCabc 012345", 0, y, 1); y += 8+2;

display.drawString(" !\"#$%&'()*+,-./0123456", 0, 0, 2);
display.drawString("789:;<=>?@ABCDEFGHIJKL", 0, 16, 2);
display.drawString("MNOPQRSTUVWXYZ[\\]^_`", 0, 32, 2);
display.drawString("abcdefghijklmnopqrstuvw", 0, 48, 2);
var xpos = 0;
xpos += display.drawString("xyz{|}~", 0, 64, 2);
display.drawChar(127, xpos, 64, 2);
DUKF.sleep(2000);

display.fillScreen(Display.BLACK);
display.setTextColor(Display.GREEN);

display.drawString(" !\"#$%&'()*+,-.", 0, 0, 4);
display.drawString("/0123456789:;", 0, 26, 4);
display.drawString("<=>?@ABCDE", 0, 52, 4);
display.drawString("FGHIJKLMNO", 0, 78, 4);
display.drawString("PQRSTUVWX", 0, 104, 4);
DUKF.sleep(2000); 
  