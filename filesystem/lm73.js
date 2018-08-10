function lm73() {   
	var I2C = require("i2c.js");
	log("Constants:");
	log("I2C_NUM_0: " + I2C.I2C_NUM_0);
	log("I2C_NUM_1: " + I2C.I2C_NUM_1);
	log("I2C_MODE_MASTER: " + I2C.I2C_MODE_MASTER);
	log("I2C_MODE_SLAVE: " + I2C.I2C_MODE_SLAVE);
	log("I2C_MASTER_READ: " + I2C.I2C_MASTER_READ);
	log("I2C_MASTER_WRITE: " + I2C.I2C_MASTER_WRITE);
	
	var options = {
		port: I2C.I2C_NUM_0,
		mode: I2C.I2C_MODE_MASTER,
		sda_pin: 4,
		scl_pin: 5,
		master_clk_speed: 100000
	};
	var i2c = new I2C(options);

	var LM73_1_I2C_GND = 0x4D; // Ground
	
	var LM73_REG_TEMPERATURE	= 0x00;
	var LM73_REG_CONFIG			= 0x01;
	var LM73_REG_CTRLSTATUS		= 0x04;

	var LM73_BIT_ONE_SHOT		= 0x04;

	var LM73_RESOLUTION_11BIT = 0b00000000;
	var LM73_RESOLUTION_12BIT = 0b00100000;
	var LM73_RESOLUTION_13BIT = 0b01000000;
	var LM73_RESOLUTION_14BIT = 0b01100000;
	var LM73_MASK_RESOLUTION  = 0b10011111;

	var LM73_POWER_ON  = 0b00000000;
	var LM73_POWER_OFF = 0b10000000;
	var LM73_MASK_PD   = 0b01111111;

	var LM73_BIT_DAV_FLAG = 0x01;

	var data = new Buffer(1);
	var data2 = new Buffer(2);

	// Set Resolution
	i2c._read(LM73_1_I2C_GND,LM73_REG_CTRLSTATUS,data)
	data[0] = (data[0] & LM73_MASK_RESOLUTION) | LM73_RESOLUTION_12BIT;
	i2c._write(LM73_1_I2C_GND,LM73_REG_CTRLSTATUS,data);
	
	
	i2c._read(LM73_1_I2C_GND,LM73_REG_CONFIG,data)
	data[0] = (data[0] & LM73_MASK_PD) | LM73_POWER_ON;
	i2c._write(LM73_1_I2C_GND,LM73_REG_CONFIG,data);
	

    var ret = {
		powerON: function() {
			i2c._read(LM73_1_I2C_GND,LM73_REG_CONFIG,data)
			data[0] = (data[0] & LM73_MASK_PD) | LM73_POWER_ON;
			i2c._write(LM73_1_I2C_GND,LM73_REG_CONFIG,data);
		},
		powerOFF: function() {
			i2c._read(LM73_1_I2C_GND,LM73_REG_CONFIG,data)
			data[0] = (data[0] & LM73_MASK_PD) | LM73_POWER_OFF;
			i2c._write(LM73_1_I2C_GND,LM73_REG_CONFIG,data);
		},
		oneShot: function() {
			log( "read" );
			i2c._read(LM73_1_I2C_GND,LM73_REG_CONFIG,data);
			data[0] = LM73_BIT_ONE_SHOT;
			log( "write" );
			i2c._write(LM73_1_I2C_GND,LM73_REG_CONFIG,data);
		},
		isReady: function() {
			i2c._read(LM73_1_I2C_GND,LM73_REG_CTRLSTATUS,data);			
			data[0] = data[0] & LM73_BIT_DAV_FLAG;
			log( "READY: " + data[0] );
			return data[0];
		},
		temperature: function() {
			i2c._read(LM73_1_I2C_GND,LM73_REG_TEMPERATURE,data2);
			var ret = ((data2[0]<<8) | data2[1]) * 0.0078125;
			return ret;
		},
		read: function() {
			//i2c.config(options);

			//this.isReady();
			this.oneShot();
			this.isReady();
			//while( !this.isReady() )
			//	;
			var ret = this.temperature();
			//this.powerOFF();
			return ret;
		}
	}	
    return ret;	
}  

module.exports = lm73;