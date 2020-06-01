exports.doctors = (io)=>{
    const doctors = io
    .of("/doctors")
    .on("connection",(socket)=>{
        console.log("New Doctor joined",socket.id);

        // When doctor emits `doctorJoined` save the doctor info: 
        socket.on("doctorJoined",(doctor_id)=>{
            socket.doctor_id = doctor_id;
            socket.role = "doctor";
            addDoctor(doctor_id,socket.id);
        })

        socket.join("hala");
        io.of("/doctors").to('hala').emit('hello', "test");

        // When Socket disconnects delete his info: 
        socket.on("disconnect",()=>{
            if (socket.role === 'doctor'){
                console.log("doctor disconnected");
                deleteDoctor(socket.doctor_id);
                const doctors = getDoctors();
            }
        })
    })
}

const doctors = [];

const addDoctor = (doctor_id,socket_id)=>{
    doctors[doctor_id] = socket_id
}

const deleteDoctor = (doctor_id)=>{
    doctors.splice(doctor_id,1);
}

const getDoctors = ()=>{
    return doctors;
}