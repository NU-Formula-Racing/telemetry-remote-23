const C = require('./constants.js');

// start data list with init values based on bias
prev = []
C.SENSORS.forEach(sensor => { prev.push(0); }) // no bias now

// helper to generate fake data
function sendFakeData(socket, dataRepo, origin, sessionID) {
  if (typeof sessionID === 'undefined') { 
    console.log("session ID not set, need to reset session")
    return
  }
  dataObj = {}
  

  const now = new Date(); // Get current date and time
  const cstOffset = 0 * 60 * 60 * 1000; // Offset in milliseconds for CST time zone
  const cstTime = new Date(now.getTime() + cstOffset); // insert timezone adjusted unix timestamp here
  const hours = cstTime.getHours().toString().padStart(2, '0');
  const minutes = cstTime.getMinutes().toString().padStart(2, '0');
  const seconds = cstTime.getSeconds().toString().padStart(2, '0');
  const milliseconds = cstTime.getMilliseconds().toString().padStart(3, '0');

  const formattedTime = `${hours}:${minutes}:${seconds}.${milliseconds}`;

  for (var i = 0; i < C.NUM_OF_SENSORS; i++) {
    const curVal = getSmoothNumber(prev[i]);
    dataObj[C.SENSOR_NAMES[i]] = {
      'val': curVal,
      'time': formattedTime,
    };
    prev[i] = curVal;
    // save data to local database
    sqlDataObj = {
      sensorName: C.SENSOR_NAMES[i],
      sensorVal: curVal,
      timestamp: formattedTime,
      sessionId: sessionID
    }
    const { sensorName, sensorVal, timestamp, sessionId } = sqlDataObj
    // dataRepo.create(sensorName, sensorVal, timestamp, sessionId)
  }
  // send data to client
  console.log("testing: DataObj sending to client @ t=", formattedTime);
  // console.log(`\t${C.SENSOR_NAMES[0]}: ${dataObj[C.SENSOR_NAMES[0]].val}`)
  console.log(dataObj);
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