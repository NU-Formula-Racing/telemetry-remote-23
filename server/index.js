// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.get("/api", (req, res) => {
  // read from csv into json?
  let message = {
    "test1": [(0, 11), (1, 13), (2, 31)], 
    "test2": [(0, 12), (1, 14), (2, 16)],
    "senosors": {
      "Sensor A": [(0, 1), (1, 2), (2, 3)],
      "Sensor B": [(0, 10), (1, 50), (2, 80)]
    }
  };
  res.json({ message:  message});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});