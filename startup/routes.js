const express = require("express");
const mainRouter = require("../routes/mainRoutes");


module.exports = (app)=>{
    // for testing
    app.get("/", (req, res, next) => {
        res.send("<h1> Hello World!</h1>");
      });


// Routers:
      app.use("/api/", mainRouter);
}