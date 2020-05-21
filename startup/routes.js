const express = require("express");
const { handleError } = require("../middleware/error"); // error middleware.
const authRouter = require("../routes/auth");
const panelRouter = require("../routes/controlPanel");
const bodyParser = require("body-parser");
const cors = require("cors");
module.exports = (app) => {
  // Main Settings
  app.use(cors());
  app.use(bodyParser.json());
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
// 
app.use( // for images uploading: 
  bodyParser.urlencoded({extended: false})
);
  
  // Routers:
  app.get("/api/test",(req,res,next)=>{
    res.send("I'm Working,");
  })
  app.use("/api/auth", authRouter);
  app.use("/api/controlPanel", panelRouter);






  
  // Error handling
  app.use((err, req, res, next) => {
    handleError(err, res);
  });
};
