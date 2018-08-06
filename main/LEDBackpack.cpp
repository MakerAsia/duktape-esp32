/***************************************************
  This is a library for our I2C LED Backpacks

  Designed specifically to work with the Adafruit LED Matrix backpacks
  ----> http://www.adafruit.com/products/
  ----> http://www.adafruit.com/products/

  These displays use I2C to communicate, 2 pins are required to
  interface. There are multiple selectable I2C addresses. For backpacks
  with 2 Address Select pins: 0x70, 0x71, 0x72 or 0x73. For backpacks
  with 3 Address Select pins: 0x70 thru 0x77

  Adafruit invests time and resources providing this open source code,
  please support Adafruit and open-source hardware by purchasing
  products from Adafruit!

  Written by Limor Fried/Ladyada for Adafruit Industries.
  MIT license, all text above must be included in any redistribution
 ****************************************************/

#include <Wire.h>
#include "LEDBackpack.h"
#include "Config.h"
#include "Adafruit_GFX.h"
#include "esp32-hal-i2c.h"
#include "In_eSPI.h"
#include "SPI.h"

#ifndef _BV
  #define _BV(bit) (1<<(bit))
#endif

#ifndef _swap_int16_t
#define _swap_int16_t(a, b) { int16_t t = a; a = b; b = t; }
#endif

//TwoWire Wire1 = TwoWire(1);


static const uint8_t numbertable[] = {
	0x3F, /* 0 */
	0x06, /* 1 */
	0x5B, /* 2 */
	0x4F, /* 3 */
	0x66, /* 4 */
	0x6D, /* 5 */
	0x7D, /* 6 */
	0x07, /* 7 */
	0x7F, /* 8 */
	0x6F, /* 9 */
	0x77, /* a */
	0x7C, /* b */
	0x39, /* C */
	0x5E, /* d */
	0x79, /* E */
	0x71, /* F */
};

static const uint16_t alphafonttable[] PROGMEM =  {

0b0000000000000001,
0b0000000000000010,
0b0000000000000100,
0b0000000000001000,
0b0000000000010000,
0b0000000000100000,
0b0000000001000000,
0b0000000010000000,
0b0000000100000000,
0b0000001000000000,
0b0000010000000000,
0b0000100000000000,
0b0001000000000000,
0b0010000000000000,
0b0100000000000000,
0b1000000000000000,
0b0000000000000000,
0b0000000000000000,
0b0000000000000000,
0b0000000000000000,
0b0000000000000000,
0b0000000000000000,
0b0000000000000000,
0b0000000000000000,
0b0001001011001001,
0b0001010111000000,
0b0001001011111001,
0b0000000011100011,
0b0000010100110000,
0b0001001011001000,
0b0011101000000000,
0b0001011100000000,
0b0000000000000000, //
0b0000000000000110, // !
0b0000001000100000, // "
0b0001001011001110, // #
0b0001001011101101, // $
0b0000110000100100, // %
0b0010001101011101, // &
0b0000010000000000, // '
0b0010010000000000, // (
0b0000100100000000, // )
0b0011111111000000, // *
0b0001001011000000, // +
0b0000100000000000, // ,
0b0000000011000000, // -
0b0000000000000000, // .
0b0000110000000000, // /
0b0000110000111111, // 0
0b0000000000000110, // 1
0b0000000011011011, // 2
0b0000000010001111, // 3
0b0000000011100110, // 4
0b0010000001101001, // 5
0b0000000011111101, // 6
0b0000000000000111, // 7
0b0000000011111111, // 8
0b0000000011101111, // 9
0b0001001000000000, // :
0b0000101000000000, // ;
0b0010010000000000, // <
0b0000000011001000, // =
0b0000100100000000, // >
0b0001000010000011, // ?
0b0000001010111011, // @
0b0000000011110111, // A
0b0001001010001111, // B
0b0000000000111001, // C
0b0001001000001111, // D
0b0000000011111001, // E
0b0000000001110001, // F
0b0000000010111101, // G
0b0000000011110110, // H
0b0001001000000000, // I
0b0000000000011110, // J
0b0010010001110000, // K
0b0000000000111000, // L
0b0000010100110110, // M
0b0010000100110110, // N
0b0000000000111111, // O
0b0000000011110011, // P
0b0010000000111111, // Q
0b0010000011110011, // R
0b0000000011101101, // S
0b0001001000000001, // T
0b0000000000111110, // U
0b0000110000110000, // V
0b0010100000110110, // W
0b0010110100000000, // X
0b0001010100000000, // Y
0b0000110000001001, // Z
0b0000000000111001, // [
0b0010000100000000, //
0b0000000000001111, // ]
0b0000110000000011, // ^
0b0000000000001000, // _
0b0000000100000000, // `
0b0001000001011000, // a
0b0010000001111000, // b
0b0000000011011000, // c
0b0000100010001110, // d
0b0000100001011000, // e
0b0000000001110001, // f
0b0000010010001110, // g
0b0001000001110000, // h
0b0001000000000000, // i
0b0000000000001110, // j
0b0011011000000000, // k
0b0000000000110000, // l
0b0001000011010100, // m
0b0001000001010000, // n
0b0000000011011100, // o
0b0000000101110000, // p
0b0000010010000110, // q
0b0000000001010000, // r
0b0010000010001000, // s
0b0000000001111000, // t
0b0000000000011100, // u
0b0010000000000100, // v
0b0010100000010100, // w
0b0010100011000000, // x
0b0010000000001100, // y
0b0000100001001000, // z
0b0000100101001001, // {
0b0001001000000000, // |
0b0010010010001001, // }
0b0000010100100000, // ~
0b0011111111111111,

};

