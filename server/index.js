/***
TODO:
- use SQLite to persist data
  - button to reset data in the client for every new session
  - button to start new session and end current session
  - button to remove old data? 

- Use charts.js to display data
  - revamp the entire UI

- Features:
  - automatically rescaling on new data
  - easy scrolling and zooming
  - can move and display graphs easily
  - overlay graphs
  - display number and names clearly
  - make display longer and can stack more
  - have different tabs with different views

- Secondary:
  - add separate live data view with only numbers
  - try to make it look like images online
  - containerize + k8s for better reliability and easier deployment?
  - electron app for desktop? Can also use batch file to run the app
  - button to restart server? 
  - show server logs on client side
***/
// imports for node modules
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require('socket.io');
const util = require('util');
const { SerialPort } = require("serialport");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const dynamoDBHelper = require('./dynamodb.js');
// imports for SQLite
const DAO = require('./database/DAO.js')
const DataRepository = require('./database/DataRepository.js')
const SessionRepository = require('./database/SessionRepository.js')
// imports for custom modules
const C = require('./constants.js');
const testing = require('./testing.js');

// define serial port
// List of all possible ports as far as we know:
// 1. /dev/tty.usbmodem115442301
const laptopPort = new SerialPort({
  path: '/dev/tty.usbmodem115442301',
  baudRate: 9600
  }, function (err) { 
    if (err) {
      return console.log('SerialPort Error on create: ', err.message)
    }
});

// configure and start node.js server
const app = express();
const PORT = process.env.PORT || 3001;
const corsOptions = {
  // why do we use port 63613 here?
  origin: "http://localhost:63613",
  credentials:true,            //access-control-allow-credentials:true
  // allowedHeaders: ["header"],
}
app.use(cors(corsOptions))

// configure and start websocket server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
const io = socketio(server,{cors:{origin:"*"}});

const START_TIME = Date.now() / 1000;

// configure and build sqlite tables
const dao = new DAO('./database.sqlite3')
const sessionRepo = new SessionRepository(dao)
const dataRepo = new DataRepository(dao)
// sessionId needs to be accesssed globally
let sessionId
sessionRepo.createTable()
  .then(() => dataRepo.createTable())
  .then(() => sessionRepo.create("test session"))
  .then((dataId) => {
    sessionId = dataId
    const sensorData = [
      {
        sensorName: 'sensor1',
        sensorVal: 1.01,
        timestamp: Date.now(),
        sessionId: sessionId
      },
      {
        sensorName: 'sensor2',
        sensorVal: 2.02,
        timestamp: Date.now(),
        sessionId: sessionId
      },
    ]
    // treat each dataRepo.create as a promise
    return Promise.all(sensorData.map((data) => {
      const { sensorName, sensorVal, timestamp, sessionId } = data
      return dataRepo.create(sensorName, sensorVal, timestamp, sessionId)
    }))
  })
  .then(() => sessionRepo.getById(sessionId))
  .then((fetchedSession) => {
    console.log(`\nRetreived session from database`)
    console.log(`session id = ${fetchedSession.id}`)
    console.log(`session name = ${fetchedSession.name}`)
    return dataRepo.getBySessionId(sessionId)
  })
  .then((fetchedData) => {
    console.log(`\nRetreived data from database`)
    fetchedData.forEach((data) => {
      const { sensorName, sensorVal, timestamp, sessionId } = data
      console.log(`sensorName = ${sensorName}`)
      console.log(`sensorVal = ${sensorVal}`)
      console.log(`timestamp = ${timestamp}`)
      console.log(`sessionId = ${sessionId}`)
    })
  })
  .catch((err) => {
    console.log('Error: ')
    console.log(JSON.stringify(err))
  })

// Miscellaneous - Real
// const scale = 10;
// const bias = -40;


// Notes:
// 1. First 8 shorts -> floats
// 2. Next 3 shorts -> integers

// Check if data reading in from port is erroring
// laptopPort.open(function(err) {
//   if (err) {
//     return console.log('Error opening port: ', err.message);
//   }
// })

// ****************************** SOCKET IO LISTENER ***************************************
io.on('connection', (socket) => {
  console.log(`${socket.id} client connected!`);

  // send list of sensor names and initial values to client
  socket.on('getSensors', (callback) => {
    initValues = {}
    for (var i = 0; i < C.NUM_OF_SENSORS; i++) {
      initValues[C.SENSORS[i].name] = [(0.01,0.01)];
    }
    callback(initValues);
  });

  // send sensor data to client
  if (C.IS_TESTING){
    // send generated data to client on 1s interval
    setInterval(testing.sendFakeData, C.DATA_PERIOD * 1000, socket)
  } else {
    // read data from serial port and send to client
    laptopPort.on('data', function (data) {
      console.log(data);
      emitData(data, socket);
    });
  }

  socket.on('disconnect', () => {
    console.log('client disconnected');
  });
});

// ****************************** DATA PROCESSING ***************************************
// Helper to proces and emit data into the socket
function emitData(data, socket) {
  if (data.length <= 1){
    return;
  }
  console.log("Raw data input: ", data.toString());

  // dataObj (dictionary): sensorName -> dataList
  // dataList (array): [...,[time, val],...]
  let dataObj = dataSlicing(data);
  console.log("DataObj sending to client: ", dataObj);

  // TODO: need to change this to use persistent data
  dynamoDBHelper.sendDataToDynamoDB(dataObj);

  // send data to client on sendSensorData event
  socket.emit('sendSensorData',  dataObj);
}

// preprocess raw data from bytes array into dataobj dictionary
function dataSlicing(data){
  let dataObj = {};
  // FIXME: should use timestamp from the data instead
  const curTime = Date.now() / 1000;

  info_ind = 0; // index for the miscellaneous information arrays
  i = 1; // data index

  // while loop for getting data
  while (i < data.length){

    // break after reaching terminating bit 
    if (i == data.length - 1){
      break;
    }

    const sensor = C.SENSORS[info_ind];

    let value = data[i].toString(2) + data[i-1].toString(2); // little endian
    value = processData(value, sensor);
    dataObj[sensor.name] = {
      'val': value,
      'time': curTime - START_TIME,
    }

    // Iteratior increment
    i += sensor.bytes_length // increment with current data value length
    info_ind += 1;
  }
  
  return dataObj;
}

// process byte data into float/int
function processData(value, sensor){
  // value -> the data in bytes
  // type -> type of data, int or float
  let type = sensor.type;
  let bias = sensor.bias;

  if (type == "int"){
    // process to int
    return parseInt(value, 2);
  } else if (type == "float"){
    // process to float
    return parseInt(value, 2)*scale + bias;
  }
  // default return 0
  return 0
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


// dynamoDBHelper.sendDataToDynamoDB(temp);


// ****************************** MISC ***********************************

