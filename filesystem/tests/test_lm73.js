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

var LM73_1_I2C_GND = 0x4D; // Ground

var LM73_REG_TEMPERATURE	= 0x00;
var LM73_REG_CONFIG			= 0x01;
var LM73_REG_CTRLSTATUS		= 0x04;

var LM73_BIT_ONE_SHOT		= 0x04;
var LM73_MASK_ONE_SHOT		= 0xFB;

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



function setResolution() {
    log( "--- Set Resolution" );
    log( "Read CTRLSTATUS" );
    i2c._read(LM73_1_I2C_GND,LM73_REG_CTRLSTATUS,data)
    log( "Get DATA: " + data[0] );
    data[0] = (data[0] & LM73_MASK_RESOLUTION) | LM73_RESOLUTION_12BIT;
    log( "OR: " + LM73_RESOLUTION_12BIT );
    log( "Set DATA: " + data[0] );
    log( "Write CTRLSTATUS" );
    i2c._write(LM73_1_I2C_GND,LM73_REG_CTRLSTATUS,data);
}

function powerOff() {
    log( "--- Power Off" );
    log( "Read CONFIG" );
    i2c._read(LM73_1_I2C_GND,LM73_REG_CONFIG,data)
    log( "Get DATA: " + data[0] );
    data[0] = (data[0] & LM73_MASK_PD) | LM73_POWER_OFF;
    log( "OR: " + LM73_POWER_OFF );
    log( "Set DATA: " + data[0] );
    log( "Write CONFIG" );
    i2c._write(LM73_1_I2C_GND,LM73_REG_CONFIG,data);
    log( "--- Done" );
}

function powerOn() {
    log( "--- Power On" );
    log( "Read CONFIG" );
    i2c._read(LM73_1_I2C_GND,LM73_REG_CONFIG,data)
    log( "Get DATA: " + data[0] );
    data[0] = (data[0] & LM73_MASK_PD) | LM73_POWER_ON;
    log( "OR: " + LM73_POWER_ON );
    log( "Set DATA: " + data[0] );
    log( "Write CONFIG" );
    i2c._write(LM73_1_I2C_GND,LM73_REG_CONFIG,data);
    log( "--- Done" );
}
	
function oneShot() {
	log( "read" );
	i2c._read(LM73_1_I2C_GND,LM73_REG_CONFIG,data);
	data[0] = (data[0] & LM73_MASK_ONE_SHOT) |LM73_BIT_ONE_SHOT;
	log( "write" );
	i2c._write(LM73_1_I2C_GND,LM73_REG_CONFIG,data);
}

function isReady() {
    log( "--- Is Ready" );
	i2c._read(LM73_1_I2C_GND,LM73_REG_CTRLSTATUS,data);	
	log( "data " + data[0] );
	data[0] = data[0] & LM73_BIT_DAV_FLAG;
	log( "ready " + data[0] );
	return data[0];
}

function temperature() {
	i2c._read(LM73_1_I2C_GND,LM73_REG_TEMPERATURE,data2);
	var ret = ((data2[0]<<8) | data2[1]) * 0.0078125;
	return ret;
}

//i2c.config(options);
log( "--- Create I2C object" );
var i2c = new I2C(options);
while( !isReady() )
    ;
setResolution();
powerOff();
powerOn();
oneShot();
while( !isReady() )
    ;
log( temperature() );
	