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
            addDoctor(doctor_id,socket.id);
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
    console.log("user joineddddd to rooooom");
    socket.join(room_id)
    socket.currentRoom = room_id;
    if (getRoomInfo(room_id) == null){
        addRoom(room_id);
    }
    addUserToRoom(room_id);
    const oldMessages = messagesFromRoom(socket.currentRoom).then(messages=>{
        console.log(messages,"userkjdkjdjk");

        if (messages.length != 0){
            messages.map(msg=>{
                console.log(msg);
                socket.emit("message", {user:msg.sender_name,message:msg.message,role:msg.sender});
            })
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
        addRoom(room_id);
    }
    addDoctorToRoom(room_id);
    const oldMessages = messagesFromRoom(socket.currentRoom).then(messages=>{
        if (messages.length != 0){
            messages.map(msg=>{
                socket.emit("message", {user:msg.sender_name,message:msg.message,role:msg.sender});
            })
        }
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
    addNewMessage(info);
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
socket.on("uploadImage",(fakeRequest)=>{
    console.log(fakeRequest, "first");
    upload().single('file')(fakeRequest,{}, error=>{
        if (error){
            console.log(error);
        }else {
            if (fakeRequest.file){
                console.log(fakeRequest.file.filename);
            }else {
                console.log(fakeRequest, "last");
            }
        }
})
});
////////////////////////////////////////////////////////// ? DISCONNECTING FROM THE SYSTEM //////////////////////////////////////////////////////////////////

        // When Socket disconnects from the System: 
        socket.on("disconnect",()=>{
            //  if the socket that leaved is a doctor remove its socket info from the doctors array : 
            if (socket.role === 'doctor'){
                deleteDoctor(socket.myId);
                if (socket.currentRoom != null){
            socket.to(socket.currentRoom).emit("message",{user:"System:",message:"Doctor left the clinic.",role:"system"});    
                    removeDoctorFromRoom(socket.currentRoom);
                    if (getRoomInfo(socket.currentRoom).user == undefined){
                        deleteRoom(socket.currentRoom);
                    }
                }

                     //  if the socket that leaved is a user: 
            }else if (socket.role === 'user'){
                if (socket.currentRoom != null){
                    socket.to(socket.currentRoom).emit("message",{user:"System:",message:"User left the clinic.",role:"system"})    
                    removeUserFromRoom(socket.currentRoom);
                    if (getRoomInfo(socket.currentRoom).doctor == undefined){
                        deleteRoom(socket.currentRoom);
                    }
                }
            }
        })
    })
}


////////////////////////////////////////////////////////// ? METHODS //////////////////////////////////////////////////////////////////


// DOCTORS METHODS:
const doctors = [];

const addDoctor = (doctor_id,socket_id)=>{
    doctors[doctor_id] = socket_id
}

const deleteDoctor = (doctor_id)=>{
    doctors.splice(doctor_id,1);
}

const getDoctor = (doctor_id)=>{
    return doctors[doctor_id] || null;
}

const getDoctors = ()=>{
    return doctors;
}

// ROOMS METHODS:

const onlineRooms = {};

const getRooms = ()=>{
    return onlineRooms;
}

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

