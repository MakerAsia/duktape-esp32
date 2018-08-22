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
#include "module_matrix.h"
#include "LEDBackpack.h"

LOG_TAG("module_matrix");

static 	KBX_8x16minimatrix    matrix;

/*
 * Initialize the GPIO pin.
 * [0] - Pin number
 */
static duk_ret_t js_mx_matrixInit(duk_context *ctx) {
	LOGD("js_mx_matrixInit");

    matrix.begin(0x70);  // pass in the address
	/*
    for (int i=0; i<8; i++) {
        int ii = i % 8;
        matrix.displaybuffer[i] = (257 << ii);
    }
	*/
	matrix.clear();
	matrix.setRotation(1);
	matrix.setTextSize(1);
	matrix.setTextWrap(false);  // we dont want text to wrap so it scrolls nicely
	matrix.drawPixel(0,0,1);  
	matrix.writeDisplay();  // write the changes we just made to the display  	

	return 0;
} // js_os_gpioInit

static duk_ret_t js_mx_drawPixel(duk_context *ctx) {
	int x = duk_get_int(ctx, -3);
	int y = duk_get_int(ctx, -2);
	int color = duk_get_int(ctx, -1);

	LOGD( "drawPixel C\n" );
	matrix.drawPixel(x, y, color);  

	return 0;
}

static duk_ret_t js_mx_writeDisplay(duk_context *ctx) {
	LOGD( "writeDisplay C\n" );
	matrix.writeDisplay();  // write the changes we just made to the display  	

	return 0;
}

static duk_ret_t js_mx_clear(duk_context *ctx) {
	LOGD( "clear C\n" );
	matrix.clear();  // write the changes we just made to the display  	

	return 0;
}

static duk_ret_t js_mx_setCursor(duk_context *ctx) {
	int x = duk_get_int(ctx, -2);
	int y = duk_get_int(ctx, -1);

	LOGD( "setCursor C\n" );
	matrix.setCursor(x, y);  

	return 0;
}

static duk_ret_t js_mx_print(duk_context *ctx) {
	size_t size;
	const void *data = esp32_duktape_dataFromStringOrBuffer(ctx, -1, &size);
	if (data == NULL || size == 0) {
		return 0;
	}
	if (size > 127)
		return 0;
	char buffer[128];
	memcpy( buffer, data, size );
	buffer[size] = 0;
	LOGD("Writing %s bytes to matrix", buffer);
	//LOGD("Writing %d bytes to matrix", size);
	matrix.print(buffer);
	return 0;
}

extern "C" {
	/**
	 * Add native methods to the LEDC object.
	 * [0] - LEDC Object
	 */
	duk_ret_t ModuleMatrix(duk_context *ctx) {
		ADD_FUNCTION("matrixInit",     	js_mx_matrixInit,   0);
		ADD_FUNCTION("drawPixel",      	js_mx_drawPixel,    3);
		ADD_FUNCTION("writeDisplay",   	js_mx_writeDisplay, 0);
		ADD_FUNCTION("clear",   		js_mx_clear, 		0);
		ADD_FUNCTION("setCursor",   	js_mx_setCursor,   	2);
		ADD_FUNCTION("print",   		js_mx_print,   		1);

		return 0;
	} // ModuleLEDC
}
