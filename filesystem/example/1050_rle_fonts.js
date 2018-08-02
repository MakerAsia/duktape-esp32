var Display = require("display.js");
var display = new Display();

display.fillScreen( Display.BLACK );
DUKF.sleep(500);

display.setCursor(10, 10);
display.setTextColor(Display.WHITE);
display.setTextSize(1);

var y = 0;
//display.drawString("Font 1 ABCabc 012345", 0, y, 1); y += 8+2;

display.drawString("Font 2 ABCabc 012345", 0, y, 2); y += 16+2;

display.drawString("Font 4 ABCabc 012345", 0, y, 4); y += 26+2;
display.drawString("6 0123456789", 0, y, 6); y += 48+2;
display.drawString("7 01234567", 0, y, 7); y += 48+2;
display.drawString("8 0123", 0, y, 8); y += 75+2;