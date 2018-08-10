var I2C = require("i2c.js");
log("Constants:");
log("I2C_NUM_0: " + I2C.I2C_NUM_0);
log("I2C_NUM_1: " + I2C.I2C_NUM_1);
log("I2C_MODE_MASTER: " + I2C.I2C_MODE_MASTER);
log("I2C_MODE_SLAVE: " + I2C.I2C_MODE_SLAVE);
log("I2C_MASTER_READ: " + I2C.I2C_MASTER_READ);
log("I2C_MASTER_WRITE: " + I2C.I2C_MASTER_WRITE);

var i2cDevice = new I2C({
    port: I2C.I2C_NUM_0,
    mode: I2C.I2C_MODE_MASTER,
    sda_pin: 4,
    scl_pin: 5,
    master_clk_speed: 100000
});

const KBX_ADDRESS               = 0x34;         // KBX I2C Address

const KBX_REG_HID_DATA          = 0x00;         // 0
const KBX_REG_GPIO_VERSION	    = 0x10;         // 16
const KBX_REG_GPIO_DIRECTION	= 0x20;         // 32
const KBX_REG_GPIO_MASK	        = 0x21;         // 33
const KBX_REG_GPIO_DATA         = 0x22;         // 34

var b = new Buffer(2)
b[0] = 0x3F;
b[1] = 0xFF;
i2cDevice._write(KBX_ADDRESS, KBX_REG_GPIO_DIRECTION, b);

var hid = new Buffer(16);

var ack = true;

function getHID() {
	i2cDevice.beginTransaction(KBX_ADDRESS);
	i2cDevice.write(KBX_REG_HID_DATA,ack);
	i2cDevice.endTransaction();
	i2cDevice.beginTransaction(KBX_ADDRESS,false);
	i2cDevice.read(hid,ack);
	i2cDevice.endTransaction();    
	
    console.log( hid[0] );
    console.log( hid[1] );
    console.log( hid[2] );
    console.log( hid[3] );
}

function version() {
    b[0] = 0x00;
    b[1] = 0x00;
    //i2cDevice._read(KBX_ADDRESS, KBX_REG_GPIO_VERSION, b);
    
	i2cDevice.beginTransaction(KBX_ADDRESS);
	i2cDevice.write(KBX_REG_GPIO_VERSION,ack);
	i2cDevice.endTransaction();
	i2cDevice.beginTransaction(KBX_ADDRESS,false);
	i2cDevice.read(b,ack);
	i2cDevice.endTransaction();    
	
    console.log( b[0] );
    console.log( b[1] );
    var major = b[0];
    var minor = b[1];
    var ver = major.toString(16)+"."+minor.toString(16);
    console.log( ver );
    return ver
}

function getGPIO( pin ) {
    b[0] = 0x00;
    b[1] = 0x00;
    //i2cDevice._read(KBX_ADDRESS, KBX_REG_GPIO_VERSION, b);
    
	i2cDevice.beginTransaction(KBX_ADDRESS);
	i2cDevice.write(KBX_REG_GPIO_DATA,ack);
	i2cDevice.endTransaction();
	i2cDevice.beginTransaction(KBX_ADDRESS,false);
	i2cDevice.read(b,ack);
    i2cDevice.endTransaction();  
    
    var data = (b[0] << 8) + b[1];
    var ret = data.toString(16)

    console.log( ret );
}

//version();
//getGPIO( 0 );
getHID();
