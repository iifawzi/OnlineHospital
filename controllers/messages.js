const {handleError,ErrorHandler} = require("../middleware/error");
const {messagesFromFinished} = require("../models/messages");
const respond = require("../middleware/respond");


const finishedMessages = async (req,res,next)=>{
    try {
        const {room_id} = req.body;
        const messages = await messagesFromFinished(room_id,res);
        return respond(true,200,messages,res);
    }catch(err){
        handleError(err,res);
    }
};

module.exports = {
    finishedMessages,
}