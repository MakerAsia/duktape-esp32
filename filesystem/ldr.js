function ldr() {
    var _ADC = require("adc");
    _ADC.setResolution(_ADC.WIDTH_12BIT);
    
    var ret = {
        adc: _ADC,
		read: function() {
            return Math.round(_ADC.getValue(_ADC.CHANNEL_0) * 100 / 2048); 
        }, // getLevel
    }
    return ret;
}

module.exports = ldr;        