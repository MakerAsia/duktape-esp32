var Display = require("display.js");

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
display.drawString("Font 2 ABCabc 012345", 0, 0, 2);