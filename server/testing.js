const C = require('./constants.js');

// start data list with init values based on bias
prev = []
C.SENSORS.forEach(sensor => { prev.push(sensor.bias); })

// helper to generate fake data
function sendFakeData(socket, dataRepo, origin, sessionID) {
  if (typeof sessionID === 'undefined') { 
    console.log("session ID not set, need to reset session")
    return
  }
  dataObj = {}
  const curTime = Date.now() / 1000
  const time = Math.floor((curTime - origin) * 10) / 10;
  for (var i = 0; i < C.NUM_OF_SENSORS; i++) {
    const curVal = getSmoothNumber(prev[i]);
    dataObj[C.SENSOR_NAMES[i]] = {
      'val': curVal,
      'time': time,
    };
    prev[i] = curVal;
    // save data to local database
    sqlDataObj = {
      sensorName: C.SENSOR_NAMES[i],
      sensorVal: curVal,
      timestamp: time,
      sessionId: sessionID
    }
    const { sensorName, sensorVal, timestamp, sessionId } = sqlDataObj
    dataRepo.create(sensorName, sensorVal, timestamp, sessionId)
  }
  // send data to client
  console.log("testing: DataObj sending to client @ t=", curTime);
  // console.log(`\t${C.SENSOR_NAMES[0]}: ${dataObj[C.SENSOR_NAMES[0]].val}`)
  socket.emit('sendSensorData',  dataObj);
}


function getSmoothNumber(n) {
  const scale = 10;
  const lowerBound = 0;
  const upperBound = 100;

  let difference = Math.floor(Math.random() * scale) - Math.floor(Math.random() * scale);
  if ((n + difference < lowerBound) || (n + difference > upperBound)) {
    difference *= -1;
  }

  return n + difference;
}

module.exports = { sendFakeData }