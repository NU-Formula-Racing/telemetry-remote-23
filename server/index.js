// ****************************** CONSTANT DEFINITIONS ***********************************
// server/index.js
const express = require("express");
const http = require("http");
const socketio = require('socket.io');
const cors = require("cors");
const util = require('util');

// serial ports
const {SerialPort} = require("serialport");

// define serial port
// List of all possible ports as far as we know:
// 1. /dev/tty.usbmodem115442301
const laptopPort = new SerialPort({
  path: '/dev/tty.usbmodem115442301',
  baudRate: 9600
  }, function (err) { // error cheecking
    if (err) {
      return console.log('Error: ', err.message)
    }
});

// number of sensors
const numSensors = 10;
const sensorByteLength = numSensors*2;

// dynamoDB constants setup
const { DynamoDB } = require("@aws-sdk/client-dynamodb");

// server constants
const app = express();
const PORT = process.env.PORT || 3001;
const value_types = ["float", "float", "float", "float", "float", "float", "float", "float", "int", "int"];
const value_lengths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

const corsOptions = {
  origin: "http://localhost:3000", 
  credentials:true,            //access-control-allow-credentials:true
  // allowedHeaders: ["header"],
}
app.use(cors(corsOptions)) // Use this after the variable declaration

const origin = Date.now() / 1000;

// Miscellaneous
const scale = 10;
const bias = -40;

//-----------------socket.io-----------------

const server = http.createServer(app);

const io = socketio(server,{cors:{origin:"*"}});

var prev = new Array(10).fill(50)

// const sensors = ["FL WHEEL SPEED", "FR WHEEL SPEED", "BL WHEEL SPEED", "BR WHEEL SPEED", "FL BRAKE TEMP", 
// "FR BRAKE TEMP", "BL BRAKE TEMP", "BR BRAKE TEMP", "F BRAKE PRESSURE", "R BRAKE PRESSURE"];
const sensors = ["FL WHEEL SPEED", "FR WHEEL SPEED"];







// ****************************** SERIAL PORT CODE ***********************************

// used for sending data to aws DynamoDB
var sensorDataQueue = {};
sensors.forEach(sensor => { sensorDataQueue[sensor] = [] });

// Check if data reading in from port is erroring
// laptopPort.open(function(err) {
//   if (err) {
//     return console.log('Error opening port: ', err.message);
//   }
// })

// When socket connects, send data to client
io.on('connection', (socket) => {
  console.log(`${socket.id} client connected!`);

  // send list of sensor names and initial values to client
  socket.on('getSensors', (callback) => {
    initValues = {}
    for (var i = 0; i < sensors.length; i++) {
      initValues[sensors[i]] = [(0.01,0.01)];
    }
    callback(initValues);
  });

  // READ INCOMING SERIAL DATA FROM TEENSY
  laptopPort.on('data', function (data) {
    Console.log(data);
    streamData(data, socket)
  });

  streamData([], socket)

  // disconnecting the socket
  socket.on('disconnect', () => {å
    console.log('client disconnected');
  });
});

// Helper function to stream data into the socket
function streamData(data, socket) {
  console.log("Current data input: ", data.toString());

  // Create data object dictionary
  let dataObj = dataSlicing(data);

  // send data to client on sendSensorData event
  socket.emit('sendSensorData',  dataObj);
}


// Slicing the data into 2 bytes each, might need to change
function dataSlicing(data){
  let dataObj = {};
  const curTime = Date.now() / 1000;

  // Data value list, information is listed as below
  // Index 0: FL WHEEL SPEED, float
  // Index 1: FR WHEEL SPEED, float
  // Index 2: BL WHEEL SPEED, float
  // Index 3: BR WHEEL SPEED, float
  // Index 4: FL BRAKE TEMP, float
  // Index 5: FR BRAKE TEMP, float
  // Index 6: BL BRAKE TEMP, float
  // Index 7: BR BRAKE TEMP, float
  // Index 8: F BRAKE PRESSURE, int
  // Index 9: R BRAKE PRESSURE, int

  data_ind = 0; // index for the data array
  item_ind = 0; // index for the reference arrays

  while (data_ind < sensorByteLength) {
    let value = bin2string(data.slice(data_ind, data_ind + value_lengths[item_ind]));
    value = processData(value, value_types[item_ind]);
    dataObj[sensors[item_ind]] = {
      'val': value,
      'time': curTime,
    }
    data_ind += value_lengths[item_ind];
    item_ind += 1;
  }
  
  return dataObj;
}

function processData(value, type){
  // value -> the data in bytes
  // type -> type of data, int or float

  if (type == "int"){
    // process to int
    return parseInt(value, 2);
  } else if (type == "float"){
    // process to float
    return parseFloat(value)/scale + bias;
  }

  return value

}




// ****************************** DYNAMODB CODE ***********************************

// Write data to DynamoDB, faked right now
setInterval(() => {
  var dynamoDBJson = {};
  // set the necessary headers for the response
  sensors.forEach(sensor => { dynamoDBJson[sensor] = {L : []}; });
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + ',' + mm + ',' + dd;
  dynamoDBJson["Date"] = { S: today };
  // console.log(`len: ${Object.keys(sensorDataQueue).length}`);
  const curTime = Date.now() / 1000;
  for (var i = 0; i < sensors.length; i++) {
    // pop data from sensorDataQueue and add to dynamoDBJson if time is before curTime
    while (sensorDataQueue[sensors[i]].length > 1 && Number(sensorDataQueue[sensors[i]][0].L[0].S) < curTime - origin) {
      dynamoDBJson[sensors[i]].L.push(sensorDataQueue[sensors[i]].shift());
      sensorDataQueue[sensors[i]].shift();
    }
  }

  dynamoDBJson["id"] = { S: "123456" };
  dynamoDBJson["Session Name"] = { S: "Test Session" };

  console.log(`SEND TO DYNAMO ${util.inspect(dynamoDBJson, {showHidden: false, depth: null, colors: true})}`);
}, 1 * 1000)

function getSmoothNumber(n) {
  const scale = 5;
  let difference = Math.floor(Math.random() * scale) - Math.floor(Math.random() * scale);
  if (n + difference < 0) {
    difference = scale * 2;
  }
  if (n + difference > 100) {
    difference = - scale * 2;
  }
  return n + difference;
}


// REAL TIME STREAMING DATA INTO DYNAMODB
function streamDataDynamoDB() {
}


// ****************************** MISC ***********************************

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});

function bin2string(array){
	var result = "";
	for(var i = 0; i < array.length; ++i){
		result+= (String.fromCharCode(array[i]));
	}
	return result;
}