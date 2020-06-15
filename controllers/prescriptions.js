const {handleError,ErrorHandler} = require("../middleware/error");
const {createPrescription,prescriptionUpdate,prescriptionGet} = require("../models/prescriptions");
const respond = require("../middleware/respond");




const addPrescription = async (req,res,next)=>{
    try {
        let data = req.body;
        const prescription = await createPrescription(data,res);
        if (prescription){
            return respond(true,201,prescription,res);
        }
    }catch(err){
        handleError(err,res);
    }
}





const updatePrescription = async (req,res,next)=>{
    try {
        const data = req.body;
        const prescription = await prescriptionUpdate(data,res);
        if (prescription){
            return respond(true,200,prescription,res);
        }
    }catch(err){
        handleError(err,res);
    }
}




const getPrescription = async (req,res,next)=>{
    try {
        const {room_id} = req.body;
        const prescription = await prescriptionGet(room_id,res);
        if (prescription){
            return respond(true,200,prescription,res);
        }else {
            return respond(false,200,{},res);
        }
    }catch(err){
        handleError(err,res);
    }
}




module.exports = {
    addPrescription,
    updatePrescription,
    getPrescription
}