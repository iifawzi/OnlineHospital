const {handleError,ErrorHandler} = require("../middleware/error");
const respond = require("../middleware/respond");




const addDoctor = (req,res,next)=>{
    res.send("doctor added");
}


module.exports = {
    addDoctor,
}