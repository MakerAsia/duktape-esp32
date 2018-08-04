var moduleButton = ESP32.getNativeFunction("ModuleButton");
if (moduleButton === null) {
	log("Unable to find ModuleButton");
	module.exports = null;
	return;
}

var internalButton = {};
moduleButton(internalButton);

function button( button_index ) {
    internalButton.buttonInit();
    var ret = {
		isPressed: function() {
            var b = internalButton.isPressed(button_index);
            return b;
		}, // getLevel
		wasPressed: function() {
            var b = internalButton.wasPressed(button_index);
            return b;
        },
        read: function() {
            internalButton.read(button_index);
        }
	}; // End ret
	return ret;
} // matrix

module.exports = button;        