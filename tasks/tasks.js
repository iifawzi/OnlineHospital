var schedule = require('node-schedule');
const {cancelApp,runApp,getAppointmentInfo} = require("../models/appointments");
const {sendNotfication,callNotfication} = require("../utils/shared/sendNotfication");
var moment = require('moment');

exports.newAppointmentTask = async (appointment_id,res)=>{ // these tasks is needed when we add a new appointment
    const appInfo = await getAppointmentInfo(appointment_id,res);
    var fiveMinBefore = moment(appInfo.start_time).utc().subtract(1,"m").format("YYYY-MM-DD HH:mm:ss");
    var onTime = moment(appInfo.start_time).utc().format("YYYY-MM-DD HH:mm:ss");
    var fiveMinAfter = moment(appInfo.start_time).utc().add(1,"m").format("YYYY-MM-DD HH:mm:ss");
    var runTheSlot = schedule.scheduleJob(fiveMinBefore, async function(){
     await runApp(appInfo.appointment_id);
     sendNotfication(appInfo.doctor_token,"دكتور، بنفكرك عندك معاد كمان ٥ دقايق");
     sendNotfication(appInfo.user_token,"معادك باقي عليه ٥ دقايق، تقدر تدخل من دلوقتي");
    });
    var notificationOnTime = schedule.scheduleJob(onTime, async function(){
      sendNotfication(appInfo.doctor_token,"دكتور، عندك معاد بدأ دلوقتي");
      sendNotfication(appInfo.user_token,"معادك بدأ");
     });
     var notificationOnTime = schedule.scheduleJob(fiveMinAfter, async function(){
      const currentInfo = await getAppointmentInfo(appInfo.appointment_id,res);
      if (currentInfo.user_joined === 0){
        sendNotfication(currentInfo.user_token,"عدا ١٠ دقايق على المعاد، تم اغلاقه");
        await cancelApp(currentInfo.appointment_id);
      }
     });
  
}
