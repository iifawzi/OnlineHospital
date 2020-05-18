const {handleError,ErrorHandler} = require("../middleware/error");
const {checkDocPhoneExist,createNewDoctor} = require("../models/doctors");
const {hashPassword} = require("../utils/shared/bcrypt");
const {checkIfPhoneExist} = require("../models/users");

const respond = require("../middleware/respond");




const addDoctor = async (req,res,next)=>{
    try{
        const {first_name,last_name,phone_number,password,country,category,sub_category} = req.body;
        const Checkusers = await checkIfPhoneExist(phone_number);
        const Checkdoctors = await checkDocPhoneExist(phone_number);
        if (Checkdoctors || Checkusers){
            throw new ErrorHandler(403,"Phone Number is already associated with an account");
        }
        const hashedPassword = await hashPassword(password);
        const createDoctor = await createNewDoctor({
            first_name,
            last_name,
            password:hashedPassword,
            phone_number,
            country,
            category,
            sub_category,
        });
        if (createDoctor){
            const doctor = {...createDoctor.dataValues};
            delete doctor.password;
            return respond(true,201,{...doctor},res);
        }
    }catch(err){
        handleError(err,res);
    }
};

const addAdmin = (req,res,next)=>{
const {username, password, name, role} = req.body;
};


module.exports = {
    addDoctor,
    addAdmin,
}