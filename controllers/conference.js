const {ErrorHandler,handleError} = require("../middleware/error");
const respond = require("../middleware/respond");


const checkConference = async  (req,res,next)=>{
    try {
        return respond(true,200,req.body,res);
    }
    catch(err){
        handleError(err,res);
    }
}
module.exports = {
    checkConference
}