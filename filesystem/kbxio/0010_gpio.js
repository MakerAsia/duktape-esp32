const I2C = require("i2c");
const ADDRESS = 0x34;

console.log("Constants:");
console.log("I2C_NUM_0: " + I2C.I2C_NUM_0);
console.log("I2C_NUM_1: " + I2C.I2C_NUM_1);
console.log("I2C_MODE_MASTER: " + I2C.I2C_MODE_MASTER);
console.log("I2C_MODE_SLAVE: " + I2C.I2C_MODE_SLAVE);
console.log("I2C_MASTER_READ: " + I2C.I2C_MASTER_READ);
console.log("I2C_MASTER_WRITE: " + I2C.I2C_MASTER_WRITE);

const i2cDevice = new I2C({
  port: I2C.I2C_NUM_0,
  mode: I2C.I2C_MODE_MASTER,
  sda_pin: 4,
  scl_pin: 5,
  master_clk_speed: 100000
});

i2cDevice.beginTransaction(ADDRESS);
i2cDevice.write(0x20);
i2cDevice.write(new Uint8Array([0x00, 0x00]));
i2cDevice.endTransaction();

i2cDevice.beginTransaction(ADDRESS);
i2cDevice.write(0x21);
i2cDevice.write(new Uint8Array([0xff, 0xff]));
i2cDevice.endTransaction();

kidbright.loop(function () {
  i2cDevice.beginTransaction(ADDRESS);
  i2cDevice.write(0x22);
  i2cDevice.write(new Uint8Array([0xff, 0xff]));
  i2cDevice.endTransaction();
  kidbright.delay(1000);
  i2cDevice.beginTransaction(ADDRESS);
  i2cDevice.write(0x22);
  i2cDevice.write(new Uint8Array([0x00, 0x00]));
  i2cDevice.endTransaction();
  kidbright.delay(1000);
});
