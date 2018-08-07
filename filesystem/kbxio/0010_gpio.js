var I2C = require("i2c");
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

const ADDRESS = 0x34; 
i2cDevice.beginTransaction(ADDRESS); 
var b = new Buffer(2)
b[0] = 0x00;
b[1] = 0x00
i2cDevice._write(ADDRESS, 0x20, b)

b[0] = 0xff;
b[1] = 0xff
i2cDevice._write(ADDRESS, 0x21, b)
i2cDevice._write(ADDRESS, 0x22, b)

setTimeout(function() {
    b[0] ^= b[0];
    b[1] ^= b[1];
    i2cDevice._write(ADDRESS, 0x22, b)
}, 1000)
