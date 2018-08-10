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

const KBX_REG_GPIO_DIRECTION	= 0x20;         // 32
const KBX_REG_GPIO_MASK	        = 0x21;         // 33
const KBX_REG_GPIO_DATA         = 0x22;         // 34

var b = new Buffer(2)
b[0] = 0x00;
b[1] = 0x00;
i2cDevice._write(KBX_ADDRESS, KBX_REG_GPIO_DIRECTION, b);

function setGPIO( pin, value ) {
    var mask = 1 << pin;
    log( mask );
    b[1] = mask & 0xFF;
    b[0] = (mask >> 8) & 0xFF;
    log( b[0] );
    log( b[1] );
    i2cDevice._write(KBX_ADDRESS, KBX_REG_GPIO_MASK, b);
    
    if( !value ) {
        b[0] ^= b[0];
        b[1] ^= b[1];
    }
    log( b[0] );
    log( b[1] );
    i2cDevice._write(KBX_ADDRESS, KBX_REG_GPIO_DATA, b);
}

var p = 0;
var v = 1;
setInterval( function() {
    if( p === 0 )
        setGPIO( 13, 0 );
    else
        setGPIO( (p-1), 0 );

    setGPIO( p, 1 );
    p++;
    if( p > 13 )
        p = 0;
}, 100);


