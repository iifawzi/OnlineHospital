const {checkIfPhoneExist,createUser,genToken,updateFirebaseToken} = require("../models/users");
const {checkDocPhoneExist,createNewDoctor,hashPassword,compareHashed,updateDoctorFirebaseToken} = require("../models/doctors");
const {handleError,ErrorHandler} = require("../middleware/error");
const respond = require("../middleware/respond");




// Middleware for `users signup` Endpoint: 
const signup = async (req, res, next) => {
    try {
        const {phone_number,first_name,last_name,birth_date,weight,height,bmi,gender,fb_token_id} = req.body;
        const phoneCheck = await checkIfPhoneExist(phone_number);
        const docPhoneCheck = await checkDocPhoneExist(phone_number);
        if (phoneCheck || docPhoneCheck){
            throw new ErrorHandler(403,"Phone Number is already associated with an account");
        }
        const userData = {
            phone_number,
            first_name,
            last_name,
            birth_date,
            weight,
            height,
            bmi,
            gender,
            fb_token_id,
        };
        const user = await createUser(userData);
        const token = genToken(phone_number,"user"); 
        if (user){
           return respond(true,201,{user,token},res);
        }
    }catch(err){
        handleError(err,res);
    }
};







// Middleware for `users signin` Endpoint: 
const signin = async (req,res,next)=>{
    try {
        const { phone_number  } = req.body;
        const user = await checkIfPhoneExist(phone_number);
        if (!user) {
            throw new ErrorHandler(401,"Phone number is incorrect");
        }
        if (user.blocked === true) {
            throw new ErrorHandler(403,"User with this phone_number is blocked");
        }
        const token = genToken(phone_number,"user"); 
        return respond(true,200,{user,token},res);
    }catch(err){
        handleError(err,res);
    }
}







// Middleware for `updating the fb_token_id (firebase token id)` Endpoint: 
const updateFbToken = async (req,res,next)=>{
    try {
        const {phone_number,new_token} = req.body;
        const user = await checkIfPhoneExist(phone_number);
        if (!user) {
            throw new ErrorHandler(401,"User with this phone_number is not found");
        }
        if (user.blocked === true) {
            throw new ErrorHandler(403,"User with this phone_number is blocked");
        }
        const updatedUser = await updateFirebaseToken(user,new_token);
        if (updatedUser){
            return respond(true,200,{"phone_number":updatedUser.phone_number,"updated_token":updatedUser.fb_token_id},res);
        }
    }catch (err){
        handleError(err,res);
    } 
}



// Middleware for Doctors Signin Endpoint : 
const signDoctors = async (req,res,next)=>{
    try{
        const {phone_number,password} = req.body;
        const doctor = await checkDocPhoneExist(phone_number);
        const checkPassword = await compareHashed(password,doctor.password);
        if (!doctor || !checkPassword){
            throw new ErrorHandler(401,"Username or password is incorrect");
        }
        const token = genToken(phone_number,"doctor");
        const returnedDoctor = {...doctor};
        delete returnedDoctor.password;
        return respond(true,200,{returnedDoctor,token},res);
    }catch(err){
        handleError(err,res);
    }
}


// Middleware for `updating the ------------------"DOCTORS"---------------- fb_token_id (firebase token id)` Endpoint: 
// TODO:: TEST THIS FUNCTION
const updateDoctorFbToken = async (req,res,next)=>{
    try {
        const {phone_number,new_token} = req.body;
        const doctor = await checkDocPhoneExist(phone_number);
        if (!doctor) {
            throw new ErrorHandler(401,"Doctor with this phone_number is not found");
        }
        const updatedDoctor = await updateDoctorFirebaseToken(doctor,new_token);
        if (updatedDoctor){
            return respond(true,200,{"phone_number":updatedDoctor.phone_number,"updated_token":updatedDoctor.fb_token_id},res);
        }
    }catch (err){
        handleError(err,res);
    } 
}


module.exports = {
  signup,
  signin,
  updateFbToken,
  signDoctors,
  updateDoctorFbToken,
};
