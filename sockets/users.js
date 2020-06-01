exports.users = (io)=>{
    const users = io
    .of("/users")
    .on("connection",(socket)=>{
        console.log("New User joined",socket.id);

        setTimeout(() => socket.disconnect(true), 5000);

        // When Socket disconnects delete his info: 
        socket.on("disconnect",()=>{
console.log("User disconnected");
        })
    })
}