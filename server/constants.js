//****************************** CONFIG ***************************************

const DB_PATH = './server/db/database.sqlite3'
const IS_TESTING = true; // If we are in testing mode currently or not
const DATA_PERIOD = 0.2; // seconds


//****************************** SENSORS ***************************************
class Sensor {
    constructor(name, type, unit, max, warning) {
        this.name = name;
        this.type = type;
        this.unit = unit;
        this.max = max;
        this.warning = warning;
    }
}

const fl_wheel_speed = new Sensor("fl_wheel_speed", "float", "mph", 200, 150);
const fr_wheel_speed = new Sensor("fr_wheel_speed", "float", "mph", 200, 150);
const bl_wheel_speed = new Sensor("bl_wheel_speed", "float", "mph", 200, 150);
const br_wheel_speed = new Sensor("br_wheel_speed", "float", "mph", 200, 150);
const fl_brake_temperature = new Sensor("fl_brake_temperature", "float", "F", 200, 150);
const fr_brake_temperature = new Sensor("fr_brake_temperature", "float", "F", 200, 150);
const bl_brake_temperature = new Sensor("bl_brake_temperature", "float", "F", 200, 150);
const br_brake_temperature = new Sensor("br_brake_temperature", "float", "F", 200, 150);
const front_brake_pressure = new Sensor("front_brake_pressure", "int", "psi", 200, 150);
const rear_brake_pressure = new Sensor("rear_brake_pressure", "int", "psi", 200, 150);


const SENSORS = [
    fl_wheel_speed, fr_wheel_speed, bl_wheel_speed, br_wheel_speed,
    fl_brake_temperature, fr_brake_temperature, bl_brake_temperature, br_brake_temperature,
    front_brake_pressure, rear_brake_pressure
];


const NUM_OF_SENSORS = SENSORS.length;
const SENSOR_BYTE_LENGTH = NUM_OF_SENSORS*2;

var SENSOR_NAMES = []
SENSORS.forEach(sensor => { SENSOR_NAMES.push(sensor.name); })
var SENSOR_DICT = {}
SENSORS.forEach(sensor => { SENSOR_DICT[sensor.name] = sensor; })


module.exports = {
    IS_TESTING, DATA_PERIOD, DB_PATH,
    NUM_OF_SENSORS, SENSOR_BYTE_LENGTH, SENSOR_NAMES, SENSORS, SENSOR_DICT
}