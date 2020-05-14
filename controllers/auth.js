const {checkIfUserExist,checkIfPhoneExist,createUser,hashPassword,genToken,signinCheck,verifyPassword} = require("../models/users");
const {handleError,ErrorHandler} = require("../middleware/error");
const respond = require("../middleware/respond");

// Middleware for `signup` endpoint

const signup = async (req, res, next) => {
    try {
        const {phone_number, username, password,first_name,last_name,birth_date,weight,height,bmi,gender,fb_token_id} = req.body;
        const userCheck = await checkIfUserExist(username);
        const phoneCheck = await checkIfPhoneExist(phone_number);
        if (userCheck){
            throw new ErrorHandler(400,"Username is already associated with an account");
        }
        if (phoneCheck){
            throw new ErrorHandler(400,"Phone Number is already associated with an account");
        }
        const hashedPassword = await hashPassword(password);
        const userData = {
            username,
            phone_number,
            password:hashedPassword,
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
        const token = genToken(username,"user"); 
        if (user){
           return respond(true,201,{token,username,first_name,last_name},res);
        }
    }catch(err){
        handleError(err,res);
    }
};

const signin = async (req,res,next)=>{
    try {
        const { username, password  } = req.body;
        const user = await signinCheck(username,password);
        if (!user){
            throw new ErrorHandler(401,"User with this username is not found");
        }
        const isPassCorrect = await verifyPassword(password,user.password);
        if (!isPassCorrect){
            throw new ErrorHandler(401,"Password is incorrect");
        }
        const token =  genToken(user.username,user.role);
        return respond(true,200,{token,username : user.username,is_activited: user.is_activited},res);
    }catch(err){
        handleError(err,res);
    }

}

module.exports = {
  signup,
  signin
};
