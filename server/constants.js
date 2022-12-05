//****************************** CONFIG ***************************************

const IS_TESTING = true;


//****************************** SENSORS ***************************************
class Sensor {
    constructor(name, type, bias, scale, bytes_length) {
        this.name = name;
        this.type = type;
        this.bias = bias;
        this.scale = scale;
        this.bytes_length = bytes_length;
    }
}

const FL_WEHEEL_SPEED = new Sensor("FL_WHEEL_SPEED", "float", 0, 0.1, 2);
const FR_WHEEL_SPEED = new Sensor("FR_WHEEL_SPEED", "float", 1, 0.1, 2);
const BL_WHEEL_SPEED = new Sensor("BL_WHEEL_SPEED", "float", 0, 0.1, 2);
const BR_WHEEL_SPEED = new Sensor("BR_WHEEL_SPEED", "float", 1, 0.1, 2);
const FL_BRAKE_TEMP = new Sensor("FL_BRAKE_TEMP", "float", 0, 0.1, 2);
const FR_BRAKE_TEMP = new Sensor("FR_BRAKE_TEMP", "float", 1, 0.1, 2);
const BL_BRAKE_TEMP = new Sensor("BL_BRAKE_TEMP", "float", 0, 0.1, 2);
const BR_BRAKE_TEMP = new Sensor("BR_BRAKE_TEMP", "float", 1, 0.1, 2);
const F_BRAKE_PRESSURE = new Sensor("F_BRAKE_PRESSURE", "int", 0, 1, 2);
const R_BRAKE_PRESSURE = new Sensor("R_BRAKE_PRESSURE", "int", 1, 1, 2);

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


module.exports = {
    IS_TESTING,
    NUM_OF_SENSORS, SENSOR_BYTE_LENGTH, SENSOR_NAMES, SENSORS, SENSOR_DICT
}