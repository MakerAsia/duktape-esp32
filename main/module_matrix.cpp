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

/*
 * Initialize the GPIO pin.
 * [0] - Pin number
 */
static duk_ret_t js_kb_matrixInit(duk_context *ctx) {
	LOGD("js_kb_matrixInit $$$$$$$$$$$$$$$$$$$$");

	KBX_8x16minimatrix    matrix;
    matrix.begin(0x70);  // pass in the address
    for (int i=0; i<8; i++) {
        int ii = i % 8;
        matrix.displaybuffer[i] = (257 << ii);
    }
    matrix.writeDisplay();

	return 0;
} // js_os_gpioInit

extern "C" {
	/**
	 * Add native methods to the LEDC object.
	 * [0] - LEDC Object
	 */
	duk_ret_t ModuleMatrix(duk_context *ctx) {
		ADD_FUNCTION("matrixInit",              js_kb_matrixInit,              0);

		return 0;
	} // ModuleLEDC
}
