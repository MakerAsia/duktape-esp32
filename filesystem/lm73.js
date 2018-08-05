function lm73() {   
	var I2C = require("i2c");
	log("Constants:");
	log("I2C_NUM_0: " + I2C.I2C_NUM_0);
	log("I2C_NUM_1: " + I2C.I2C_NUM_1);
	log("I2C_MODE_MASTER: " + I2C.I2C_MODE_MASTER);
	log("I2C_MODE_SLAVE: " + I2C.I2C_MODE_SLAVE);
	log("I2C_MASTER_READ: " + I2C.I2C_MASTER_READ);
	log("I2C_MASTER_WRITE: " + I2C.I2C_MASTER_WRITE);
	
	var i2c = new I2C({
		port: I2C.I2C_NUM_0,
		mode: I2C.I2C_MODE_MASTER,
		sda_pin: 4,
		scl_pin: 5,
		master_clk_speed: 100000
	});

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

	// Set Resolution
	i2c.beginTransaction(LM73_1_I2C_GND);
	i2c.write(LM73_REG_CTRLSTATUS);
	i2c.endTransaction();

	i2c.beginTransaction(LM73_1_I2C_GND,false);
	var data = new Buffer(1);
	i2c.read(data);
	i2c.endTransaction();

	data[0] = (data[0] & LM73_MASK_RESOLUTION) | LM73_RESOLUTION_12BIT;
	i2c.beginTransaction(LM73_1_I2C_GND);
	i2c.write(LM73_REG_CTRLSTATUS);
	i2c.write(data);
	i2c.endTransaction();
	
	
	// power off
	i2c.beginTransaction(LM73_1_I2C_GND);
	i2c.write(LM73_REG_CONFIG);
	reg = i2c.endTransaction();

	i2c.beginTransaction(LM73_1_I2C_GND,false);
	i2c.read(data);
	reg = i2c.endTransaction();

	data[0] = (data[0] & LM73_MASK_PD) | LM73_POWER_OFF;
	i2c.beginTransaction(LM73_1_I2C_GND);
	i2c.write(LM73_REG_CONFIG);
	i2c.write(data);
	i2c.endTransaction();
	

    var ret = {
		oneShot: function() {
			i2c.beginTransaction(LM73_1_I2C_GND);
			i2c.write(LM73_REG_CONFIG);
			i2c.endTransaction();

			i2c.beginTransaction(LM73_1_I2C_GND,false);
			i2c.read(data);
			i2c.endTransaction();

			data[0] |= LM73_BIT_ONE_SHOT;
			i2c.beginTransaction(LM73_1_I2C_GND);
			i2c.write(LM73_REG_CONFIG);
			i2c.write(data);
			i2c.endTransaction();				
		},
		isReady: function() {
			i2c.beginTransaction(LM73_1_I2C_GND);
			i2c.write(LM73_REG_CONFIG);
			i2c.endTransaction();

			i2c.beginTransaction(LM73_1_I2C_GND,false);
			i2c.read(data);
			i2c.endTransaction();
			
			data[0] = data[0] & LM73_BIT_DAV_FLAG;
			log( "Ready: " + data[0] );
			return data[0];
		},
		temperature: function() {
			i2c.beginTransaction(LM73_1_I2C_GND);
			i2c.write(LM73_REG_TEMPERATURE);
			i2c.endTransaction();

			var data2 = new Buffer(2);
			i2c.beginTransaction(LM73_1_I2C_GND,false);
			i2c.read(data2);
			i2c.endTransaction();
			var ret = ((data2[0]<<8) | data2[1]) * 0.0078125;
			return ret;
		},
		read: function() {
			this.oneShot();
			while( !this.isReady )
				;
			return this.temperature();
		}
	}	
    return ret;	
}  

module.exports = lm73;