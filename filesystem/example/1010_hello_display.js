kidbright.init();

kidbright.display().fillScreen( kidbright.DISPLAY.BLACK );

console.log( ESP32.getState().heapSize);

kidbright.display().setCursor(10, 10);
kidbright.display().setTextColor(kidbright.DISPLAY.GREEN);
kidbright.display().setTextSize(1);
kidbright.display().drawString("Hello world", 0, 0, 1);
kidbright.display().drawString("Heap: " + ESP32.getState().heapSize, 0, 10, 1);