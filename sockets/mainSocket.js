const moment = require('moment'); 
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
    socket.join(room_id)
    socket.currentRoom = room_id;
    if (getRoomInfo(room_id) == null){
        addRoom(room_id);
    }
    addUserToRoom(room_id);
    socket.emit("message",{user:"System", message:"Welcome to the clinic",role:"system"})
    // if doctor is still not connected to the room: 
    if (isDoctorInRoom(room_id) == null){
    socket.emit("message",{user:"System", message:"Doctor is not connected Yet, any message you send before doctor joins will not be deliverd, pleasw wait.",role:"system"});
    }else {   // if doctor is connected to the system:
        socket.emit("message",{user:"System", message:"Doctor is Here, Just talk",role:"system"});
    socket.to(room_id).emit("message",{user:"System:",message:"User Joined the Clinic, Say Hi!",role:"system"})

    }
})


// `Join Doctor to a Room`
socket.on("joinDoctorToRoom",(room_id)=>{
    socket.join(room_id);
    socket.currentRoom = room_id;
    if (getRoomInfo(room_id) == null){
        addRoom(room_id);
    }
    addDoctorToRoom(room_id);
    socket.emit("message",{user:"System", message:"Welcome Doctor to the clinic",role:"system"});  
    if (isUserInRoom(room_id) == null){
        socket.emit("message",{user:"System", message:"User isn't connected Yet",role:"system"});
        }else {   // if user is connected to the system:
            socket.emit("message",{user:"System", message:"User is Here, Just talk",role:"system"});
            socket.to(room_id).emit("message",{user:"System:",message:"Doctor Joined the Clinic, Say Hi!",role:"system"})    
        }
})
////////////////////////////////////////////////////////// ? Messagging ////////////////////////////////////////////////////////////////////////////////////

socket.on("sendMessage",(message)=>{
    io.to(socket.currentRoom).emit('message', { user: socket.name, message: message, role: socket.role });
})

////////////////////////////////////////////////////////// ? DISCONNECTING FROM THE SYSTEM //////////////////////////////////////////////////////////////////

        // When Socket disconnects from the System: 
        socket.on("disconnect",()=>{
            //  if the socket that leaved is a doctor remove its socket info from the doctors array : 
            if (socket.role === 'doctor'){
                deleteDoctor(socket.myId);
                if (socket.currentRoom != null){
                    removeDoctorFromRoom(socket.currentRoom);
                    if (getRoomInfo(socket.currentRoom).user == undefined){
                        deleteRoom(socket.currentRoom);
                    }
                }

                     //  if the socket that leaved is a user: 
            }else if (socket.role === 'user'){
                if (socket.currentRoom != null){
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

