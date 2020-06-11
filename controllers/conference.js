const { ErrorHandler, handleError } = require("../middleware/error");
const respond = require("../middleware/respond");
const moment = require("moment");
const {getStartTimeByRoom} = require("../models/appointments");

const checkConference = async (req, res, next) => {
  try {
    const {name,start_time,mail_owner} = req.body;
    const appointment = await getStartTimeByRoom(name, res);
    const {slot_time } = appointment;
    let end_time = moment(appointment.start_time)
      .add(slot_time, "m")
      .format("YYYY-MM-DD HH:mm:ss");
    let currentTime = moment().utc();
    let finish_time = moment(end_time).utc();
    let remainingTime = finish_time.diff(currentTime,'seconds');
    const room_info = {
        'id': name,
        'name': name,
        'start_time': start_time,
        'duration': remainingTime,
        'mail_owner': mail_owner,
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
