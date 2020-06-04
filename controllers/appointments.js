const {addNewAppointment,addConfirmNewAppointment,userApps,docApps,cancelApp,confirmApp,docAppsDate,finishedApps,upcomingApps,getAppointment,setUser_joined,setDoctor_joined,doctorUpcomingApps,doctorFinishedApps} = require("../models/appointments");
const {checkIfUserExist} = require("../models/users");
const {getTokenFromSlot} = require("../models/doctors");
const { handleError} = require("../middleware/error");
const {newAppointmentTask} = require("../tasks/tasks");
const {sendNotfication} = require("../utils/shared/sendNotfication");
const respond = require("../middleware/respond");
var moment = require('moment');

const addAppointment = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    req.body.date = moment(req.body.date).utc().format("YYYY-MM-DD");
    const data = { ...req.body,user_id };
    const newAppointment = await addNewAppointment(data,res);
    if (newAppointment){
        return respond(true,201,newAppointment,res);
     }
  } catch (err) {
    handleError(err, res);
  }
};

const addConfirmedAppointment = async (req, res, next) => { // will be confirmed immediately (for control panel use)
  try {
    const data = { ...req.body };
    data.date = moment(data.date).utc().format("YYYY-MM-DD");
    const newAppointment = await addConfirmNewAppointment(data,res);
    if (newAppointment){
      const user = await checkIfUserExist(newAppointment.user_id);
      if (user.fb_token_id != null){
        sendNotfication(user.fb_token_id,"تم إضافة حجز جديد");
      }
      const token = await getTokenFromSlot(newAppointment.dataValues.slot_id);
      if (token != null){
        sendNotfication(token,"هناك حجز جديد");
      }
        return respond(true,201,newAppointment,res);
     }
  } catch (err) {
    handleError(err, res);
  }
};
// for control panel
const getUserApps = async (req,res,next)=>{
  try {
    const {user_id} = req.body;
    const appointments = await userApps(user_id,res);
    if (appointments){
      return respond(true,200,appointments,res);
    }
  }catch(err){
    handleError(err,res);
  }
} 

// Get User's finished appointments for users app use : 
const finishedAppointments = async (req,res,next)=>{
  try {
    const {id} = req.user;
    const appointments = await finishedApps(id,res);
    if (appointments){
      return respond(true,200,appointments,res);
    }
  }catch(err){
    handleError(err,res);
  }
} 

// Get User's upcoming appointments for users app use : 
const upcomingAppointments = async (req,res,next)=>{
  try {
    const {id} = req.user;
    const appointments = await upcomingApps(id,res);
    if (appointments){
      return respond(true,200,appointments,res);
    }
  }catch(err){
    handleError(err,res);
  }
} 




// Get Doctor's finished appointments for doctors app use : 
const doctorFinishedAppointments = async (req,res,next)=>{
  try {
    const {id} = req.user;
    const appointments = await doctorFinishedApps(id,res);
    if (appointments){
      return respond(true,200,appointments,res);
    }
  }catch(err){
    handleError(err,res);
  }
} 

// Get Doctor's upcoming appointments for doctors app use : 
const doctorUpcomingAppointments = async (req,res,next)=>{
  try {
    const {id} = req.user;
    const appointments = await doctorUpcomingApps(id,res);
    if (appointments){
      return respond(true,200,appointments,res);
    }
  }catch(err){
    handleError(err,res);
  }
} 


// for conytol panel
const getDocApps = async (req,res,next)=>{
  try {
    const {doctor_id} = req.body;
    const appointments = await docApps(doctor_id,res);
    if (appointments){
      return respond(true,200,appointments,res);
    }
  }catch(err){
    handleError(err,res);
  }
} 



// for doctor's application
const docAppsByDate = async (req,res,next)=>{
  try {
    const {id} = req.user;
    const {date} = req.body;
    const appointments = await docAppsDate(id,date,res);
    if (appointments){
      return respond(true,200,appointments,res);
    }
  }catch(err){
    handleError(err,res);
  }
} 




const cancelAppointment = async (req,res,next)=>{
  try {
    const {appointment_id} = req.body;
    const canceled = await cancelApp(appointment_id,res);
    if (canceled){
      const user = await checkIfUserExist(canceled.user_id);
      if (user.fb_token_id != null){
        sendNotfication(user.fb_token_id,"يرجى مراجعة حجوزاتك، تم إلغاء احدها");
      }
      return respond(true,200,canceled,res);
    }
  }catch(err){
    handleError(err,res);
  }
} 

