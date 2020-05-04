const express = require("express");
const http = require("http");
const app = express();
const port = process.env.PORT || 5000;

require("./startup/models"); // indlude the db connection and models
require("./startup/routes")(app); // include routes

const server = http.createServer(app);
const init = server.listen(port, () => {
  console.log(`server is running at ${port}`);
});

module.exports = init;
