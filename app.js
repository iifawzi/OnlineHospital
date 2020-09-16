const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const port = process.env.PORT || 5000;
const socketController = require("./controllers/socket");
const jobsController = require("./controllers/jobs");
require("./startup/models"); // indlude the db connection and models
require("./startup/routes")(app); // include routes
app.use('/images', express.static('uploadedImages'))
const server = http.createServer(app);
const io = socketio(server);
socketController.socket(io);
const jobsCaller = jobsController.upcomingTasks()(); // this will be called when the server restarts only (to re-set the scheduled tasks )
const init = server.listen(port, () => {
  console.log(`server is running at ${port}`);
});

module.exports = init;