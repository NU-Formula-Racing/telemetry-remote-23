// ****************************** CONSTANT DEFINITIONS ***********************************
// server/index.js
const express = require("express");
const http = require("http");
const socketio = require('socket.io');
const cors = require("cors");
const util = require('util');
const dynamoDB = require('./dynamodb.js');

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
const value_types = ["float", "float", "float", "float", "float", "float", "float", "float", "int", "int", "int"];
const bias_bool_array = [false, true, false, true, false, true, false, true, true, true, "int"];
const value_lengths = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2];

const corsOptions = {
  // origin: "http://localhost:3000", 
  origin: "http://localhost:63613",
  credentials:true,            //access-control-allow-credentials:true
  // allowedHeaders: ["header"],
}
app.use(cors(corsOptions)) // Use this after the variable declaration

const origin = Date.now() / 1000;

// Miscellaneous - Real
// const scale = 10;
// const bias = -40;

// Miscellaneous - Testing
const scale = 0.1;
const bias = 0;


// Notes:
// 1. First 8 shorts -> floats
// 2. Next 3 shorts -> integers

//-----------------socket.io-----------------

const server = http.createServer(app);

const io = socketio(server,{cors:{origin:"*"}});

var prev = new Array(10).fill(50)

// Keys:
// const sensors = ["FL WHEEL SPEED", "FR WHEEL SPEED", "BL WHEEL SPEED", "BR WHEEL SPEED", "FL BRAKE TEMP", 
// "FR BRAKE TEMP", "BL BRAKE TEMP", "BR BRAKE TEMP", "F BRAKE PRESSURE", "R BRAKE PRESSURE"];
// const sensors = ["FL WHEEL SPEED", "FR WHEEL SPEED"];

// const sensors = ["FL WHEEL SPEED", "FL BRAKE TEMP", "FR WHEEL SPEED", "FR BRAKE TEMP", "BL WHEEL SPEED", "BL BRAKE TEMP", 
// "BR WHEEL SPEED", "BR BRAKE TEMP", "F BRAKE PRESSURE", "R BRAKE PRESSURE"];

const sensors = ["FL_WHEEL_SPEED", "FR_WHEEL_SPEED", "BL_WHEEL_SPEED", "BR_WHEEL_SPEED", "FL_BRAKE_TEMP",
"FR_BRAKE_TEMP", "BL_BRAKE_TEMP", "BR_BRAKE_TEMP", "F_BRAKE_PRESSURE", "R_BRAKE_PRESSURE"];


let temp = {}
for (let i = 0; i < sensors.length; i++){
  temp[sensors[i]] = i + 10;
}




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
    console.log(data);
    let pocessedData = streamData(data, socket);
  });

  // disconnecting the socket
  socket.on('disconnect', () => {å
    console.log('client disconnected');
  });
});


// Helper function to stream data into the socket
function streamData(data, socket) {

  // data length check
  if (data.length <= 1){
    return;
  }

  console.log("Current data input: ", data.toString());

  // Create data object dictionary
  let dataObj = dataSlicing(data);
  console.log("Current to client object: ", dataObj);

  // send data to client on sendSensorData event
  socket.emit('sendSensorData',  dataObj);

  return dataObj;
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

  info_ind = 0; // index for the miscellaneous information arrays
  i = 1; // data index

  // while loop for getting data
  while (i < data.length){

    // when we reach the last bit
    // The termination bit apparently
    if (i == data.length - 1){
      break;
    }

    let value = data[i].toString(2) + data[i-1].toString(2); // little endian
    value = processData(value, info_ind);
    dataObj[sensors[info_ind]] = {
      'val': value,
      'time': curTime,
    }

    // Iteratior increment
    i += value_lengths[info_ind] // increment with current data value length
    info_ind += 1;
  }
  
  return dataObj;
}


function processData(value, info_ind){
  // value -> the data in bytes
  // type -> type of data, int or float
  let type = value_types[info_ind];
  let bias_bool = bias_bool_array[info_ind];

  if (type == "int"){
    // process to int
    return parseInt(value, 2);
  } else if (type == "float"){
    // process to float
    // see if data needs bias attached
    if (bias_bool){
      return parseInt(value, 2)*scale + bias;
    }{
      return parseInt(value, 2)*scale;
    }
  }

  return value
}



// ****************************** DYNAMODB CODE ***********************************

// // Write data to DynamoDB, faked right now
// setInterval(() => {
//   var dynamoDBJson = {};
//   // set the necessary headers for the response
//   sensors.forEach(sensor => { dynamoDBJson[sensor] = {L : []}; });
//   var today = new Date();
//   var dd = String(today.getDate()).padStart(2, '0');
//   var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
//   var yyyy = today.getFullYear();
//   today = yyyy + ',' + mm + ',' + dd;
//   dynamoDBJson["Date"] = { S: today };
//   // console.log(`len: ${Object.keys(sensorDataQueue).length}`);
//   const curTime = Date.now() / 1000;
//   for (var i = 0; i < sensors.length; i++) {
//     // pop data from sensorDataQueue and add to dynamoDBJson if time is before curTime
//     while (sensorDataQueue[sensors[i]].length > 1 && Number(sensorDataQueue[sensors[i]][0].L[0].S) < curTime - origin) {
//       dynamoDBJson[sensors[i]].L.push(sensorDataQueue[sensors[i]].shift());
//       sensorDataQueue[sensors[i]].shift();
//     }
//   }

//   dynamoDBJson["id"] = { S: "123456" };
//   dynamoDBJson["Session Name"] = { S: "Test Session" };

//   console.log(`SEND TO DYNAMO ${util.inspect(dynamoDBJson, {showHidden: false, depth: null, colors: true})}`);
// }, 1 * 1000)

// function getSmoothNumber(n) {
//   const scale = 5;
//   let difference = Math.floor(Math.random() * scale) - Math.floor(Math.random() * scale);
//   if (n + difference < 0) {
//     difference = scale * 2;
//   }
//   if (n + difference > 100) {
//     difference = - scale * 2;
//   }
//   return n + difference;
// }


dynamoDB.sendDataToDynamoDB(temp);


// ****************************** MISC ***********************************

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});