function kbxio() {   
	var I2C = require("i2c.js");
	log("Constants:");
	log("I2C_NUM_0: " + I2C.I2C_NUM_0);
	log("I2C_NUM_1: " + I2C.I2C_NUM_1);
	log("I2C_MODE_MASTER: " + I2C.I2C_MODE_MASTER);
	log("I2C_MODE_SLAVE: " + I2C.I2C_MODE_SLAVE);
	log("I2C_MASTER_READ: " + I2C.I2C_MASTER_READ);
    log("I2C_MASTER_WRITE: " + I2C.I2C_MASTER_WRITE);

    const KBX_ADDRESS               = 0x34;         // KBX I2C Address

    const KBX_REG_HID_DATA          = 0x00;         // 0
    const KBX_REG_GPIO_VERSION	    = 0x10;         // 16
    const KBX_REG_GPIO_DIRECTION	= 0x20;         // 32
    const KBX_REG_GPIO_MASK	        = 0x21;         // 33
    const KBX_REG_GPIO_DATA         = 0x22;         // 34    
    
    var options = {
		port: I2C.I2C_NUM_0,
		mode: I2C.I2C_MODE_MASTER,
		sda_pin: 4,
		scl_pin: 5,
		master_clk_speed: 100000
    };
    var i2c = new I2C(options);

    var hid = new Buffer(16);

    

    var ret = {
        function readHID() {
            i2cDevice.beginTransaction(KBX_ADDRESS);
            i2cDevice.write(KBX_REG_HID_DATA);
            i2cDevice.endTransaction();
            i2cDevice.beginTransaction(KBX_ADDRESS,false);
            i2cDevice.read(hid);
            i2cDevice.endTransaction();    
            
            console.log( hid[0] );
            console.log( hid[1] );
            console.log( hid[2] );
            console.log( hid[3] );
        }    
	}	
    return ret;	
}  

module.exports = kbxio;        