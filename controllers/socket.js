const doctorsSocket = require("../sockets/doctors");
const usersSocket = require("../sockets/users");
exports.socket = (io)=>{
    doctorsSocket.doctors(io);
    usersSocket.users(io);
}