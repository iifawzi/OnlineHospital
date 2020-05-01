const express = require("express");
const config = require("config");
const http = require("http");
const app = express();
const port = process.env.PORT || 5000;

require("./startup/routes")(app);  // include routes
require("./startup/db")() // indlude the db connection 
const server = http.createServer(app);
const init = server.listen(port, ()=>{
    console.log(`server is running at ${port}`);
} );

module.exports = init;