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
        lastKey: 0,
        lastKeyIn: 0,
        lastUpdate: 0,
        disabled: false,
        readHID: function() {
            i2c.beginTransaction(KBX_ADDRESS);
            i2c.write(KBX_REG_HID_DATA);
            i2c.endTransaction();
            i2c.beginTransaction(KBX_ADDRESS,false);
            i2c.read(hid);
            i2c.endTransaction();    
            
            //console.log( hid[0] );
            //console.log( hid[1] );
            //console.log( hid[2] );
            //console.log( hid[3] );
            if( hid[1] != 0 ) {
                var c = hid[1];
                if( hid[1] == 44 ) {
                    // space
                    c = 0x20;
                }
                else if( hid[1] >= 4 && hid[1] < (4+26) ) {
                    // a - z
                    c = 0x61+hid[1]-4;
                    if( hid[0] & 2 ) {
                        c -= 0x20;
                    }
                }
                else if( hid[1] >= 30 && hid[1] <= 38 ) {
                    // 1-9
                    if( hid[0] & 2 ) {
                        c = "!@#$%^&*(".charCodeAt(hid[1]-30);
                    }
                    else {
                        c = 0x31+hid[1]-30;
                    }
                }
                else if( hid[1] == 39 ) {
                    // 0
                    if( hid[0] & 2 ) {
                        c = 0x29;
                    }
                    else {
                        c = 0x30;
                    }
                }
                else if( hid[1] == 42 ) {
                    // backspace
                    c = 8;
                }
                else if( hid[1] == 54 ) {
                    // ,
                    c = 0x2c;
                }
                else if( hid[1] == 55 ) {
                    // .
                    c = 0x2e;
                }
                else if( hid[1] == 40 ) {
                    c = 0x0D;
                }
                else if( hid[1] == 51 ) {
                    // ;
                    c = 0x3b;
                }
                else if( hid[1] == 52 ) {
                    // ;
                    c = 0x27;
                }
                if( c != this.lastKeyIn ) {
                    log( hid[0] );
                    log( hid[1] );
                    this.lastKeyIn = c;
                    this.lastKey = c;
                }
            }
            else {
                this.lastKeyIn = 0;
            }
        },
        update: function() {
            if( this.disabled )
                return;
            var ms = new Date().getTime();
            if( ms-this.lastUpdate > 150 ) {
                this.lastUpdate = ms;
                this.readHID();
            }
        },
        getKey: function() {
            if( this.lastKey != 0 ) {
                var l = this.lastKey;
                this.lastKey = 0;
                return l;
            }
            return 0;
        }
	}	
    return ret;	
}  

module.exports = kbxio;        