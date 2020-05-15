const express = require("express");
const { handleError } = require("../middleware/error"); // error middleware.
const authRouter = require("../routes/auth");
const bodyParser = require("body-parser");
module.exports = (app) => {
  // Main Settings
  app.use(bodyParser.json());
  // Routers:
  app.get("/api/test",(req,res,next)=>{
    res.send("I'm Working,");
  })
  app.use("/api/auth", authRouter);






  
  // Error handling
  app.use((err, req, res, next) => {
    handleError(err, res);
  });
};
