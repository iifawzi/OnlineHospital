const {addNewAppointment} = require("../models/appointments");
const { handleError, ErrorHandler } = require("../middleware/error");
const respond = require("../middleware/respond");

const addAppointment = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const newAppointment = await addNewAppointment(data);
    if (newAppointment){
        return respond(true,201,newAppointment,res);
     }
  } catch (err) {
    handleError(err, res);
  }
};


module.exports = {
    addAppointment,
}
