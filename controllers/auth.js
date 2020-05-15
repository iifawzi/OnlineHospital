const {checkIfPhoneExist,createUser,genToken,updateFirebaseToken,updateIsActivited} = require("../models/users");
const {handleError,ErrorHandler} = require("../middleware/error");
const respond = require("../middleware/respond");

// Middleware for `users signup` endpoint

const signup = async (req, res, next) => {
    try {
        const {phone_number,first_name,last_name,birth_date,weight,height,bmi,gender,fb_token_id} = req.body;
        const phoneCheck = await checkIfPhoneExist(phone_number);
        if (phoneCheck){
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

// Middleware for `users signin` endpoint

const signin = async (req,res,next)=>{
    try {
        const { phone_number  } = req.body;
        const user = await checkIfPhoneExist(phone_number);
        if (!user){
            return respond(false,401,{message:"this phone number is not registered yet"},res);
        }
        if (user.blocked === true) {
            throw new ErrorHandler(403,"User with this phone_number is blocked")
        }
        return respond(true,200,{user},res);
    }catch(err){
        handleError(err,res);
    }
}


// Middleware for `updating the fb_token_id (firebase token id)` endpoint

const updateFbToken = async (req,res,next)=>{
    try {
        const {phone_number,new_token} = req.body;
        const user = await checkIfPhoneExist(phone_number);
        if (!user) {
            throw new ErrorHandler(401,"User with this phone_number is not found")
        }
        if (user.blocked === true) {
            throw new ErrorHandler(403,"User with this phone_number is blocked")
        }
        const updateUser = await updateFirebaseToken(user,new_token);
        if (updateUser){
            return respond(true,200,{"phone_number":user.phone_number,"updated_token":updateUser.fb_token_id},res);
        }
    }catch (err){
        handleError(err,res);
    }
   
}


module.exports = {
  signup,
  signin,
  updateFbToken,
};
