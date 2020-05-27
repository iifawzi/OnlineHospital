const {addSlot,doctorDays,getDocOpenSlots} = require("../models/slots");
const {handleError,ErrorHandler} = require("../middleware/error");
const respond = require("../middleware/respond");



const addDocSlot = async (req,res,next)=>{
    try {
        const data = {...req.body};
        const slot = await addSlot(data);
        if (slot){
            return respond(true,201,slot,res);
         }
    }catch(err){
        handleError(err,res);
    }
}

const getDoctorDays = async (req,res,nect)=>{
    try {
        const {doctor_id} = req.body;
const slots = await doctorDays(doctor_id);
if (!slots){
    throw new ErrorHandler(500,"error happened while getting the Slots");
}
const days = [];
for (day of slots){
    days.push(day.dataValues.day);
}
return respond(true,200,days,res);

    }catch(err){
        handleError(err,res);
    }
}


const getOpenSlots = async (req,res,next)=>{
    const info = {...req.body};
    const slots = await getDocOpenSlots(info,res);
    if (slots){
      return respond(true,200,slots,res);
    }
  }
module.exports = {
    addDocSlot,
    getDoctorDays,
    getOpenSlots
}