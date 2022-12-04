const s = require('./Sensor.js');

//*** Sensor constants ***//
// args: sensorName, type, bias, scale, bytes_length
const FL_WEHEEL_SPEED = new s.Sensor("FL_WHEEL_SPEED", "float", 0, 0.1, 2);
const FR_WHEEL_SPEED = new s.Sensor("FR_WHEEL_SPEED", "float", 1, 0.1, 2);
const BL_WHEEL_SPEED = new s.Sensor("BL_WHEEL_SPEED", "float", 0, 0.1, 2);
const BR_WHEEL_SPEED = new s.Sensor("BR_WHEEL_SPEED", "float", 1, 0.1, 2);
const FL_BRAKE_TEMP = new s.Sensor("FL_BRAKE_TEMP", "float", 0, 0.1, 2);
const FR_BRAKE_TEMP = new s.Sensor("FR_BRAKE_TEMP", "float", 1, 0.1, 2);
const BL_BRAKE_TEMP = new s.Sensor("BL_BRAKE_TEMP", "float", 0, 0.1, 2);
const BR_BRAKE_TEMP = new s.Sensor("BR_BRAKE_TEMP", "float", 1, 0.1, 2);
const F_BRAKE_PRESSURE = new s.Sensor("F_BRAKE_PRESSURE", "int", 0, 1, 2);
const R_BRAKE_PRESSURE = new s.Sensor("R_BRAKE_PRESSURE", "int", 1, 1, 2);

const SENSORS = [
    FL_WEHEEL_SPEED, FR_WHEEL_SPEED, BL_WHEEL_SPEED, BR_WHEEL_SPEED,
    FL_BRAKE_TEMP, FR_BRAKE_TEMP, BL_BRAKE_TEMP, BR_BRAKE_TEMP,
    F_BRAKE_PRESSURE, R_BRAKE_PRESSURE
]

const NUM_OF_SENSORS = SENSORS.length;
const SENSOR_BYTE_LENGTH = NUM_OF_SENSORS*2;

var SENSOR_NAMES = []
SENSORS.forEach(sensor => { SENSOR_NAMES.push(sensor.name); })
var SENSOR_DICT = {}
SENSORS.forEach(sensor => { SENSOR_DICT[sensor.name] = sensor; })



//*** Serial Port Constants ***//


module.exports = {
    NUM_OF_SENSORS, SENSOR_BYTE_LENGTH, SENSOR_NAMES, SENSORS, SENSOR_DICT
}