import json

# Example of a JSON object, 34 sensor values
# {
#     "fast": {
#         "fl_wheel_speed": 0.0, [ok]
#         "fr_wheel_speed": 0.0, [ok]
#         "bl_wheel_speed": 0.0, [ok]
#         "br_wheel_speed": 0.0, [ok]
#         "hv_battery_voltage": 0.0, [ok]
#         "motor_temperature": 0.0, [ok]
#         "accel_x": 0.48, [ok]
#         "accel_y": -0.38, [ok]
#         "accel_z": 0.81, [ok]
#         "gyro_x": 0.12, [ok]
#         "gyro_y": -0.61, [ok]
#         "gyro_z": -0.05, [ok]
#         "latitude": 0, [ok]
#         "longitude": 0, [ok]
#         "rpm": 0.0, [ok]
#         "hv_battery_current": 0.0, [ok]
#         "hv_max_discharge_current": 0.0, [ok]
#         "hv_max_regen_current": 0.0, [ok]
#         "rtc": 0, [ok]
#         "front_brake_pressure": 0, [ok]
#         "rear_brake_pressure": 0, [ok]
#         "hv_battery_temperature": 0, [ok]
#         "tractile_system_status": 0, [ok] 
#         "accel_percentage": 0, [ok]
#         "brake_percentage": 0, [ok]
#     },
#     "slow": {
#         "coolant_temperature": 0.0, [ok]
#         "fl_brake_temperature": -0.0, [ok]
#         "fr_brake_temperature": 0.0, [ok]
#         "bl_brake_temperature": 0.0, [ok]
#         "br_brake_temperature": 0.0, [ok]
#         "ambient_temperature": 0.0, [ok]
#         "inverter_temperature": 0.0, [ok]
#         "coolant_flow": 0.0, [ok]
#         "hv_state_of_charge": 0 [ok]
#     },
# }

# Given a string object, parse it into JSON, then print it
json_str = """{"fast":
                {"fl_wheel_speed":0.00,
                "fr_wheel_speed":0.00,
                "bl_wheel_speed":0.00,
                "br_wheel_speed":0.00,
                "hv_battery_voltage":0.00,
                "motor_temperature":0.00,
                "accel_x":0.05,
                "accel_y":-0.00,
                "accel_z":1.00,
                "gyro_x":0.24,
                "gyro_y":-0.51,
                "gyro_z":0.00,
                "latitude":0,
                "longitude":0,
                "rpm":0.00,
                "hv_battery_current":0.00,
                "hv_max_discharge_current":0.00,
                "hv_max_regen_current":0.00,
                "rtc":0,"front_brake_pressure":0,
                "rear_brake_pressure":0,
                "hv_battery_temperature":0,
                "tractile_system_status":0,
                "accel_percentage":0,
                "brake_percentage":0},
            "slow":
                {"coolant_temperature":0.00,
                "fl_brake_temperature":0.00,
                "fr_brake_temperature":0.00,
                "bl_brake_temperature":0.00,
                "br_brake_temperature":0.00,
                "ambient_temperature":0.00,
                "inverter_temperature":0.00,
                "coolant_flow":0.00,
                "hv_state_of_charge":0}
            }"""

json_obj = json.loads(json_str)

print(json_obj)