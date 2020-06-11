const { ErrorHandler, handleError } = require("../middleware/error");
const respond = require("../middleware/respond");
const moment = require("moment");
const {getAppointmentInfo} = require("../models/appointments");

const checkConference = async (req, res, next) => {
  try {
      const appointment_id = req.body.name;
      console.log(appointment_id);
      console.log(req.body);
    const appointment = await getAppointmentInfo(appointment_id, res);
    console.log(appointment);
    const { start_time, slot_time } = appointment;
    let end_time = moment(start_time)
      .add(slot_time, "m")
      .format("YYYY-MM-DD HH:mm:ss");
    let currentTime = moment().utc();
    let finish_time = moment(end_time).utc();
    let remainingTime = finish_time.diff(currentTime,'seconds', true);
    console.log(remainingTime);
    const room_info = {
        id: appointment_id,
        name: appointment_id,
        start_time: moment().format(),
        duration: remainingTime,
    }
    console.log(room_info);
   return res.status(200).json(room_info);
  } catch (err) {
    handleError(err, res);
  }
};
module.exports = {
  checkConference,
};
