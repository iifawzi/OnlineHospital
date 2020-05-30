const {ErrorHandler,handleError} = require("../middleware/error");
const {getCatsSpecific} = require("../models/categories");
const respond = require("../middleware/respond");


const getCategories = async  (req,res,next)=>{
    try {
        const categories = await getCatsSpecific(req);
        if (!categories) {
            throw new ErrorHandler(500,"error happened while getting the cateogires");
        }
        return respond(true,200,categories,res);
    }
    catch(err){
        handleError(err,res);
    }
}
module.exports = {
    getCategories
}