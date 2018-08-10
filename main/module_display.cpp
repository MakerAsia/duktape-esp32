/*
 * This module provides access to the ESP32 LEDC/PWM functions.
 *
 * To test, it is recommended that we attach a logic analyzer to one of the ESP32 pins
 * and run scripts that setup the values.  We can then examine the results in the
 * analyzer output and validate that we are seeing what we expect to see.
 */
extern "C" {
#include <duktape.h>
#include <esp_log.h>
#include <driver/ledc.h>

#include "esp32_specific.h"
#include "duktape_utils.h"
#include "logging.h"
}
#include "module_display.h"
#include "kbxDisplay.h"

LOG_TAG("module_display");

static 	kbxDisplay display;

/*
 * Initialize the GPIO pin.
 * [0] - Pin number
 */
static duk_ret_t js_dx_displayInit(duk_context *ctx) {
	LOGD("js_dx_displayInit"); 	

    display.PIN_TFT_MISO = 32;
    display.PIN_TFT_MOSI = 21;
    display.PIN_TFT_SCLK = 22;
    display.PIN_TFT_CS   = 19;  // Chip select control pin
    display.PIN_TFT_DC   = 18;  // Data Command control pin    

    display.begin();
    display.setRotation(1);
    display.fillScreen(BLACK);
    display.setTextFont(1);

	return 0;
} // js_os_gpioInit

static duk_ret_t js_dx_fillScreen(duk_context *ctx) {
	int color = duk_get_int(ctx, -1);
	display.fillScreen(color);  

	return 0;
}

static duk_ret_t js_dx_setCursor(duk_context *ctx) {
	int x = duk_get_int(ctx, -2);
	int y = duk_get_int(ctx, -1);
	display.setCursor(x, y);  

	return 0;
}

static duk_ret_t js_dx_setTextColor(duk_context *ctx) {
	int color = duk_get_int(ctx, -2);
	int bkColor = duk_get_int(ctx, -1);
	display.setTextColor(color,bkColor);  

	return 0;
}

static duk_ret_t js_dx_setTextSize(duk_context *ctx) {
	int size = duk_get_int(ctx, -1);
	display.setTextSize(size);  

	return 0;
}

static duk_ret_t js_dx_drawString(duk_context *ctx) {
    int font = duk_get_int(ctx, -1);
    int y = duk_get_int(ctx, -2);
    int x = duk_get_int(ctx, -3);

	size_t size;
	const void *data = esp32_duktape_dataFromStringOrBuffer(ctx, -4, &size);
	if (data == NULL || size == 0) {
		return 0;
	}
	if (size > 127)
		return 0;
	char buffer[128];
	memcpy( buffer, data, size );
	buffer[size] = 0;

	int r = display.drawString(buffer,x,y,font);
	duk_push_int(ctx, r);

	return 1;
}

static duk_ret_t js_dx_drawChar(duk_context *ctx) {
    int font = duk_get_int(ctx, -1);
    int y = duk_get_int(ctx, -2);
    int x = duk_get_int(ctx, -3);
    int c = duk_get_int(ctx, -4);

	int r = display.drawChar(c,x,y,font);
	duk_push_int(ctx, r);

	return 1;
}

static duk_ret_t js_dx_drawRect(duk_context *ctx) {
    int color = duk_get_int(ctx, -1);
    int h = duk_get_int(ctx, -2);
    int w = duk_get_int(ctx, -3);
    int y = duk_get_int(ctx, -4);
    int x = duk_get_int(ctx, -5);

	display.drawRect(x,y,w,h,color);
	return 0;
}

static duk_ret_t js_dx_fillRect(duk_context *ctx) {
    int color = duk_get_int(ctx, -1);
    int h = duk_get_int(ctx, -2);
    int w = duk_get_int(ctx, -3);
    int y = duk_get_int(ctx, -4);
    int x = duk_get_int(ctx, -5);

	display.fillRect(x,y,w,h,color);
	return 0;
}

static duk_ret_t js_dx_drawCircle(duk_context *ctx) {
    int color = duk_get_int(ctx, -1);
    int r = duk_get_int(ctx, -2);
    int y = duk_get_int(ctx, -3);
    int x = duk_get_int(ctx, -4);

	display.drawCircle(x,y,r,color);
	return 0;
}

static duk_ret_t js_dx_fillCircle(duk_context *ctx) {
    int color = duk_get_int(ctx, -1);
    int r = duk_get_int(ctx, -2);
    int y = duk_get_int(ctx, -3);
    int x = duk_get_int(ctx, -4);

	display.fillCircle(x,y,r,color);
	return 0;
}