const confirmAppointment = async (req,res,next)=>{
  try {
    const {appointment_id} = req.body;
    const confirmed = await confirmApp(appointment_id,res);
    if (confirmed){
      const token = await getTokenFromSlot(confirmed.dataValues.slot_id); // doctor's token
      if (token != null){
        sendNotfication(token,"هناك حجز جديد");
      }
      // JOBS
      await newAppointmentTask(confirmed.appointment_id,res);
      //END JOBS: 
      return respond(true,200,confirmed,res);
    }
  }catch(err){
    handleError(err,res);
  }
} 

// TODO:: TEST THIS FUNCTION: 
const joinUser = async(req,res,next)=>{
  try {
    const {appointment_id} = req.body;
    const appointment = await getAppointment(appointment_id,res); 
    const {date,appointment_status,start_time,slot_time,room_id,user_joined} = appointment;
    const serverDate = moment().format("YYYY-MM-DD"); // server date
    const serverTime = moment().format(); // server time
    const appDate = moment(date,"YYYY-MM-DD").format("YYYY-MM-DD"); // appointment date
    const appStartTime = moment(start_time, "HH:mm");  // appointment start time 
    const appEndTime = moment(start_time, "HH:mm").add(slot_time,"m");  // appointment end time 
    const appFiveBeforeStart = moment(appStartTime).subtract(6,"m"); // this substract 6 minutes from the start time (to be able to use the range) the sixth minutes is excluded 
    const appFiveAfterStart = moment(appStartTime).add(6,"m"); // this adds 6 minutes to the start time (to be able to use the range) the sixth minutes is excluded 
    if (appointment_status === "running" && user_joined === 0){ 
      const compareDate = moment(appDate).isSame(serverDate); // check if the server date equals the appointment date
      const compareTime = moment(serverTime).isBetween(appFiveBeforeStart,appFiveAfterStart); // this checks if the server time is between 'five minutes before' - 'five minutes after ' the appointment time 
      const compareBeforeEnd = moment(serverTime).isBefore(appEndTime) // this an additional check, by default the corn task will change the status to finished so we will not join this if at all, but this is additional if the corn didn't work for any reason,
      // if both checks are true : User is allowed to join the appointment. 
      if (compareDate && compareTime && compareBeforeEnd){
        const updateApp = await setUser_joined(appointment_id);
        return respond(true,200,{room_id},res);
      }else { // user's isn't allowed to join the appointment: 
      return respond(false,200,{room_id: ""},res);

      }
    }else if (appointment_status === 'running' && user_joined == 1){ // if the user lost his connection and wanna join again :: => i will just check if the session is still running and return the room id to him to join: 
      const compareBeforeEnd = moment(serverTime).isBefore(appEndTime) // this an additional check, by default the corn task will change the status to finished so we will not join this if at all, but this is additional if the corn didn't work for any reason,
      if (compareBeforeEnd){
        return respond(true,200,{room_id},res);
      }else {
        return respond(false,200,{room_id: ""},res);
      }
    }else {
      return respond(false,200,{room_id: ""},res);
    }
  }catch(err){
    handleError(err,res);
  }
}

// TODO:: TEST THIS FUNCTION: 
const joinDoctor = async(req,res,next)=>{
  try {
    const {appointment_id} = req.body;
    const appointment = await getAppointment(appointment_id,res); 
    const {date,appointment_status,slot_time,room_id} = appointment;
    const serverDate = moment().format("YYYY-MM-DD"); // server date
    const serverTime = moment().format(); // server time
    const appDate = moment(date,"YYYY-MM-DD").format("YYYY-MM-DD"); // appointment date
    const appEndTime = moment(start_time, "HH:mm").add(slot_time,"m");  // appointment end time 


    if (appointment_status === "running"){ 
      const compareDate = moment(appDate).isSame(serverDate); // check if the server date equals the appointment date
      const compareBeforeEnd = moment(serverTime).isBefore(appEndTime) // this an additional check, by default the corn task will change the status to finished so we will not join `if` at all, but this is additional if the corn didn't work for any reason,
      // if both checks are true : Doctor is allowed to join the appointment. 
      if (compareDate && compareBeforeEnd){
        const updateApp = await setDoctor_joined(appointment_id);
        return respond(true,200,{room_id},res);
      }else { // Doctor's isn't allowed to join the appointment: 
      return respond(false,200,{room_id: ""},res);

      }
    }else {
      return respond(false,200,{room_id: ""},res);

    }
  }catch(err){
    handleError(err,res);
  }
}


module.exports = {
    addAppointment,
    getUserApps,
    getDocApps,
    docAppsByDate,
    cancelAppointment,
    addConfirmedAppointment,
    confirmAppointment,
    finishedAppointments,
    upcomingAppointments,
    joinUser,
    joinDoctor,
    doctorUpcomingAppointments,
    doctorFinishedAppointments
}
