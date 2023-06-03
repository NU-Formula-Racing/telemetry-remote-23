// imports for node modules
const express = require("express");
const http = require("http");
const cors = require("cors");
const socketio = require('socket.io');
const util = require('util');
const { SerialPort } = require('serialport')
const { ReadlineParser } = require('@serialport/parser-readline')
// const { autoDetect } = require('@serialport/bindings-cpp')
// const { DarwinBindingInterface } = require('@serialport/bindings');
// const Binding = autoDetect()
// const { Readline } = SerialPort.parsers.Readline;
// imports for AWS
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

// if (navigator.userAgent.indexOf('Mac OS X') != -1) {
//   alert("Mac"); // You can do whatever here
// } else {
//   alert("Windows"); // You can do whatever here
// }

// // Function for checking port availability
// console.log(SerialPort.list());

// configure and start serial port
var laptopPort = null;
var parser = null;
var connectedOnce = false;

var socketGlobal = null;
var dataRepoGlobal = null;
var session_id_global = null;

// reconnect variables
var reconneting = null;

async function connectPort(){
  // Find the port that is currently open
  var portList = await SerialPort.list()
  var portPath = null;
  
  for (var i = 0; i < portList.length; i++){

    // log the individual info for each port

    var check1 = portList[i].productId === '0483';
    var check2 = portList[i].vendorId === '16c0';
    var check3 = false;

    if (portList[i].manufacturer == 'Teensyduino'){
      check3 = true;
    } else if (portList[i].manufacturer == 'Microsoft'){
      check3 = portList[i].friendlyName && portList[i].friendlyName.includes('USB Serial Device');
    }

    if (check1 && check2 && check3){
      console.log("[Startup 1/2] On Start Up: Found port")
      portPath = portList[i].path;
      break;
    }
  }

  if (portPath === null){
    console.log("[Fail] No port found... First connect -> Restart prcoess, Reconnect -> Reconnect Teensy")
    return
  }

  await new Promise((resolve) => {
    laptopPort = new SerialPort({
      path: portPath,
      baudRate: 9600,
      }, async function (err) { 
        if (err) {
          console.log('[Fail] SerialPort Error on create: ', err.message)
          resolve("failed");
        } else {
          console.log('[Startup Check] SerialPort created successfully')
        }
    });
    resolve();
  });

  await new Promise((resolve) => {
    laptopPort.on('open', function () {
      console.log('[Startup 2/2] Port opened on ' + laptopPort.path);
      connectedOnce = true;
      resolve();
    })
  });

  await new Promise((resolve) => {
    parser = laptopPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    resolve();
  });

  // Now return promise
  return new Promise((resolve, reject) => {
    resolve("success");
  });
}

function onCloseHandle(){
  laptopPort.on('close', function(err){
    console.log('[Disconnected] Port closed');
    
    // Try to reconnect every 3 seconds
    reconnecting = setInterval(function(){
      console.log('[Reconnecting] Trying to reconnect...');

      // check if port has been reconnected
      connectPort().then((message) => {
        // Check if port has been reconnected
        if (message === "success"){
          console.log("*** PORT RECONNECTED ***");
          readDataFromPort(socketGlobal, dataRepoGlobal, session_id_global);
          onCloseHandle();
          clearInterval(reconnecting);
        }
      });
    }, 3000);
  });
}


// Async Function for start up
async function startUp(){

  // Some space for consolelog
  console.log();
  console.log("***************** STARTING UP *****************");

  if (!C.IS_TESTING){

    // Handle port disconnects
    // NOTE: Connect port is an async function made to connect port
    connectPort().then((message) => {

      if (message === "failed"){
        return;
      }

      console.log("*** PORT CONNECTED ***");

      onCloseHandle();
    });
  }
}

// Start up FOR THE FIRST TIME <------
startUp();

