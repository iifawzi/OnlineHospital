const jwt = require("jsonwebtoken");
const {ErrorHandler} = require("./error");
const config = require("config");

module.exports = (req,res,next)=>{
const encoded_token = req.get("Authorization");
if (!encoded_token){
throw new ErrorHandler(401, "User is not Authorized");
}else {
    try {
        let decoded_token = jwt.verify(encoded_token,config.get("jwt.secret"));
    }catch(err){
        throw new ErrorHandler(500,err);
    }
    if (!decoded_token){
        throw new ErrorHandler(401, "User is not Authorized");
    }
        next();
}
}