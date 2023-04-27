import serial
import json

# Change to your specific port (esp. on Windows) upon opening this document
# You can do this by looking for where your system stores ports and checking
# which one pops up when you connect the device
port = serial.Serial("/dev/tty.usbmodem115442501", 9600)
print("Connected to Serialport")

# Use manual interrupt (Ctrl-C) to terminate, because it won't do so otherwise
while True:
  # Checks if a new line is available from serialport; halts until there is one
  # It then decodes the ASCII-encoding into a String and removes the newline characters
  data = port.readline().decode("ascii").strip('\n\r')
  print(port.readline().decode("ascii"))
  
  # try:
  #   # Parse into JSON
  #   j = json.loads(data)
    
  #   # Display line (containing the full JSON) and a single JSON query
  #   print(data)
  #   print(j["fast"]["fl_wheel_speed"])
  # except:
  #   print("TESTING ERROR")