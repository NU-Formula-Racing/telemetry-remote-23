// server/index.js
const express = require("express");
const http = require("http");
const socketio = require('socket.io');
const cors = require("cors");
const util = require('util');

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "http://localhost:3000", 
  credentials:true,            //access-control-allow-credentials:true
  // allowedHeaders: ["header"],
}
app.use(cors(corsOptions)) // Use this after the variable declaration

const origin = Date.now() / 1000;

//-----------------socket.io-----------------

const server = http.createServer(app);

const io = socketio(server,{cors:{origin:"*"}});

var prev = new Array(10).fill(50)

// const sensors = ["FL WHEEL SPEED", "FR WHEEL SPEED", "BL WHEEL SPEED", "BR WHEEL SPEED", "FL BRAKE TEMP", 
// "FR BRAKE TEMP", "BL BRAKE TEMP", "BR BRAKE TEMP", "F BRAKE PRESSURE", "R BRAKE PRESSURE"];
const sensors = ["FL WHEEL SPEED", "FR WHEEL SPEED"];

// used for sending data to aws DynamoDB
var sensorDataQueue = {};
sensors.forEach(sensor => { sensorDataQueue[sensor] = [] });

// socket connecting to 
io.on('connection', (socket) => {
  console.log(`${socket.id} client connected!`);
  var count = 1;
  setInterval(() => {
    dataObj = {}
    const curTime = Date.now() / 1000;

    for (var i = 0; i < sensors.length; i++) {
      const curVal = getSmoothNumber(prev[i]);
      const itemObj = { 
        L : [
          { S: (curTime - origin).toString() },
          { N: curVal.toString() }
        ]};
      sensorDataQueue[sensors[i]].push(itemObj);

      dataObj[sensors[i]] = {
        'val': curVal,
        'time': curTime
      };
      prev[i] = curVal;
    }
    count = count + 1;
    // console.log("ping");
    // sends data to client on sendSensorData event
    socket.emit('sendSensorData',  dataObj);
    // console.log(`PREPARE QUE ${util.inspect(sensorDataQueue, {showHidden: false, depth: null, colors: true})}`);
    // console.log(`PREPARE DAT ${util.inspect(dataObj, {showHidden: false, depth: null, colors: true})}`);
  }, 0.5 * 1000);
  
  // send list of sensor names and initial values to client
  socket.on('getSensors', (callback) => {
    initValues = {}
    for (var i = 0; i < sensors.length; i++) {
      initValues[sensors[i]] = [(0.01,0.01)];
    }
    callback(initValues);
  });

  socket.on('disconnect', () => {
    console.log('client disconnected');
  });
});

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

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});


