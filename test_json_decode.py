import json

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