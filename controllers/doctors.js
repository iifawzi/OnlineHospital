const {checkDocPhoneExist} = require("../models/doctors");
const {handleError,ErrorHandler} = require("../middleware/error");
const respond = require("../middleware/respond");



const getDoctor = async (req,res,next)=>{
    try {
        const {phone_number} = req.body;
        const doctor = await checkDocPhoneExist(phone_number);
        if (!doctor){
            throw new ErrorHandler(401,"Doctor not found");
        }
        // For later, if we wanna be able to update the password from the control pabel for admins: 
        // if (req.user.userRole === 'admin' || req.user.role === 'superadmin' ){
        //     return respond(true,200,{...doctor.dataValues},res);
        // }else {
        //     const doctorData = {...doctor.dataValues};
        //     delete doctorData.password;
        //     return respond(true,200,{...doctorData},res);
        // }
            const doctorData = {...doctor.dataValues};
            delete doctorData.password;
            return respond(true,200,{...doctorData},res);
    }catch(err){
        handleError(err,res);
    }
}

module.exports = {
getDoctor,
}