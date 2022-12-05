const C = require('./constants.js');

// start data list with init values based on bias
prev = []
C.SENSORS.forEach(sensor => { prev.push(sensor.bias); })

function sendFakeData(socket) {
  dataObj = {}
  const curTime = Date.now() / 1000;

  for (var i = 0; i < C.NUM_OF_SENSORS; i++) {
      const curVal = getSmoothNumber(prev[i]);
      dataObj[C.SENSOR_NAMES[i]] = {
          'val': curVal,
          'time': curTime
      };
      prev[i] = curVal;
  }
  console.log("DataObj sending to client: ", dataObj);
  socket.emit('sendSensorData',  dataObj);
}



function getSmoothNumber(n) {
  const scale = 3;
  const lowerBound = 0;
  const upperBound = 100;

  let difference = Math.floor(Math.random() * scale) - Math.floor(Math.random() * scale);
  if (n + difference < lowerBound) {
    difference = scale * 2;
  }
  if (n + difference > upperBound) {
    difference = - scale * 2;
  }
  return n + difference;
}

module.exports = { sendFakeData }