void LEDBackpack::spi_init(void)
{
#if !defined (ESP32)
  #ifdef TFT_CS
    cspinmask = (uint32_t) digitalPinToBitMask(TFT_CS);
  #endif

  #ifdef TFT_DC
    dcpinmask = (uint32_t) digitalPinToBitMask(TFT_DC);
  #endif

  #ifdef TFT_WR
    wrpinmask = (uint32_t) digitalPinToBitMask(TFT_WR);
  #endif

  #ifdef TFT_SPI_OVERLAP
    // Overlap mode SD0=MISO, SD1=MOSI, CLK=SCLK must use D3 as CS
    //    pins(int8_t sck, int8_t miso, int8_t mosi, int8_t ss);
    //SPI.pins(        6,          7,           8,          0);
    SPI.pins(6, 7, 8, 0);
  #endif

  SPI.begin(); // This will set HMISO to input
#else
  #if !defined(ESP32_PARALLEL)
    #if defined (TFT_MOSI) && !defined (TFT_SPI_OVERLAP)
      SPI.begin(TFT_SCLK, TFT_MISO, TFT_MOSI, -1);
    #else
      SPI.begin();
    #endif
  #endif
#endif

  //inTransaction = false;
  //locked = true;

  // SUPPORT_TRANSACTIONS is mandatory for ESP32 so the hal mutex is toggled
  // so the code here is for ESP8266 only
#if !defined (SUPPORT_TRANSACTIONS) && defined (ESP8266)
  SPI.setBitOrder(MSBFIRST);
  SPI.setDataMode(SPI_MODE0);
  SPI.setFrequency(SPI_FREQUENCY);
#endif

#if defined(ESP32_PARALLEL)
    digitalWrite(TFT_CS, LOW); // Chip select low permanently
    pinMode(TFT_CS, OUTPUT);
#else
  #ifdef TFT_CS
    // Set to output once again in case D6 (MISO) is used for CS
    digitalWrite(TFT_CS, HIGH); // Chip select high (inactive)
    pinMode(TFT_CS, OUTPUT);
  #else
    SPI.setHwCs(1); // Use hardware SS toggling
  #endif
#endif

  // Set to output once again in case D6 (MISO) is used for DC
#ifdef TFT_DC
  digitalWrite(TFT_DC, HIGH); // Data/Command high = data mode
  pinMode(TFT_DC, OUTPUT);
#endif
}


