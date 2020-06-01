exports.doctors = (io)=>{
    const doctors = io
    .on("connect",(socket)=>{
////////////////////////////////////////////////////////// ? JOINING THE SYSTEM //////////////////////////////////////////////////////////////////

        // `Doctor joined the system`:  
        socket.on("doctorJoined",(doctor_id)=>{
            socket.doctor_id = doctor_id;
            socket.role = "doctor";
            addDoctor(doctor_id,socket.id);
        })
      // `User joined the system`:  
        socket.on("userJoined",(user_id)=>{
            socket.role = "user";
            socket.user_id = user_id;
        })

////////////////////////////////////////////////////////// ? ROOMS AREA ////////////////////////////////////////////////////////////////////////

//  `Join User a room` 
socket.on("joinUserToRoom", (room_id,doctor_id = null)=>{
    socket.join(room_id)
    socket.currentRoom = room_id;
    if (getRoomInfo(room_id) == null){
        addRoom(room_id);
    }
    addUserToRoom(room_id);
    socket.emit("message",{user:"System", message:"Welcome to the clinic"})
    // if doctor is still not connected to the room: 
    if (isDoctorInRoom(room_id) === null){
    socket.emit("message",{user:"System", message:"Doctor is not connected Yet, any message you send before doctor joins will not be deliverd, pleasw wait."});
    }else {   // if doctor is connected to the system:
        socket.emit("message",{user:"System", message:"Doctor is Here, Just talk"});
    socket.to(room_id).emit("message",{user:"System:",message:"User Joined the Clinic, Say Hi!"})

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
    socket.emit("message",{user:"System", message:"Welcome Doctor to the clinic"});  
    if (isUserInRoom(room_id) === null){
        socket.emit("message",{user:"System", message:"User isn't connected Yet"});
        }else {   // if user is connected to the system:
            socket.emit("message",{user:"System", message:"User is Here, Just talk"});
            socket.to(room_id).emit("message",{user:"System:",message:"Doctor Joined the Clinic, Say Hi!"})    
        }
})

////////////////////////////////////////////////////////// ? DISCONNECTING FROM THE SYSTEM //////////////////////////////////////////////////////////////////

        // When Socket disconnects from the System: 
        socket.on("disconnect",()=>{
            //  if the socket that leaved is a doctor remove its socket info from the doctors array : 
            if (socket.role === 'doctor'){
                console.log("Doctor disconnected with socket id \t ", socket.id);
                const doctors = getDoctors();
                deleteDoctor(socket.doctor_id);
                if (socket.currentRoom != null){
                    console.log(getRoomInfo(socket.currentRoom));
                    removeDoctorFromRoom(socket.currentRoom);
                    console.log(getRoomInfo(socket.currentRoom));
                    if (getRoomInfo(socket.currentRoom).user == undefined){
                        console.log("hey");
                        console.log(getRooms());
                        deleteRoom(socket.currentRoom);
                    }
                    console.log(getRooms());

                }

                     //  if the socket that leaved is a user: 
            }else if (socket.role === 'user'){
                console.log("User Disconnected with socket id \t", socket.id );
                if (socket.currentRoom != null){
                    console.log(getRoomInfo(socket.currentRoom));
                    removeUserFromRoom(socket.currentRoom);
                    console.log(getRoomInfo(socket.currentRoom));
                    if (getRoomInfo(socket.currentRoom).doctor == undefined){
                        console.log("hey");
                        console.log(getRooms());
                        deleteRoom(socket.currentRoom);
                    }
                    console.log(getRooms());

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
    console.log("bitch")
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

