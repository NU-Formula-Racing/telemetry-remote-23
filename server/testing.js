const C = require('./constants.js');

function sendFakeData(socket) {
    dataObj = {}
    prev = []
    // start data list with init values based on bias
    C.SENSORS.forEach(sensor => { prev.push(sensor.bias); })
    const curTime = Date.now() / 1000;

    for (var i = 0; i < C.NUM_OF_SENSORS; i++) {
        const curVal = getSmoothNumber(prev[i]);
        dataObj[C.SENSOR_NAMES[i]] = {
            'val': curVal,
            'time': curTime
        };
        prev[i] = curVal;
    }
    
    socket.emit('sendSensorData',  dataObj);
}



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

module.exports = { sendFakeData }