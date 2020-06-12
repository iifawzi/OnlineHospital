const { ErrorHandler, handleError } = require("../middleware/error");
const respond = require("../middleware/respond");
const moment = require("moment");
const {getStartTimeByRoom} = require("../models/appointments");

const checkConference = async (req, res, next) => {
  try {
    const {name,start_time} = req.body;
    console.log(req.body);
    const appointment = await getStartTimeByRoom(name, res);
    const {slot_time } = appointment;
    let end_time = moment(appointment.start_time)
      .add(slot_time, "m")
      .format("YYYY-MM-DD HH:mm:ss");
    let currentTime = moment().utc();
    let finish_time = moment(end_time).utc();
    let remainingTime = finish_time.diff(currentTime,'seconds');
    if (remainingTime > 0 ){
      const room_info = {
        id: Number(moment().format("x")),
        name: name,
        start_time: start_time,
        duration: remainingTime,
    }
    return res.status(200).json(room_info);
    }else {
      return res.status(403).json({message: "You're not allowed to join this video call"});
    }

  } catch (err) {
    handleError(err, res);
  }
};
module.exports = {
  checkConference,
};
