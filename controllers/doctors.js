const {checkDocPhoneExist, getDoctorsData} = require("../models/doctors");
const {handleError,ErrorHandler} = require("../middleware/error");
const respond = require("../middleware/respond");



const getDoctor = async (req,res,next)=>{
    try {
        const {phone_number} = req.body;
        const doctor = await checkDocPhoneExist(phone_number);
        if (!doctor){
            throw new ErrorHandler(404,"Doctor not found");
        }
        if (req.user.role === 'admin'){
            return respond(true,200,doctor.dataValues,res);
        }
            const doctorData = {...doctor.dataValues};
            delete doctorData.password;
            return respond(true,200,{...doctorData},res);
    }catch(err){
        handleError(err,res);
    }
}


const getDoctors = async (req,res,next)=>{
    try {
        const {category_id} = req.body;
const doctors = await getDoctorsData(category_id);
return respond(true,200,doctors,res);
    }catch(err){
        handleError(err,res);
    }
}
module.exports = {
getDoctor,
getDoctors
}