// configure and start node.js server
console.log('Starting express server...')
const app = express();
const PORT = process.env.PORT || 3001;
const corsOptions = {
  // why do we use port 63613 here?
  origin: "http://localhost:50945",
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
            sensorMetaDataDict = {}
            for (var i = 0; i < C.NUM_OF_SENSORS; i++) { 
              // charts need 1 array per axis on graph 
              sensorMetaDataDict[C.SENSORS[i].name] = {
                unit: C.SENSORS[i].unit,
                max: C.SENSORS[i].max,
                warning: C.SENSORS[i].warning,
              };
            }
            res = { initValues: initValues, sessionList: sessionList, sensorMetaData: sensorMetaDataDict }
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
          socketGlobal = socket;
          dataRepoGlobal = dataRepo;
          session_id_global = session_id;
          readDataFromPort(socket, dataRepo, session_id);

          console.log("Data is sending....");
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
                sensorMetaDataDict = {}
                for (var i = 0; i < C.NUM_OF_SENSORS; i++) { 
                  // charts need 1 array per axis on graph 
                  sensorMetaDataDict[C.SENSORS[i].name] = {
                    unit: C.SENSORS[i].unit,
                    max: C.SENSORS[i].max,
                    warning: C.SENSORS[i].warning,
                  };
                }
                callback({ name: sessionName, data: [], sensorMetaData: sensorMetaDataDict })
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
                sensorMetaDataDict = {}
                for (var i = 0; i < C.NUM_OF_SENSORS; i++) { 
                  // charts need 1 array per axis on graph 
                  sensorMetaDataDict[C.SENSORS[i].name] = {
                    unit: C.SENSORS[i].unit,
                    max: C.SENSORS[i].max,
                    warning: C.SENSORS[i].warning,
                  };
                }
                // send the dictionary to the client
                callback({ name: sessionData[0].name, data: sessionDataDict, sensorMetaData: sensorMetaDataDict })
                console.log('fetched session data')
                return session_id
              }).then(
                // start feeding live data
                (session_id) => mountSocketEmitters(session_id)
              )
            }
          })
      });
      socket.on('fetchSessionData', (callback) => {
        sessionRepo.getAll()
          .then((sessionData) => { callback(sessionData) })
      })
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

// Issues to discuss with Marco
// 1. How to pipe the data from serial port to io port? 2 infinite loops issue [DONE]
// 2. Port 3000 problem, always on [DONE]
// 3. Naming Standard for Sensors [DONE]

function readDataFromPort(socket, dataRepo, sessionID) {

  console.log("[PARSER] Parser On")

  parser.on('data', function(data){

    // Attempt to parse the data into JSON format first
    try{

      let jsonObj = JSON.parse(data);

      // console.log(jsonObj);

      let processedData = processData(jsonObj, dataRepo, sessionID);

      // console.log(processedData);

      emitData(processedData, socket); // emit data to client

      // now send data to client on sendSensorData event
    } catch (e) {
      // console.log("Error parsing data: ", e); // mute the error for now
    }
  })
}


// ****************************** DATA PROCESSING ***************************************
// Helper to proces and emit data into the socket
function emitData(data, socket) {

  // dynamoDBHelper.sendDataToDynamoDB(dataObj);
  // console.log(data);

  // send data to client on sendSensorData event
  socket.emit('sendSensorData', data);
}

// dataJsonObj (dictionary) -> socketDataType
function processData(jsonObj, dataRepo, sessionID){

  const formattedData = {};

  const now = new Date(); // Get current date and time
  const cstOffset = 0 * 60 * 60 * 1000; // Offset in milliseconds for CST time zone
  var currentTime = new Date(0); // use rtc time, from 
  currentTime = currentTime.setUTCSeconds(jsonObj['rtc']);
  const cstTime = new Date(currentTime + cstOffset); // insert timezone adjusted unix timestamp here
  const hours = cstTime.getHours().toString().padStart(2, '0');
  const minutes = cstTime.getMinutes().toString().padStart(2, '0');
  const seconds = cstTime.getSeconds().toString().padStart(2, '0');
  const milliseconds = cstTime.getMilliseconds().toString().padStart(3, '0');

  const formattedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;

  // Process Data first (no longer distinguish data for fast and slow)
  for (var i = 0; i < C.SENSORS.length; i++) {

    let key = C.SENSOR_NAMES[i];
    let sensorName = key;
    let sensorVal = jsonObj[key];

    // Handle Null Values Form the Car
    // NOTE: This may have issues with the graph if the scale is weird
    if (sensorVal == null) {
      // sensorVal = 0;// default to 0 right now for null values to ensure the graph still works
      continue;
    }

    sensorVal = parseFloat(sensorVal.toFixed(2));

    formattedData[key] = {
      'val': sensorVal,
      'time': formattedTime,
    };

    dataRepo.create(sensorName, sensorVal, formattedTime, sessionID)

  }

  // needs to add slow data here
  return formattedData;
}



// ****************************** DYNAMODB CODE ***********************************
