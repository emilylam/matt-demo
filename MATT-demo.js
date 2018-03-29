/*
MATT-demo, routine
Emily Lam, March 2018
*/

// Serial port
var SerialPort = require('serialport');
var port_xy = new SerialPort('/dev/cu.usbmodem1411', {
  baudRate: 9600
});

// Use a Readline parser
var parsers = SerialPort.parsers;
var parser = new parsers.Readline({
  delimiter: '\r\n'
});

// Port open errors will be emitted as an error event
port_xy.on('error', function(err) {
  console.log('Error: ', err.message);
})

// Swith port open to flowing mode and pipe to parser.
port_xy.on('open', () => console.log('Port open'));
// pipe to parser
port_xy.pipe(parser);
parser.on('data', console.log);

// Home first
setTimeout(start_homing, 2000);
function start_homing() {
  port_xy.write('$H\r', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('Homing');
  });
}

// Then start routine
setTimeout(start_loop, 7000);
function start_loop() {setInterval(MATT_routine, 220);}

x = 0;
y = 0;
xy = 1; // xy = 1 move x, xy = 2 move y
max_x = 50;
max_y = 50;
min_x = 10;
min_y = 20;
var msg;
function MATT_routine() {
  if (xy == 1) {
    x = x + 1;
    msg = "X-" + x + "\r";
    if (x > max_x-1) {xy=2;}
  }
  else if (xy == 2) {
    y = y + 1;
    msg = "Y-" + y + "\r";
    if (y > max_y-1) {xy = 3;}
  }
  else if (xy == 3) {
    x = x - 1;
    msg = "X-" + x + "\r";
    if (x < min_x) {xy = 4;}
  }
  else if (xy == 4) {
    y = y - 1;
    msg = "Y-" + y + "\r";
    if (y < min_y) {xy = 1;}
  }


  port_xy.write(msg, function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('Wrote: ',msg);
  });
}
