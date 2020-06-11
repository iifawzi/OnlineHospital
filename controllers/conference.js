const { ErrorHandler, handleError } = require("../middleware/error");
const respond = require("../middleware/respond");
const moment = require("moment");
const {getStartTimeByRoom} = require("../models/appointments");

const checkConference = async (req, res, next) => {
  try {
    const room_id = req.body.name;
    const appointment = await getStartTimeByRoom(room_id, res);
    const { start_time, slot_time } = appointment;
    let end_time = moment(start_time)
      .add(slot_time, "m")
      .format("YYYY-MM-DD HH:mm:ss");
    let currentTime = moment().utc();
    let finish_time = moment(end_time).utc();
    let remainingTime = finish_time.diff(currentTime,'seconds');
    const room_info = {
        'id': room_id,
        'name': room_id,
        'start_time': moment().format(),
        'duration': remainingTime,
        'mail_owner': 'user@server.com',
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
