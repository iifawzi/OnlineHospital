const jwt = require("jsonwebtoken");
const {ErrorHandler,handleError} = require("./error");
const config = require("config");

module.exports = (req,res,next)=>{
const encoded_token = req.get("Authorization");
if (!encoded_token){
throw new ErrorHandler(401, "User is not Authorized");
}else {
    if (encoded_token.startsWith('Bearer ')) {
        // Remove Bearer from string
        var splicedToken = encoded_token.slice(7,encoded_token.length);
      }
    try {
        let decoded_token = jwt.verify(splicedToken,config.get("jwt.secret"));
        if (decoded_token.role === "admin" || decoded_token.role === "superadmin"){
            req.admin = {
                ...decoded_token
            };
        }else if (decoded_token.role === "user"){
            req.user = {
                ...decoded_token
            };
        }else {
throw new ErrorHandler(401, "User is not Authorized");
        }
      
        next();
    }catch(err){
        handleError(err,res)
    }
}
}