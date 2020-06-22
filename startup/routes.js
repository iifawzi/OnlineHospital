const express = require("express");
const { handleError } = require("../middleware/error"); // error middleware.
const authRouter = require("../routes/auth");
const panelRouter = require("../routes/controlPanel");
const doctorsRouter = require("../routes/doctors");
const categoriesRouter = require("../routes/categories");
const userRouter = require("../routes/user");
const slotsRouter = require("../routes/slots");
const appointmentsRouter = require("../routes/appointments");
const prescriptionRouter = require("../routes/prescriptions");
const messagesRouter = require("../routes/messages");
const conferenceRouter = require("../routes/conferences");
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
  app.get("/api2/test",(req,res,next)=>{
    res.send("I'm Working,");
  })
  app.use("/api2/auth", authRouter);
  app.use("/api2/controlPanel", panelRouter);
  app.use("/api2/doctors", doctorsRouter);
  app.use("/api2/categories",categoriesRouter);
  app.use("/api2/user",userRouter);
  app.use("/api2/slots",slotsRouter);
  app.use("/api2/appointments",appointmentsRouter);
  app.use("/api2/messages",messagesRouter);
  app.use("/api2/prescriptions",prescriptionRouter);
  app.use("/api2/conference",conferenceRouter);






  
  // Error handling
  app.use((err, req, res, next) => {
    handleError(err, res);
  });
};
