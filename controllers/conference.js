const {ErrorHandler,handleError} = require("../middleware/error");
const respond = require("../middleware/respond");


const checkConference = async  (req,res,next)=>{
    try {
     console.log(req.body);
    }
    catch(err){
        handleError(err,res);
    }
}
module.exports = {
    checkConference
}