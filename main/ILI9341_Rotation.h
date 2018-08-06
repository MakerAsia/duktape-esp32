
// This is the command sequence that rotates the ILI9341 driver coordinate frame

  rotation = m % 8; // Limit the range of values to 0-7

  writecommand(TFT_MADCTL);
  switch (rotation) {
    case 0:
if( TFT_DEVICE_M5STACK )
      writedata(TFT_MAD_MY | TFT_MAD_MV | TFT_MAD_BGR);
else
      writedata(TFT_MAD_MX | TFT_MAD_BGR);

      _width  = _init_width;
      _height = _init_height;
      break;
    case 1:
if( TFT_DEVICE_M5STACK )
      writedata(TFT_MAD_BGR);
else
      writedata(TFT_MAD_MV | TFT_MAD_BGR);

      _width  = _init_height;
      _height = _init_width;
      break;
    case 2:
if( TFT_DEVICE_M5STACK )
      writedata(TFT_MAD_MV | TFT_MAD_MX | TFT_MAD_BGR);
else
      writedata(TFT_MAD_MY | TFT_MAD_BGR);

      _width  = _init_width;
      _height = _init_height;
      break;
    case 3:
if( TFT_DEVICE_M5STACK )
      writedata(TFT_MAD_MX | TFT_MAD_MY | TFT_MAD_BGR);
else
      writedata(TFT_MAD_MX | TFT_MAD_MY | TFT_MAD_MV | TFT_MAD_BGR);

      _width  = _init_height;
      _height = _init_width;
      break;
  // These next rotations are for bottom up BMP drawing
    case 4:
if( TFT_DEVICE_M5STACK )
      writedata(TFT_MAD_MX | TFT_MAD_MY | TFT_MAD_MV | TFT_MAD_BGR);
else
      writedata(TFT_MAD_MX | TFT_MAD_MY | TFT_MAD_BGR);

      _width  = _init_width;
      _height = _init_height;
      break;
    case 5:
if( TFT_DEVICE_M5STACK )
      writedata(TFT_MAD_MY | TFT_MAD_BGR);
else
      writedata(TFT_MAD_MV | TFT_MAD_MX | TFT_MAD_BGR);

      _width  = _init_height;
      _height = _init_width;
      break;
    case 6:
if( TFT_DEVICE_M5STACK )
      writedata(TFT_MAD_MV | TFT_MAD_BGR);
else
      writedata(TFT_MAD_BGR);

      _width  = _init_width;
      _height = _init_height;
      break;
    case 7:
if( TFT_DEVICE_M5STACK )
      writedata(TFT_MAD_MX | TFT_MAD_BGR);
else
      writedata(TFT_MAD_MY | TFT_MAD_MV | TFT_MAD_BGR);

      _width  = _init_height;
      _height = _init_width;
      break;

  }
