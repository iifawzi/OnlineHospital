const {addNewAppointment,addConfirmNewAppointment,userApps,docApps,cancelApp,confirmApp,docAppsDate,finishedApps,upcomingApps,getAppointmentInfo,setUser_joined,setDoctor_joined,doctorUpcomingApps,doctorFinishedApps} = require("../models/appointments");
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
            // JOBS
            await newAppointmentTask(newAppointment.appointment_id,res);
            //END JOBS: 
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
    const appointment = await getAppointmentInfo(appointment_id,res); 
    const {appointment_status,start_time,slot_time,room_id,user_joined} = appointment;

    let appEndTime = moment(start_time).add(slot_time,'m').format("YYYY-MM-DD HH:mm:ss");
    let serverTime = moment().format();
    let fiveMinAfter = moment(start_time).add(6,"m").format("YYYY-MM-DD HH:mm:ss");
    let fiveMinBefore = moment(start_time).subtract(6,"m").format("YYYY-MM-DD HH:mm:ss");
    if (appointment_status === "running" && user_joined === 0){ 
      const compareTime = moment(serverTime).isBetween(fiveMinBefore,fiveMinAfter); 
      const compareBeforeEnd = moment(serverTime).isBefore(appEndTime);
      if (compareTime && compareBeforeEnd){
        const updateApp = await setUser_joined(appointment_id);
        return respond(true,200,{room_id,appEndTime},res);
      }else { // user's isn't allowed to join the appointment: 
      return respond(false,200,{room_id: "", appEndTime:""},res);
      }
    }else if (appointment_status === 'running' && user_joined == 1){ // if the user lost his connection and wanna join again :: => i will just check if the session is still running and return the room id to him to join: 
      const compareBeforeEnd = moment(serverTime).isBefore(appEndTime);
      if (compareBeforeEnd){
        return respond(true,200,{room_id,appEndTime},res);
      }else {
        return respond(false,200,{room_id: "",appEndTime:""},res);
      }
    }else {
      return respond(false,200,{room_id: "",appEndTime:""},res);
    }
  }catch(err){
    handleError(err,res);
  }
}





// TODO:: TEST THIS FUNCTION: 
const joinDoctor = async(req,res,next)=>{
  try {
    const {appointment_id} = req.body;
    const appointment = await getAppointmentInfo(appointment_id,res); 
    const {appointment_status,slot_time,start_time,room_id} = appointment;
    let appEndTime = moment(start_time).add(slot_time,'m').format("YYYY-MM-DD HH:mm:ss");
    let serverTime = moment().format();
    if (appointment_status === "running"){ 
      const compareBeforeEnd = moment(serverTime).isBefore(appEndTime);
      if (compareBeforeEnd){
        const updateApp = await setDoctor_joined(appointment_id);
        return respond(true,200,{room_id,appEndTime},res);
      }else { // Doctor's isn't allowed to join the appointment: 
      return respond(false,200,{room_id: "",appEndTime:""},res);
      }
    }else {
      return respond(false,200,{room_id: "",appEndTime:""},res);
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
