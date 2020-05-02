const express = require("express");
const { handleError, ErrorHandler } = require("../middleware/error"); // error middleware.
const mainRouter = require("../routes/mainRoutes");

module.exports = (app) => {
  
  // Routers:
  app.use("/api/", mainRouter);

  // Error handling
  app.use((err, req, res, next) => {
    handleError(err, res);
  });
};
