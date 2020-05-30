const {checkDocPhoneExist, getDoctorsData,checkDocIdExist,updateDoctor} = require("../models/doctors");
const {handleError,ErrorHandler} = require("../middleware/error");
const respond = require("../middleware/respond");



const getDoctor = async (req,res,next)=>{
    try {
        const {doctor_id} = req.body;
        const doctor = await checkDocIdExist(doctor_id);
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
const doctors = await getDoctorsData(category_id,res);
return respond(true,200,doctors,res);
    }catch(err){
        handleError(err,res);
    }
}



const updateTheDoctor = async (req, res, next) => {
    try {
      const { doctor_id } = req.body;
      const data = req.body;
      delete data.doctor_id;
      const doctor = await checkDocIdExist(doctor_id);
  
      if (!doctor) {
        throw new ErrorHandler(404, "Doctor with this id not found");
      }
  
      if (data.phone_number != undefined) {
        const checkPhone = await checkDocPhoneExist(data.phone_number);
        if (checkPhone) {
          if (doctor.phone_number != checkPhone.phone_number) {
            // if a mistake happened and he sent the same phone number which associated with his acc.
            throw new ErrorHandler(
              403,
              "The new Phone number is already registered"
            );
          }
        }
      }
  
      const updatedData = await updateDoctor(doctor, data,res);
      if (!updatedData) {
        throw new ErrorHandler(500, "Sorry, something wrong happened");
      }
      return respond(true, 200, { ...updatedData.dataValues}, res);
    } catch (err) {
      handleError(err, res);
    }
  };
module.exports = {
getDoctor,
getDoctors,
updateTheDoctor
}