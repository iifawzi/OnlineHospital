const mainSocket = require("../sockets/mainSocket");
exports.socket = (io)=>{
    mainSocket.main(io);
}