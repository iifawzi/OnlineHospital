const {checkIfUserExist,checkIfPhoneExist,createUser,hashPassword,genToken} = require("../models/users");
const {handleError,ErrorHandler} = require("../middleware/error");
const respond = require("../middleware/respond");

// Middleware for `signup` endpoint

const signup = async (req, res, next) => {
    try {
        const {phone_number, username, password, province,first_name,last_name} = req.body;
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
            province,
            first_name,
            last_name,
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


module.exports = {
  signup,
};
