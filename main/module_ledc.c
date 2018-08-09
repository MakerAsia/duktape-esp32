/*
 * This module provides access to the ESP32 LEDC/PWM functions.
 *
 * To test, it is recommended that we attach a logic analyzer to one of the ESP32 pins
 * and run scripts that setup the values.  We can then examine the results in the
 * analyzer output and validate that we are seeing what we expect to see.
 */
#include <duktape.h>
#include <esp_log.h>
#include <driver/ledc.h>

#include "esp32_specific.h"
#include "duktape_utils.h"
#include "logging.h"
#include "module_ledc.h"

LOG_TAG("module_ledc");

/*
 * [0] - options
 * * channel - int - Channel to configure.
 * * duty    - int - Duty - Duty cycle.
 * * gpio    - int - GPIO pin to use.
 * * timer   - int - Timer to use.
 */
static duk_ret_t js_ledc_channel_config(duk_context *ctx) {
	LOGD(">> js_ledc_channel_config");
	int channel; // Channel to use (0-7).
	int duty;    // Duty period.
	int gpio;    // GPIO number.
	int timer;   // Timer (0-3)

	if (duk_get_prop_string(ctx, -1, "gpio") == 1) {
		gpio = duk_get_int(ctx, -1);
	} else {
		duk_error(ctx, 1, "gpio not specified");
	}
	duk_pop(ctx);

	if (duk_get_prop_string(ctx, -1, "duty") == 1) {
		duty = duk_get_int(ctx, -1);
	} else {
		duk_error(ctx, 1, "duty not specified");
	}
	duk_pop(ctx);

	if (duk_get_prop_string(ctx, -1, "channel") == 1) {
		channel = duk_get_int(ctx, -1);
		if (channel < 0 || channel > 7) {
			duk_error(ctx, 1, "channel invalid");
		}
	} else {
		duk_error(ctx, 1, "channel not specified");
	}
	duk_pop(ctx);

	if (duk_get_prop_string(ctx, -1, "timer") == 1) {
		timer = duk_get_int(ctx, -1);
		if (timer < 0 || timer > 3) {
			duk_error(ctx, 1, "timer invalid");
		}
	} else {
		duk_error(ctx, 1, "timer not specified");
	}
	duk_pop(ctx);

	ledc_channel_config_t ledc_conf = {
	   .channel    = channel,
	   .duty       = duty,
	   .gpio_num   = gpio,
	   .intr_type  = LEDC_INTR_DISABLE,
	   .speed_mode = LEDC_HIGH_SPEED_MODE,
	   .timer_sel  = timer
	};
	esp_err_t errRc = ledc_channel_config(&ledc_conf);
	if (errRc != ESP_OK) {
		LOGE("ledc_channel_config: %s", esp32_errToString(errRc));
	}
	LOGD("<< js_ledc_channel_config");
	return 0;
} // js_ledc_channel_config


/*
 * Set the duty value of the PWM signal.
 * [0] - channel
 * [1] - duty
 */
static duk_ret_t js_ledc_set_duty(duk_context *ctx) {
//	LOGD(">> js_ledc_set_duty");
	esp_err_t errRc;
	ledc_channel_t channel;
	uint32_t duty;
	channel = duk_get_int(ctx, -2);
	if (channel < 0 || channel >= LEDC_CHANNEL_MAX) {
		duk_error(ctx, 1, "invalid channel");
	}
	duty = duk_get_int(ctx, -1);
	errRc = ledc_set_duty(LEDC_HIGH_SPEED_MODE, channel, duty);
	if (errRc != ESP_OK) {
		LOGE("ledc_set_duty: %s", esp32_errToString(errRc));
	}
//	LOGD("<< js_ledc_set_duty");
	return 0;
} // js_ledc_set_duty

/*
 * Set the duty value of the PWM freqency.
 * [0] - channel
 * [1] - duty
 */
