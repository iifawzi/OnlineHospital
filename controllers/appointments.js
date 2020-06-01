const {addNewAppointment,addConfirmNewAppointment,userApps,docApps,cancelApp,confirmApp,docAppsDate,finishedApps,upcomingApps} = require("../models/appointments");
const { handleError, ErrorHandler } = require("../middleware/error");
const respond = require("../middleware/respond");

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

module.exports = {
    addAppointment,
    getUserApps,
    getDocApps,
    docAppsByDate,
    cancelAppointment,
    addConfirmedAppointment,
    confirmAppointment,
    finishedAppointments,
    upcomingAppointments
}
