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
const DAO = require('./db/DAO.js')
const DataRepository = require('./db/DataRepository.js')
const SessionRepository = require('./db/SessionRepository.js')
// imports for custom modules
const C = require('./constants.js');
const testing = require('./testing.js');

// ***************** SETUP SERVER, SOCKETS & DB *****************
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
console.log('Starting express server...')
const app = express();
const PORT = process.env.PORT || 3001;
const corsOptions = {
  // why do we use port 63613 here?
  origin: "http://localhost:63613",
  credentials:true,            
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
const dao = new DAO(C.DB_PATH)
const sessionRepo = new SessionRepository(dao)
const dataRepo = new DataRepository(dao)

let sessionId // should store current sessionID
let sessionList // should store all available sessions on the 
// first create tables. if exist nothing happens
sessionRepo.createTable()
  .then(() => dataRepo.createTable())
  // .then(() => sessionRepo.deleteAll()) // clears previous data
  // .then(() => sessionRepo.create(`test session ${new Date().getHours()} : ${new Date().getMinutes()}`))
  // get sessionID
  // .then((dataId) => { sessionId = dataId })
  // register socket events
  .then(() => {
    io.on('connection', (socket) => {
      console.log(`${socket.id} client connected!`);

      // send sensor names and session list
      socket.on('startup', (callback) => {
        sessionRepo.getAll()
          .then((sessionData) => { sessionList = sessionData })
          .then(() => {
            initValues = {}
            for (var i = 0; i < C.NUM_OF_SENSORS; i++) { 
              // charts need 1 array per axis on graph 
              initValues[C.SENSORS[i].name] = [[0.01], [0.01]];
            }
            res = { initValues: initValues, sessionList: sessionList }
            callback(res);
          });
      });

      const mountSocketEmitters = (session_id) => {
        console.log(session_id)
        if (C.IS_TESTING){
          // FIXME: start time should refer to timestamp of session
          // if sessionId is not defined then data will be lost
          // potentially store in separate db first, then transfer? 
          setInterval(
            testing.sendFakeData, C.DATA_PERIOD * 1000, 
            socket, dataRepo, START_TIME, session_id
          )
        } else {
          // read data from serial port and send to client
          laptopPort.on('data', function (data) {
            console.log(data);
            emitData(data, socket);
          });
        }
      }

      // fetch sessionID send session data or empty session
      socket.on('initializeSession', (session_id, callback) => {
        sessionRepo.getById(session_id)
          .then((sessionData) => {
            if ((typeof sessionData === 'undefined') || sessionData.length === 0) {
              // create new session
              console.log('creating new session')
              const date = new Date();
              const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date)
              const sessionName = `Drive Session: ${month} ${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
              sessionRepo.create(sessionName)
              .then((dataId) => { 
                sessionId = dataId 
                console.log('session id: ', sessionId)
                console.log('data id: ', dataId)
                callback({ name: sessionName, data: [] })
                console.log('created new session')
                return dataId
              }).then(
                (session_id) => mountSocketEmitters(session_id)
              )
            } else {
              // fetch eisting session data
              console.log('fetching session data')
              sessionId = session_id;
              dataRepo.getBySessionId(session_id)
              .then((sessionData) => {
                // initialize the dictionary
                let sessionDataDict = {}
                for (var i = 0; i < C.NUM_OF_SENSORS; i++) {
                  sessionDataDict[C.SENSORS[i].name] = [[], []];
                }
                // populate the dictionary
                for (var i = 0; i < sessionData.length; i++) {
                  sessionDataDict[sessionData[i].sensorName][0].push(sessionData[i].timestamp);
                  sessionDataDict[sessionData[i].sensorName][1].push(sessionData[i].sensorVal);
                }
                // send the dictionary to the client
                callback({ name: sessionData[0].name, data: sessionDataDict })
                console.log('fetched session data')
                return session_id
              }).then(
                (session_id) => mountSocketEmitters(session_id)
              )
            }
          })
      });
      socket.on('deleteSession', (session_id) => {
        dataRepo.deleteBySession(session_id)
          .then(() => sessionRepo.delete(session_id))
          .then(() => {console.log(`session deleted ${session_id}`)} )
      });
      socket.on('disconnect', () => {
        console.log('client disconnected');
      });
    });
  })
  .catch((err) => { console.log('SQLite on create Error: ' + err) })

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