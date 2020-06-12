const moment = require('moment'); 
const {addNewMessage,messagesFromRoom} = require("../models/messages");
const upload = require("../middleware/upload");

exports.main = (io)=>{
    io
    .on("connect",(socket)=>{
////////////////////////////////////////////////////////// ? JOINING THE SYSTEM //////////////////////////////////////////////////////////////////

        // `Doctor joined the system`:  
        socket.on("doctorJoined",(doctor_id,name,end_time)=>{
            // TIME SETTINGS: 
            let currentTime = moment().utc();
            let finish_time = moment(end_time).utc();
            let remainingTime = finish_time.diff(currentTime,true);  // in milliseconds
            setTimeout(() => socket.disconnect(true), remainingTime);
            setInterval(() => {
                socket.emit("time",remainingTime-=1000);
            }, 1000);
            // END TIME SETTINGS 

            socket.role = "doctor";
            socket.name = name;
            socket.myId = doctor_id;
        })

      // `User joined the system`:  
        socket.on("userJoined",(user_id,name,end_time)=>{
                        // TIME SETTINGS: 
                        let currentTime = moment().utc();
                        let finish_time = moment(end_time).utc();
                        let remainingTime = finish_time.diff(currentTime,true);  // in milliseconds
                        setTimeout(() => socket.disconnect(true), remainingTime);
                        setInterval(() => {
                            socket.emit("time",remainingTime-=1000);
                        }, 1000);
                        // END TIME SETTINGS 

            socket.role = "user";
            socket.name = name;
            socket.myId = user_id;
        })

////////////////////////////////////////////////////////// ? ROOMS AREA ////////////////////////////////////////////////////////////////////////

//  `Join User a room` 
socket.on("joinUserToRoom", (room_id)=>{
    socket.join(room_id);
    socket.currentRoom = room_id;
    if (getRoomInfo(room_id) == null){
        try {
            addRoom(room_id);
        }catch {
            console.log("error adding room");
        }
    }
    try {
        addUserToRoom(room_id);
    }catch {
        console.log("error adding user to room");
    }
    const oldMessages = messagesFromRoom(socket.currentRoom).then(messages=>{
        if (messages.length != 0){
            messages.map(msg=>{
                if (msg.type === 'message'){
                    socket.emit("message", {user:msg.sender_name,message:msg.message,role:msg.sender});
                }else if(msg.type === 'image') {
                    socket.emit("imageUploaded", {user:msg.sender_name,image:msg.message,role:msg.sender});
                }
               
            });
        }
    socket.emit("message",{user:"System", message:"Welcome to the clinic.",role:"system"})
    // if doctor is still not connected to the room: 
    if (isDoctorInRoom(room_id) == null){
    socket.emit("message",{user:"System", message:"Doctor is not available, please wait.",role:"system"});
    }else {   // if doctor is connected to the system:
        socket.emit("message",{user:"System", message:"Doctor Joined the clinic. ",role:"system"});
    socket.to(room_id).emit("message",{user:"System:",message:"User Joined the clinic.",role:"system"})
    }
    }).catch(err=>{
        console.log(err);
    });
   
})


// `Join Doctor to a Room`
socket.on("joinDoctorToRoom",(room_id)=>{
    socket.join(room_id);
    socket.currentRoom = room_id;
    if (getRoomInfo(room_id) == null){
        try {
            addRoom(room_id);
        }catch {
            console.log("error adding room");
        }

    }
    try {
        addDoctorToRoom(room_id);
    }catch {
        console.log("error adding doctor to room");
    }
    const oldMessages = messagesFromRoom(socket.currentRoom).then(messages=>{
        if (messages.length != 0){
            messages.map(msg=>{
                if (msg.type === 'message'){
                    socket.emit("message", {user:msg.sender_name,message:msg.message,role:msg.sender});
                }else if(msg.type === 'image') {
                    socket.emit("imageUploaded", {user:msg.sender_name,image:msg.message,role:msg.sender});
                }
               
            });
        };
    socket.emit("message",{user:"System", message:"Welcome doctor to the clinic.",role:"system"});  
    if (isUserInRoom(room_id) == null){
        socket.emit("message",{user:"System", message:"User didn't join until now, please wait.",role:"system"});
        }else {   // if user is connected to the system:
            socket.emit("message",{user:"System", message:"User Joined the clinic.",role:"system"});
            socket.to(room_id).emit("message",{user:"System:",message:"Doctor Joined the clinic",role:"system"})    
        }
    }).catch(err=>{
        console.log(err);
    });
})
////////////////////////////////////////////////////////// ? Messagging ////////////////////////////////////////////////////////////////////////////////////

socket.on("sendMessage",(message)=>{
    const info = {
        room_id: socket.currentRoom,
        message,
        type:"message",
        sender:socket.role,
        sender_name: socket.name
    }
    try {
        addNewMessage(info);
    }catch {
        console.log("error adding msg to db");
    }

    io.to(socket.currentRoom).emit('message', { user: socket.name, message: message, role: socket.role });
})

////////////////////////////////////////////////////////// ? TYPING ////////////////////////////////////////////////////////////////////////////////////
socket.on("typing",()=>{
    socket.to(socket.currentRoom).emit("isTyping",socket.role+" is typing...");    
});
socket.on("stopTyping",()=>{
    socket.to(socket.currentRoom).emit("isTyping","");    
});

////////////////////////////////////////////////////////// ? IMAGE UPLOADING ////////////////////////////////////////////////////////////////////////////////
socket.on("uploadImage",(imageName)=>{
    const info = {
        room_id: socket.currentRoom,
        message: imageName,
        type:"image",
        sender:socket.role,
        sender_name: socket.name
    }
    try {
        addNewMessage(info);
    }catch {
        console.log("error adding msg to db");
    }
    io.to(socket.currentRoom).emit('imageUploaded', { user: socket.name, image: imageName, role: socket.role });
});
////////////////////////////////////////////////////////// ? DISCONNECTING FROM THE SYSTEM //////////////////////////////////////////////////////////////////

        // When Socket disconnects from the System: 
        socket.on("disconnect",()=>{
            //  if the socket that leaved is a doctor remove its socket info from the doctors array : 
            if (socket.role === 'doctor'){
                if (socket.currentRoom != null){
            socket.to(socket.currentRoom).emit("message",{user:"System:",message:"Doctor left the clinic.",role:"system"});    
            try {
                removeDoctorFromRoom(socket.currentRoom);
                if (getRoomInfo(socket.currentRoom).user == undefined){
                    deleteRoom(socket.currentRoom);
                }
            }catch {
                console.log("error while doctor disconnecting and deleting the doctor from the room")
            }
               
                }

                     //  if the socket that leaved is a user: 
            }else if (socket.role === 'user'){
                if (socket.currentRoom != null){
                    socket.to(socket.currentRoom).emit("message",{user:"System:",message:"User left the clinic.",role:"system"})    
                    try {
                        removeUserFromRoom(socket.currentRoom);
                        if (getRoomInfo(socket.currentRoom).doctor == undefined){
                            deleteRoom(socket.currentRoom);
                        }
                    }catch {
                console.log("error while user disconnecting and deleting the user from the room")
                    }

                }
            }
        })
    })
}


////////////////////////////////////////////////////////// ? METHODS //////////////////////////////////////////////////////////////////

// ROOMS METHODS:

const onlineRooms = {};

const getRoomInfo = (room_id)=>{
    return onlineRooms[room_id] || null;
}

const addRoom = (room_id)=>{
    onlineRooms[room_id] = {};
};

const deleteRoom = (room_id)=>{
    delete onlineRooms[room_id];
};

const addDoctorToRoom = (room_id)=>{
    onlineRooms[room_id].doctor = true;
}

const isDoctorInRoom = (room_id)=>{
    return onlineRooms[room_id].doctor || null;
}

const removeDoctorFromRoom = (room_id)=>{
    delete onlineRooms[room_id].doctor;
}

const addUserToRoom = (room_id)=>{
    onlineRooms[room_id].user = true;
}

const isUserInRoom = (room_id)=>{
    return onlineRooms[room_id].user || null;
}

const removeUserFromRoom = (room_id)=>{
        delete onlineRooms[room_id].user;
}