static duk_ret_t js_ledc_set_frequency(duk_context *ctx) {
//	LOGD(">> js_ledc_set_frequency");
	esp_err_t errRc;
	ledc_channel_t channel;
	uint32_t freqency;
	channel = duk_get_int(ctx, -2);
	if (channel < 0 || channel >= LEDC_CHANNEL_MAX) {
		duk_error(ctx, 1, "invalid channel");
	}
	freqency = duk_get_int(ctx, -1);
	errRc = ledc_set_freq(LEDC_HIGH_SPEED_MODE, channel, freqency);
	if (errRc != ESP_OK) {
		LOGE("js_ledc_set_frequency: %s", esp32_errToString(errRc));
	}
//	LOGD("<< js_ledc_set_frequency");
	return 0;
} // js_ledc_set_frequency


/*
 * [0] - options
 * * bitSize - int - granularity of timer (bit size from 10-15 bits)
 * * freq    - int - frequency in Hz
 * * timer   - int - timer being set (0-3)
 */
static duk_ret_t js_ledc_timer_config(duk_context *ctx) {
	LOGD(">> js_ledc_timer_config");
	int freq_hz = 1000;
	int bit_size = 10;
	int timer = 0;
	if (duk_get_prop_string(ctx, -1, "freq") == 1) {
		freq_hz = duk_get_int(ctx, -1);
	} else {
		duk_error(ctx, 1, "freq not specified");
	}
	duk_pop(ctx);

	if (duk_get_prop_string(ctx, -1, "bitSize") == 1) {
		bit_size = duk_get_int(ctx, -1);
		if (bit_size < 10 || bit_size > 15) {
			duk_error(ctx, 1, "bitSize invalid");
		}
	} else {
		duk_error(ctx, 1, "bitSize not specified");
	}
	duk_pop(ctx);

	if (duk_get_prop_string(ctx, -1, "timer") == 1) {
		timer = duk_get_int(ctx, -1);
		if (timer < 0 || timer > 3) {
			duk_error(ctx, 1, "timer invalid");
		}
	} else {
		duk_error(ctx, 1, "timer not specified");
	}
	duk_pop(ctx);

	LOGD("timer: %d, freq: %d, bitSize: %d", timer, freq_hz, bit_size);

	ledc_timer_config_t timer_conf = {
	   .bit_num    = bit_size,
	   .freq_hz    = freq_hz,
	   .speed_mode = LEDC_HIGH_SPEED_MODE,
	   .timer_num  = timer,
	};
	esp_err_t errRc = ledc_timer_config(&timer_conf);
	if (errRc != ESP_OK) {
		LOGE("ledc_channel_config: %s", esp32_errToString(errRc));
	}
	LOGD("<< js_ledc_timer_config");
	return 0;
} // js_ledc_timer_config


/*
 * [0] - Channel
 */
static duk_ret_t js_ledc_update_duty(duk_context *ctx) {
	//LOGD(">> js_ledc_update_duty");
	esp_err_t errRc;
	ledc_channel_t channel;
	channel = duk_get_int(ctx, -1);
	if (channel < 0 || channel >= LEDC_CHANNEL_MAX) {
		duk_error(ctx, 1, "invalid channel");
	}
	errRc = ledc_update_duty(LEDC_HIGH_SPEED_MODE, channel);
	if (errRc != ESP_OK) {
		LOGE("ledc_update_duty: %s", esp32_errToString(errRc));
	}
//	LOGD("<< js_ledc_update_duty");
	return 0;
}


/**
 * Add native methods to the LEDC object.
 * [0] - LEDC Object
 */
duk_ret_t ModuleLEDC(duk_context *ctx) {

	ADD_FUNCTION("configureChannel", js_ledc_channel_config, 1);
	ADD_FUNCTION("setDuty",          js_ledc_set_duty,       2);
	ADD_FUNCTION("setFrequency",     js_ledc_set_frequency,  2);
	ADD_FUNCTION("configureTimer",   js_ledc_timer_config,   1);
	ADD_FUNCTION("updateDuty",       js_ledc_update_duty,    1);

	return 0;
} // ModuleLEDC
