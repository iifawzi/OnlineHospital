const {addSlot,getDocOpenSlots,slotUpdate} = require("../models/slots");
const {handleError,ErrorHandler} = require("../middleware/error");
const respond = require("../middleware/respond");
var moment = require('moment'); // require



const addDocSlot = async (req,res,next)=>{
    try {
        const data = {...req.body};
        const slot = await addSlot(data,res);
        if (slot){
            return respond(true,201,slot,res);
         }
    }catch(err){
        handleError(err,res);
    }
}


const getOpenSlots = async (req,res,next)=>{
    try {
        const appointmentsForWeek = [];
        const {doctor_id, searchIn} = req.body;
const forLoop =  async (doctor_id,searchIn) =>{
    for (let i=0;i<=searchIn;i++){
        const date = moment().utc().add(i,"d").format("YYYY-MM-DD");
        const day = moment(date).format("ddd").toLowerCase();
        const info = {
            date: date,
            doctor_id: doctor_id,
            day:day,
        }
        const slots = await getDocOpenSlots(info,res);
        if (slots){
        if (slots.length != 0){
            appointmentsForWeek.push(slots);
        }
        }
    }
}
await forLoop(doctor_id,searchIn);
return respond(true,200,appointmentsForWeek.flat(),res);
    }catch(err){
        handleError(err,res);
    }

  }




  const updateSlot = async (req,res,next)=>{
      try {
        const data = req.body;
        const updated = await slotUpdate(data,res);
        if (updated){
            return respond(true,200,updated,res)
        }
      }catch(err){
          handleError(err,res);
      }
  }
module.exports = {
    addDocSlot,
    getOpenSlots,
    updateSlot
}