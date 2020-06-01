const {addNewAppointment,addConfirmNewAppointment,userApps,docApps,cancelApp,confirmApp,docAppsDate,finishedApps,upcomingApps,getAppointment,setUser_joined} = require("../models/appointments");
const { handleError, ErrorHandler } = require("../middleware/error");
const respond = require("../middleware/respond");
var moment = require('moment');

const addAppointment = async (req, res, next) => {
  try {
    const user_id = req.user.id;
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
    const newAppointment = await addConfirmNewAppointment(data,res);
    if (newAppointment){
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

// Get finished appointments for users app use : 
const finishedAppointments = async (req,res,next)=>{
  try {
    const {user_id} = req.body;
    const appointments = await finishedApps(user_id,res);
    if (appointments){
      return respond(true,200,appointments,res);
    }
  }catch(err){
    handleError(err,res);
  }
} 

// Get upcoming appointments for users app use : 
const upcomingAppointments = async (req,res,next)=>{
  try {
    const {user_id} = req.body;
    const appointments = await upcomingApps(user_id,res);
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
      return respond(true,200,confirmed,res);
    }
  }catch(err){
    handleError(err,res);
  }
} 


const joinUser = async(req,res,next)=>{
  try {
    const {appointment_id} = req.body;
    const appointment = await getAppointment(appointment_id,res); 
    const {date,appointment_status,start_time,room_id} = appointment;
    if (appointment_status === "running"){ 
      const serverDate = moment().format("YYYY-MM-DD"); // server date
      const serverTime = moment().format(); // server time
      const appDate = moment(date,"YYYY-MM-DD").format("YYYY-MM-DD"); // appointment date
      const appStartTime = moment(start_time, "HH:mm");  // appointment start time 
      const appFiveBeforeStart = moment(appStartTime).subtract(6,"m"); // this substract 6 minutes from the start time (to be able to use the range) the sixth minutes is excluded 
      const appFiveAfterStart = moment(appStartTime).add(6,"m"); // this adds 6 minutes to the start time (to be able to use the range) the sixth minutes is excluded 
      const compareDate = moment(appDate).isSame(serverDate); // check if the server date equals the appointment date
      const compareTime = moment(serverTime).isBetween(appFiveBeforeStart,appFiveAfterStart); // this checks if the server time is between 'five minutes before' - 'five minutes after ' the appointment time 
      // if both checks are true : User is able to join the appointment. 
      if (compareDate && compareTime){
        const app = await setUser_joined(appointment_id);
        console.log(app.dataValues);
        return respond(true,200,{room_id},res);
      }else { // user's isn't able to join the appointment: 
        return respond(false,200,"",res);
      }
    }else { // if the appointment status is not running:
      return respond(false,200,"",res);
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
    joinUser
}