void LEDBackpack::setBrightness(uint8_t b) {
  if (b > 15) b = 15;
  Wire1.begin(LED_SDA, LED_SCL, 400000);
  Wire1.beginTransmission(i2c_addr);
  Wire1.write(HT16K33_CMD_BRIGHTNESS | b);
  Wire1.endTransmission();
}

void LEDBackpack::blinkRate(uint8_t b) {
  Wire1.begin(LED_SDA, LED_SCL, 400000);
  Wire1.beginTransmission(i2c_addr);
  if (b > 3) b = 0; // turn off if not sure

  Wire1.write(HT16K33_BLINK_CMD | HT16K33_BLINK_DISPLAYON | (b << 1));
  Wire1.endTransmission();
}

LEDBackpack::LEDBackpack(void) {
}

void LEDBackpack::begin(uint8_t _addr = 0x70) {

  i2c_addr = _addr;

  Wire1.begin(LED_SDA, LED_SCL, 400000);

  Wire1.beginTransmission(i2c_addr);
  Wire1.write(0x21);  // turn on oscillator
  Wire1.endTransmission();

  blinkRate(HT16K33_BLINK_OFF);

  setBrightness(15); // max brightness


}

void switch_to_spi(void) {
  ESP_REG(DR_REG_IO_MUX_BASE + esp32_gpioMux[21].reg) = 0x2A00;
  GPIO.pin[21].val = 0x0;
  ESP_REG(DR_REG_IO_MUX_BASE + esp32_gpioMux[22].reg) = 0x2A00;
  GPIO.pin[22].val = 0x0;

  pinMatrixOutAttach(22, VSPICLK_OUT_IDX, false, false);
  pinMatrixOutAttach(21, VSPID_IN_IDX, false, false);
}

void switch_to_i2c(void) {
  ESP_REG(DR_REG_IO_MUX_BASE + esp32_gpioMux[21].reg) = 0x2B00;
  GPIO.pin[21].val = 0x4;
  ESP_REG(DR_REG_IO_MUX_BASE + esp32_gpioMux[22].reg) = 0x2B00;
  GPIO.pin[22].val = 0x4;

  pinMatrixOutAttach(22, I2CEXT0_SCL_OUT_IDX, false, false);
  pinMatrixInAttach(22, I2CEXT0_SCL_OUT_IDX, false);

  pinMatrixOutAttach(21, I2CEXT0_SDA_OUT_IDX, false, false);
  pinMatrixInAttach(21, I2CEXT0_SDA_OUT_IDX, false);

}

void LEDBackpack::writeDisplay(void) {
  switch_to_i2c();
  Wire1.begin(LED_SDA, LED_SCL, 400000);
  Wire1.beginTransmission(i2c_addr);
  Wire1.write((uint8_t)0x00); // start at address $00

  for (uint8_t i=0; i<8; i++) {
    Wire1.write(displaybuffer[i] & 0xFF);
    Wire1.write(displaybuffer[i] >> 8);
  }
  Wire1.endTransmission();
//  delayMicroseconds(10);
  //Wire1.reset();
//  delayMicroseconds(10);
//  SPI.end();
  //spi_init();
  switch_to_spi();
}

void LEDBackpack::clear(void){
  for (uint8_t i=0; i<8; i++) {
    displaybuffer[i] = 0;
  }
}
/******************************* QUAD ALPHANUM OBJECT */

KBX_AlphaNum4::KBX_AlphaNum4(void) {

}

void KBX_AlphaNum4::writeDigitRaw(uint8_t n, uint16_t bitmask) {
  displaybuffer[n] = bitmask;
}

