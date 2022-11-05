// server/index.js

const express = require("express");
const http = require("http");
const socketio = require('socket.io');
// const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// const corsOptions = {
//   origin: "http://localhost:3000", 
//   credentials:true,            //access-control-allow-credentials:true
//   allowedHeaders: ["header"],
// }
// app.use(cors(corsOptions)) // Use this after the variable declaration


//-----------------socket.io-----------------

const server = http.createServer(app);

const io = socketio(server,{cors:{origin:"*"}});

var prev = 50;

io.on('connection', (socket) => {
  console.log(`${socket.id} client connected!`);

  setInterval(() => {
    prev = prev + Math.floor(Math.random() * 20) - Math.floor(Math.random() * 20);
    if (prev < 0) {
      prev = Math.floor(Math.random() * 30);
    }
    if (prev > 100) {
      prev = 100 - Math.floor(Math.random() * 10);
    }
    dataObj = {
      "val": prev,
      "time": Date.now()/1000
    }
    socket.emit('sendSensorData',  dataObj);
  }, 0.1 * 1000);


  socket.on('disconnect', () => {
    console.log('client disconnected');
  });
});



app.get("/api", (req, res) => {
  // read from csv into json?
  let message = {
    "senosors": {
      "Sensor A": [(0, 1), (1, 2), (2, 3)],
      "Sensor B": [(0, 10), (1, 50), (2, 80)]
    }
  };
  res.json({ message:  message});
});

server.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});


