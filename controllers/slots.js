const {addSlot,getDocOpenSlots,slotUpdate,doctorDays} = require("../models/slots");
const {handleError,ErrorHandler} = require("../middleware/error");
const respond = require("../middleware/respond");
var moment = require('moment'); // require



const addDocSlot = async (req,res,next)=>{
    try {
        const {start_time,day} = req.body;
        const utcStartDay = moment(day+" "+start_time,"ddd HH:mm").utc().format("ddd HH:mm");
        const [utcDay,utcStart_time] = utcStartDay.split(" ").map(e=> e.toLowerCase());
        req.body.start_time = utcStart_time;
        req.body.day = utcDay;
        const data = {...req.body};
        const slot = await addSlot(data,res);
        if (slot){
            return respond(true,201,slot,res);
         }
    }catch(err){
        handleError(err,res);
    }
}

const getDoctorDays = async (req,res,nect)=>{	// if there's an doctor_id in the body, use that id (control panel use), if not take the id from the header (doctor's application use)
console.log(req.body);
    try {	
        let id = "";
        if (req.body.doctor_id){
            id = req.body.doctor_id;
        }else {
            id = req.user.id;
        }
const days = await doctorDays(id);	
if (!days){	
    throw new ErrorHandler(500,"error happened while getting the Slots");	
}	
const RealDays = [];	
for (day of days){	
    RealDays.push(day.dataValues.day);	
}
return respond(true,200,RealDays,res);	

    }catch(err){	
        handleError(err,res);	
    }	
}

const getOpenSlots = async (req,res,next)=>{
    try {
        const appointmentsForWeek = [];
        const {doctor_id, searchIn} = req.body;
        console.log(req.body);
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
console.log(appointmentsForWeek);
return respond(true,200,appointmentsForWeek.flat(),res);
    }catch(err){
        handleError(err,res);
    }

  }




  const updateSlot = async (req,res,next)=>{
      try {
        const data = req.body;
        const {start_time,day} = req.body;
        const utcStartDay = moment(day+" "+start_time,"ddd HH:mm").utc().format("ddd HH:mm");
        const [utcDay,utcStart_time] = utcStartDay.split(" ").map(e=> e.toLowerCase());
        data.start_time = utcStart_time;
        data.day = utcDay;
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
    updateSlot,
    getDoctorDays
}