void KBX_AlphaNum4::writeDigitAscii(uint8_t n, uint8_t a,  boolean d) {
  uint16_t font = pgm_read_word(alphafonttable+a);

  displaybuffer[n] = font;

  /*
  Serial.print(a, DEC);
  Serial.print(" / '"); Serial.write(a);
  Serial.print("' = 0x"); Serial.println(font, HEX);
  */

  if (d) displaybuffer[n] |= (1<<14);
}

/******************************* 24 BARGRAPH OBJECT */

KBX_24bargraph::KBX_24bargraph(void) {

}

void KBX_24bargraph::setBar(uint8_t bar, uint8_t color) {
  uint16_t a, c;

  if (bar < 12)
    c = bar / 4;
  else
    c = (bar - 12) / 4;

  a = bar % 4;
  if (bar >= 12)
    a += 4;

  //Serial.print("Ano = "); Serial.print(a); Serial.print(" Cath = "); Serial.println(c);
  if (color == LED_RED) {
    // Turn on red LED.
    displaybuffer[c] |= _BV(a);
    // Turn off green LED.
    displaybuffer[c] &= ~_BV(a+8);
  } else if (color == LED_YELLOW) {
    // Turn on red and green LED.
    displaybuffer[c] |= _BV(a) | _BV(a+8);
  } else if (color == LED_OFF) {
    // Turn off red and green LED.
    displaybuffer[c] &= ~_BV(a) & ~_BV(a+8);
  } else if (color == LED_GREEN) {
    // Turn on green LED.
    displaybuffer[c] |= _BV(a+8);
    // Turn off red LED.
    displaybuffer[c] &= ~_BV(a);
  }
}


/******************************* 16x8 MATRIX OBJECT */

KBX_8x16matrix::KBX_8x16matrix(void) : Adafruit_GFX(8, 16) {
}

void KBX_8x16matrix::drawPixel(int16_t x, int16_t y, uint16_t color) {

 // check rotation, move pixel around if necessary
  switch (getRotation()) {
  case 2:
    _swap_int16_t(x, y);
    x = 16 - x - 1;
    break;
  case 3:
    x = 16 - x - 1;
    y = 8 - y - 1;
    break;
  case 0:
    _swap_int16_t(x, y);
    y = 8 - y - 1;
    break;
  }
  /*
  Serial.print("("); Serial.print(x);
  Serial.print(","); Serial.print(y);
  Serial.println(")");
  */

  if ((y < 0) || (y >= 8)) return;
  if ((x < 0) || (x >= 16)) return;

  if (color) {
    displaybuffer[y] |= 1 << x;
  } else {
    displaybuffer[y] &= ~(1 << x);
  }
}

/******************************* 16x8 MINI MATRIX OBJECT */

KBX_8x16minimatrix::KBX_8x16minimatrix(void) : Adafruit_GFX(8, 16) {
}

void KBX_8x16minimatrix::drawPixel(int16_t x, int16_t y, uint16_t color) {

  if ((y < 0) || (x < 0)) return;
  if ((getRotation() % 2 == 0) && ((y >= 16) || (x >= 8))) return;
  if ((getRotation() % 2 == 1) && ((x >= 16) || (y >= 8))) return;


 // check rotation, move pixel around if necessary
  switch (getRotation()) {
  case 2:
    if (y >= 8) {
      x += 8;
      y -= 8; 
    }
     _swap_int16_t(x, y);
    break;
  case 3:
    x = 16 - x - 1;
    if (x >= 8) {
      x -= 8;
      y += 8; 
    }
    break;
  case 0:
    y = 16 - y - 1;
    x = 8 - x - 1;
    if (y >= 8) {
      x += 8;
      y -= 8; 
    }
     _swap_int16_t(x, y);
    break;
  case 1:
    y = 8 - y - 1;
    if (x >= 8) {
      x -= 8;
      y += 8; 
    }
    break;
  }

  if (color) {
    displaybuffer[x] |= 1 << y;
  } else {
    displaybuffer[x] &= ~(1 << y);
  }
}

