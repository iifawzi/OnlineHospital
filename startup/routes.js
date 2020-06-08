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
  app.use("/api/doctors", doctorsRouter);
  app.use("/api/categories",categoriesRouter);
  app.use("/api/user",userRouter);
  app.use("/api/slots",slotsRouter);
  app.use("/api/appointments",appointmentsRouter);
  app.use("/api/messages",messagesRouter);
  app.use("/api/prescriptions",prescriptionRouter);






  
  // Error handling
  app.use((err, req, res, next) => {
    handleError(err, res);
  });
};
