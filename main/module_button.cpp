extern "C" {
#include <duktape.h>
#include <esp_log.h>
#include <driver/ledc.h>

#include "esp32_specific.h"
#include "duktape_utils.h"
#include "logging.h"
}
#include "Button.h"
#include "module_button.h"

LOG_TAG("module_button");

#define DEBOUNCE_MS 5
static 	Button    button[2];

static duk_ret_t js_bx_buttonInit(duk_context *ctx) {
	LOGD("js_bx_buttonInit");
    button[0].set( 16, true, DEBOUNCE_MS);
    button[1].set( 14, true, DEBOUNCE_MS);

	return 0;    
}

static duk_ret_t js_bx_isPressed(duk_context *ctx) {
	int index = duk_get_int(ctx, -1);
 
	bool ret = button[index].isPressed();
	if (ret == false) {
		duk_push_false(ctx);
	} else {
		duk_push_true(ctx);
	}
	return 1;
}

static duk_ret_t js_bx_wasPressed(duk_context *ctx) {
	int index = duk_get_int(ctx, -1);
 
	bool ret = button[index].wasPressed();
	if (ret == false) {
		duk_push_false(ctx);
	} else {
		duk_push_true(ctx);
	}
	return 1;
}

static duk_ret_t js_bx_read(duk_context *ctx) {
    int index = duk_get_int(ctx, -1);
	button[index].read();
    return 0;
}

extern "C" {
	/**
	 * Add native methods to the LEDC object.
	 * [0] - LEDC Object
	 */
	duk_ret_t ModuleButton(duk_context *ctx) {
		ADD_FUNCTION("buttonInit",     	js_bx_buttonInit,   0);
        ADD_FUNCTION("isPressed",       js_bx_isPressed,    1);
        ADD_FUNCTION("wasPressed",      js_bx_wasPressed,   1);
        ADD_FUNCTION("read",            js_bx_read,         1);

		return 0;
	} // ModuleLEDC
}