/******************************* 8x8 MATRIX OBJECT */

KBX_8x8matrix::KBX_8x8matrix(void) : Adafruit_GFX(8, 8) {
}

void KBX_8x8matrix::drawPixel(int16_t x, int16_t y, uint16_t color) {
  if ((y < 0) || (y >= 8)) return;
  if ((x < 0) || (x >= 8)) return;

 // check rotation, move pixel around if necessary
  switch (getRotation()) {
  case 1:
    _swap_int16_t(x, y);
    x = 8 - x - 1;
    break;
  case 2:
    x = 8 - x - 1;
    y = 8 - y - 1;
    break;
  case 3:
    _swap_int16_t(x, y);
    y = 8 - y - 1;
    break;
  }

  // wrap around the x
  x += 7;
  x %= 8;


  if (color) {
    displaybuffer[y] |= 1 << x;
  } else {
    displaybuffer[y] &= ~(1 << x);
  }
}

/******************************* 8x8 BICOLOR MATRIX OBJECT */

KBX_BicolorMatrix::KBX_BicolorMatrix(void) : Adafruit_GFX(8, 8) {
}

void KBX_BicolorMatrix::drawPixel(int16_t x, int16_t y, uint16_t color) {
  if ((y < 0) || (y >= 8)) return;
  if ((x < 0) || (x >= 8)) return;

  switch (getRotation()) {
  case 1:
    _swap_int16_t(x, y);
    x = 8 - x - 1;
    break;
  case 2:
    x = 8 - x - 1;
    y = 8 - y - 1;
    break;
  case 3:
    _swap_int16_t(x, y);
    y = 8 - y - 1;
    break;
  }

  if (color == LED_GREEN) {
    // Turn on green LED.
    displaybuffer[y] |= 1 << x;
    // Turn off red LED.
    displaybuffer[y] &= ~(1 << (x+8));
  } else if (color == LED_RED) {
    // Turn on red LED.
    displaybuffer[y] |= 1 << (x+8);
    // Turn off green LED.
    displaybuffer[y] &= ~(1 << x);
  } else if (color == LED_YELLOW) {
    // Turn on green and red LED.
    displaybuffer[y] |= (1 << (x+8)) | (1 << x);
  } else if (color == LED_OFF) {
    // Turn off green and red LED.
    displaybuffer[y] &= ~(1 << x) & ~(1 << (x+8));
  }
}

/******************************* 7 SEGMENT OBJECT */

KBX_7segment::KBX_7segment(void) {
  position = 0;
}

void KBX_7segment::print(unsigned long n, int base)
{
  if (base == 0) write(n);
  else printNumber(n, base);
}

void KBX_7segment::print(char c, int base)
{
  print((long) c, base);
}

void KBX_7segment::print(unsigned char b, int base)
{
  print((unsigned long) b, base);
}

void KBX_7segment::print(int n, int base)
{
  print((long) n, base);
}

void KBX_7segment::print(unsigned int n, int base)
{
  print((unsigned long) n, base);
}

void  KBX_7segment::println(void) {
  position = 0;
}

void  KBX_7segment::println(char c, int base)
{
  print(c, base);
  println();
}

void  KBX_7segment::println(unsigned char b, int base)
{
  print(b, base);
  println();
}

void  KBX_7segment::println(int n, int base)
{
  print(n, base);
  println();
}

void  KBX_7segment::println(unsigned int n, int base)
{
  print(n, base);
  println();
}

void  KBX_7segment::println(long n, int base)
{
  print(n, base);
  println();
}

void  KBX_7segment::println(unsigned long n, int base)
{
  print(n, base);
  println();
}