static duk_ret_t js_dx_drawTriangle(duk_context *ctx) {
    int color = duk_get_int(ctx, -1);
    int y3 = duk_get_int(ctx, -2);
    int x3 = duk_get_int(ctx, -3);
    int y2 = duk_get_int(ctx, -4);
    int x2 = duk_get_int(ctx, -5);
    int y1 = duk_get_int(ctx, -6);
    int x1 = duk_get_int(ctx, -7);

	display.drawTriangle(x1,y1,x2,y2,x3,y3,color);
	return 0;
}

static duk_ret_t js_dx_fillTriangle(duk_context *ctx) {
    int color = duk_get_int(ctx, -1);
    int y3 = duk_get_int(ctx, -2);
    int x3 = duk_get_int(ctx, -3);
    int y2 = duk_get_int(ctx, -4);
    int x2 = duk_get_int(ctx, -5);
    int y1 = duk_get_int(ctx, -6);
    int x1 = duk_get_int(ctx, -7);

	display.fillTriangle(x1,y1,x2,y2,x3,y3,color);
	return 0;
}

static duk_ret_t js_dx_width(duk_context *ctx) {
	int w = display.width();
	duk_push_int(ctx, w);

	return 1;
}

static duk_ret_t js_dx_height(duk_context *ctx) {
	int h = display.height();
	duk_push_int(ctx, h);

	return 1;
}

extern "C" {
	/**
	 * Add native methods to the LEDC object.
	 * [0] - LEDC Object
	 */
	duk_ret_t ModuleDisplay(duk_context *ctx) {
		ADD_FUNCTION("displayInit",     js_dx_displayInit,  0);       
		ADD_FUNCTION("fillScreen",      js_dx_fillScreen,   1);    
		ADD_FUNCTION("setCursor",   	js_dx_setCursor,   	2);
		ADD_FUNCTION("setTextColor",   	js_dx_setTextColor, 2);
		ADD_FUNCTION("setTextSize",   	js_dx_setTextSize,  1);
		ADD_FUNCTION("drawString",   	js_dx_drawString,   4);
		ADD_FUNCTION("drawChar",   		js_dx_drawChar,   	4);
		ADD_FUNCTION("drawRect",   		js_dx_drawRect,   	5);
		ADD_FUNCTION("fillRect",   		js_dx_fillRect,   	5);
		ADD_FUNCTION("drawCircle",  	js_dx_drawCircle,	4);
		ADD_FUNCTION("fillCircle",   	js_dx_fillCircle,  	4);
		ADD_FUNCTION("drawTriangle",   	js_dx_drawTriangle, 7);
		ADD_FUNCTION("fillTriangle",   	js_dx_fillTriangle, 7);
		ADD_FUNCTION("width",   		js_dx_width, 		0);
		ADD_FUNCTION("height",   		js_dx_height, 		0);

        ADD_INT("BLACK",            0x0000);      /*   0,   0,   0 */
        ADD_INT("NAVY",             0x000F);      /*   0,   0, 128 */
        ADD_INT("DARKGREEN",        0x03E0);      /*   0, 128,   0 */
        ADD_INT("DARKCYAN",         0x03EF);      /*   0, 128, 128 */
        ADD_INT("MAROON",           0x7800);      /* 128,   0,   0 */
        ADD_INT("PURPLE",           0x780F);      /* 128,   0, 128 */
        ADD_INT("OLIVE",            0x7BE0);      /* 128, 128,   0 */
        ADD_INT("LIGHTGREY",        0xC618);      /* 192, 192, 192 */
        ADD_INT("DARKGREY",         0x7BEF);      /* 128, 128, 128 */
        ADD_INT("BLUE",             0x001F);      /*   0,   0, 255 */
        ADD_INT("GREEN",            0x07E0);      /*   0, 255,   0 */
        ADD_INT("CYAN",             0x07FF);      /*   0, 255, 255 */
        ADD_INT("RED",              0xF800);      /* 255,   0,   0 */
        ADD_INT("MAGENTA",          0xF81F);      /* 255,   0, 255 */
        ADD_INT("YELLOW",           0xFFE0);      /* 255, 255,   0 */
        ADD_INT("WHITE",            0xFFFF);      /* 255, 255, 255 */
        ADD_INT("ORANGE",           0xFDA0);      /* 255, 180,   0 */
        ADD_INT("GREENYELLOW",      0xB7E0);      /* 180, 255,   0 */
        ADD_INT("PINK",             0xFC9F);

		return 0;
	} // ModuleLEDC
}
