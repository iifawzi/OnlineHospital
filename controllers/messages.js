const {handleError,ErrorHandler} = require("../middleware/error");
const {messagesFromFinished} = require("../models/messages");
const respond = require("../middleware/respond");
const upload = require("../middleware/upload");


const finishedMessages = async (req,res,next)=>{
    try {
        const {room_id} = req.body;
        const messages = await messagesFromFinished(room_id,res);
        return respond(true,200,messages,res);
    }catch(err){
        handleError(err,res);
    }
};


const uploadFile = async (req,res,next)=>{
    const {chatroomid} = req.headers; 
    try {
        upload().single('file')(req,{},async error=>{
            if (error){
                handleError(error,res);
            }else {
                if (req.file){
                    return respond(true,201,{filename: req.file.filename},res)
                }else {
            const error = new ErrorHandler(500,"Something wrong happened");
            handleError(error,res);
                }
            }
        }); 
    }catch(err){
        handleError(err,res);
    }
}

module.exports = {
    finishedMessages,
    uploadFile,
}