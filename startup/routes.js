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
  app.use("/maryoma/auth", authRouter);
  app.use("/maryoma/controlPanel", panelRouter);
  app.use("/maryoma/doctors", doctorsRouter);
  app.use("/maryoma/categories",categoriesRouter);
  app.use("/maryoma/user",userRouter);
  app.use("/maryoma/slots",slotsRouter);
  app.use("/maryoma/appointments",appointmentsRouter);
  app.use("/maryoma/messages",messagesRouter);
  app.use("/maryoma/prescriptions",prescriptionRouter);
  app.use("/maryoma/conference",conferenceRouter);






  
  // Error handling
  app.use((err, req, res, next) => {
    handleError(err, res);
  });
};
