//****************************** CONFIG ***************************************

const DB_PATH = './server/db/database.sqlite3'
const IS_TESTING = false; // If we are in testing mode currently or not
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

// Wheel Related
const fl_wheel_speed = new Sensor("fl_wheel_speed", "float", "mph", 200, 150);
const fr_wheel_speed = new Sensor("fr_wheel_speed", "float", "mph", 200, 150);
const bl_wheel_speed = new Sensor("bl_wheel_speed", "float", "mph", 200, 150);
const br_wheel_speed = new Sensor("br_wheel_speed", "float", "mph", 200, 150);
const rpm = new Sensor("rpm", "float", "rpm", 10000, 8000);

// Brake Related
const fl_brake_temperature = new Sensor("fl_brake_temperature", "float", "C", 200, 150);
const fr_brake_temperature = new Sensor("fr_brake_temperature", "float", "C", 200, 150);
const bl_brake_temperature = new Sensor("bl_brake_temperature", "float", "C", 200, 150);
const br_brake_temperature = new Sensor("br_brake_temperature", "float", "C", 200, 150);
const front_brake_pressure = new Sensor("front_brake_pressure", "int", "psi", 200, 150);
const rear_brake_pressure = new Sensor("rear_brake_pressure", "int", "psi", 200, 150);

// Battery Related
const hv_battery_voltage = new Sensor("hv_battery_voltage", "float", "V", 60, 40);
const hv_battery_temperature = new Sensor("hv_battery_temperature", "float", "C", 50, 40);
const hv_battery_current = new Sensor("hv_battery_current", "float", "A", 600, 400);
const hv_max_discharge_current = new Sensor("hv_max_discharge_current", "float", "A", 800, 600);
const hv_max_regen_current = new Sensor("hv_max_regen_current", "float", "A", 400, 300);
const hv_stat_of_charge = new Sensor("hv_stat_of_charge", "float", "%", 100, 80);

// Motor Related
const motor_temperature = new Sensor("motor_temperature", "float", "C", 120, 90);

// Misc
const accel_x = new Sensor("accel_x", "float", "G", 20, 15);
const accel_y = new Sensor("accel_y", "float", "G", 20, 15);
const accel_z = new Sensor("accel_z", "float", "G", 20, 15);
const gyro_x = new Sensor("gyro_x", "float", "rad/s", 3, 2); // check
const gyro_y = new Sensor("gyro_y", "float", "rad/s", 3, 2); // check
const gyro_z = new Sensor("gyro_z", "float", "rad/s", 3, 2); // check
const latitude = new Sensor("latitude", "float", "deg", 180, -180); // check
const longitude = new Sensor("longitude", "float", "deg", 180, -180); // check
const tractile_system_status = new Sensor("tractile_system_status", "bool", "", 1, 0); // enum?
const coolant_flow = new Sensor("coolant_flow", "float", "L/min", 10, 5); // check

// Real Time Clock
const rtc = new Sensor("rtc", "int", "sec", 86400, 0);

// Mechanical Percentages
const accel_percentage = new Sensor("accel_percentage", "float", "%", 100, 80); // check
const brake_percentage = new Sensor("brake_percentage", "float", "%", 100, 80); // check

// Temperatures
const coolant_temperature = new Sensor("coolant_temperature", "float", "C", 120, 90);
const ambient_temperature = new Sensor("ambient_temperature", "float", "C", 50, 40);
const inverter_temperature = new Sensor("inverter_temperature", "float", "C", 120, 90);


// const SENSORS = [
//     fl_wheel_speed, fr_wheel_speed, bl_wheel_speed, br_wheel_speed,
//     fl_brake_temperature, fr_brake_temperature, bl_brake_temperature, br_brake_temperature,
//     front_brake_pressure, rear_brake_pressure, 
// ];

const SENSORS = [
    fl_wheel_speed, fr_wheel_speed, bl_wheel_speed, br_wheel_speed,
    rpm,
    fl_brake_temperature, fr_brake_temperature, bl_brake_temperature, br_brake_temperature,
    front_brake_pressure, rear_brake_pressure,
    hv_battery_voltage, hv_battery_temperature, hv_battery_current, hv_max_discharge_current, hv_max_regen_current,
    motor_temperature,
    accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z,
    latitude, longitude,
    tractile_system_status,
    rtc,
    accel_percentage, brake_percentage,
    coolant_temperature, ambient_temperature
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