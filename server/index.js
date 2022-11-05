// server/index.js
const express = require("express");
const http = require("http");
const socketio = require('socket.io');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "http://localhost:3000", 
  credentials:true,            //access-control-allow-credentials:true
  // allowedHeaders: ["header"],
}
app.use(cors(corsOptions)) // Use this after the variable declaration


//-----------------socket.io-----------------

const server = http.createServer(app);

const io = socketio(server,{cors:{origin:"*"}});

var prev = new Array(10).fill(50)

// const sensors = ["FL WHEEL SPEED", "FR WHEEL SPEED", "BL WHEEL SPEED", "BR WHEEL SPEED", "FL BRAKE TEMP", 
// "FR BRAKE TEMP", "BL BRAKE TEMP", "BR BRAKE TEMP", "F BRAKE PRESSURE", "R BRAKE PRESSURE"];
const sensors = ["FL WHEEL SPEED", "FR WHEEL SPEED", "BL WHEEL SPEED", "BR WHEEL SPEED"];

io.on('connection', (socket) => {
  console.log(`${socket.id} client connected!`);

  setInterval(() => {
    dataObj = {}
    for (var i = 0; i < sensors.length; i++) {
      dataObj[sensors[i]] = {
        'val': getSmoothNumber(prev[i]),
        'time': Date.now() / 1000
      };
      prev[i] = dataObj[sensors[i]]['val'];
    }
    socket.emit('sendSensorData',  dataObj);
  }, 0.1 * 1000);
  
  socket.on('getSensors', (callback) => {
    initValues = {}
    for (var i = 0; i < sensors.length; i++) {
      initValues[sensors[i]] = [(0.01,0.01)];
    }
    callback(initValues);
  });

  socket.on('disconnect', () => {
    console.log('client disconnected');
  });
});


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



// app.get("getSensors", (req, res) => {
  
//   initValues = {}
//   for (var i = 0; i < sensors.length; i++) {
//     initValues[sensors[i]] = [(0,0)];
//   }

//   let message = {
//     "sensors": initValues
//   };
//   res.json({ message:  message});
// });

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});


