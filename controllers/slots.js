const {addSlot} = require("../models/slots");
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


module.exports = {
    addDocSlot,
}