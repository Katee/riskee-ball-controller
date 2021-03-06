var express = require('express');
var http = require('http');
var connect = require('connect');
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var tinycolor = require("tinycolor2");

try {
  var options = require('./options');
} catch(e) {
  console.log('Could not include options.js, did you make it yet?');
  process.exit();
}

var app = express();
var server = http.createServer(app).listen(options.port, function(){
  console.log("Riskee Ball started at http://localhost:%s", options.port);
});

app.configure(function(){
  app.set('port', process.env.PORT || options.port);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express['static']('public'));
});

var arduino = new SerialPort(options.serialDevice, {baudrate: options.baudrate, parser: serialport.parsers.readline("\n")});

var io = require('socket.io').listen(server);
io.disable('log');

arduino.on("data", function (msg) {
  console.log(msg);
});

io.sockets.on('connection', function (socket) {
  socket.join('rb');

  // Start a lane
  socket.on('start', function (laneId) {
    startLane(laneId);
  });
});

app.get('/start', function(req, res) {
  var laneId = req.query['lane'];
  startLane(laneId);
  return res.json(true);
});

function startLane(laneId) {
  if (laneId === "*") {
    for (var i = 0; i < options.numLanes; i++) {
      sendToBoard(indexToLaneId(i) + 'S');
    }
  } else {
    sendToBoard(laneId + 'S');
  }
}

function indexToLaneId(i) {
  if (i == 9) {
    return "A";
  }
  return (i + 1).toString();
}

function sendToBoard(msg) {
  console.log('writing message: "%s"', msg);
  arduino.write(msg);
  // send the message again offset by a byte
  arduino.write(' '+msg);
}