void  KBX_7segment::println(double n, int digits)
{
  print(n, digits);
  println();
}

void  KBX_7segment::print(double n, int digits)
{
  printFloat(n, digits);
}


size_t KBX_7segment::write(uint8_t c) {

  uint8_t r = 0;

  if (c == '\n') position = 0;
  if (c == '\r') position = 0;

  if ((c >= '0') && (c <= '9')) {
    writeDigitNum(position, c-'0');
    r = 1;
  }

  position++;
  if (position == 2) position++;

  return r;
}

void KBX_7segment::writeDigitRaw(uint8_t d, uint8_t bitmask) {
  if (d > 4) return;
  displaybuffer[d] = bitmask;
}

void KBX_7segment::drawColon(boolean state) {
  if (state)
    displaybuffer[2] = 0x2;
  else
    displaybuffer[2] = 0;
}

void KBX_7segment::writeColon(void) {
   Wire1.begin(LED_SDA, LED_SCL, 400000);
   Wire1.beginTransmission(i2c_addr);
   Wire1.write((uint8_t)0x04); // start at address $02

    Wire1.write(displaybuffer[2] & 0xFF);
    Wire1.write(displaybuffer[2] >> 8);

    Wire1.endTransmission();
}

void KBX_7segment::writeDigitNum(uint8_t d, uint8_t num, boolean dot) {
  if (d > 4) return;

  writeDigitRaw(d, numbertable[num] | (dot << 7));
}

void KBX_7segment::print(long n, int base)
{
  printNumber(n, base);
}

void KBX_7segment::printNumber(long n, uint8_t base)
{
    printFloat(n, 0, base);
}

void KBX_7segment::printFloat(double n, uint8_t fracDigits, uint8_t base)
{
  uint8_t numericDigits = 4;   // available digits on display
  boolean isNegative = false;  // true if the number is negative

  // is the number negative?
  if(n < 0) {
    isNegative = true;  // need to draw sign later
    --numericDigits;    // the sign will take up one digit
    n *= -1;            // pretend the number is positive
  }

  // calculate the factor required to shift all fractional digits
  // into the integer part of the number
  double toIntFactor = 1.0;
  for(int i = 0; i < fracDigits; ++i) toIntFactor *= base;

  // create integer containing digits to display by applying
  // shifting factor and rounding adjustment
  uint32_t displayNumber = n * toIntFactor + 0.5;

  // calculate upper bound on displayNumber given
  // available digits on display
  uint32_t tooBig = 1;
  for(int i = 0; i < numericDigits; ++i) tooBig *= base;

  // if displayNumber is too large, try fewer fractional digits
  while(displayNumber >= tooBig) {
    --fracDigits;
    toIntFactor /= base;
    displayNumber = n * toIntFactor + 0.5;
  }

  // did toIntFactor shift the decimal off the display?
  if (toIntFactor < 1) {
    printError();
  } else {
    // otherwise, display the number
    int8_t displayPos = 4;

    if (displayNumber)  //if displayNumber is not 0
    {
      for(uint8_t i = 0; displayNumber || i <= fracDigits; ++i) {
        boolean displayDecimal = (fracDigits != 0 && i == fracDigits);
        writeDigitNum(displayPos--, displayNumber % base, displayDecimal);
        if(displayPos == 2) writeDigitRaw(displayPos--, 0x00);
        displayNumber /= base;
      }
    }
    else {
      writeDigitNum(displayPos--, 0, false);
    }

    // display negative sign if negative
    if(isNegative) writeDigitRaw(displayPos--, 0x40);

    // clear remaining display positions
    while(displayPos >= 0) writeDigitRaw(displayPos--, 0x00);
  }
}

void KBX_7segment::printError(void) {
  for(uint8_t i = 0; i < SEVENSEG_DIGITS; ++i) {
    writeDigitRaw(i, (i == 2 ? 0x00 : 0x40));
  }
}
