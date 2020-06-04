var schedule = require('node-schedule');
const {cancelApp,runApp,getAppointmentInfo} = require("../models/appointments");
const {sendNotfication,callNotfication} = require("../utils/shared/sendNotfication");
var moment = require('moment');

exports.newAppointmentTask = async (appointment_id,res)=>{ // these tasks is needed when we add a new appointment
    const appInfo = await getAppointmentInfo(appointment_id,res);
    var fiveMinBefore = moment(appInfo.start_time).utc().subtract(1,"m").format("YYYY-MM-DD HH:mm:ss");
    var onTime = moment(appInfo.start_time).utc().format("YYYY-MM-DD HH:mm:ss");
    var fiveMinAfter = moment(appInfo.start_time).utc().add(1,"m").format("YYYY-MM-DD HH:mm:ss");
    var beforeFive = schedule.scheduleJob(fiveMinBefore, async function(){
     await runApp(appInfo.appointment_id);
     sendNotfication(appInfo.doctor_token,"دكتور، بنفكرك عندك معاد كمان ٥ دقايق");
     callNotfication(appInfo.user_token,appInfo.room_id,appInfo.doctor_name);
    });
    var onExact = schedule.scheduleJob(onTime, async function(){
        const currentInfo = await getAppointmentInfo(appInfo.appointment_id,res);
        if (currentInfo.doctor_joined === 0){
            callNotfication(appInfo.doctor_token,appInfo.room_id,appInfo.user_name);
        }
        if (currentInfo.user_joined === 0){
            callNotfication(appInfo.user_token,appInfo.room_id,appInfo.doctor_name);
        }
     });
     var afterFive = schedule.scheduleJob(fiveMinAfter, async function(){
      const currentInfo = await getAppointmentInfo(appInfo.appointment_id,res);
      if (currentInfo.user_joined === 0){
        sendNotfication(currentInfo.user_token,"عدا ١٠ دقايق على المعاد، تم اغلاقه");
        await cancelApp(currentInfo.appointment_id);
      }
     });
}

exports.existUpcomingTask = async (appInfo,res)=>{ // this will be used on jobs controller (for exist upcoming appointment)
    var fiveMinBefore = moment(appInfo.start_time).utc().subtract(1,"m").format("YYYY-MM-DD HH:mm:ss");
    var onTime = moment(appInfo.start_time).utc().format("YYYY-MM-DD HH:mm:ss");
    var fiveMinAfter = moment(appInfo.start_time).utc().add(1,"m").format("YYYY-MM-DD HH:mm:ss");
    var beforeFive = schedule.scheduleJob(fiveMinBefore, async function(){
     await runApp(appInfo.appointment_id);
     sendNotfication(appInfo.doctor_token,"دكتور، بنفكرك عندك معاد كمان ٥ دقايق");
     callNotfication(appInfo.user_token,appInfo.room_id,appInfo.doctor_name);
    });
    var onExact = schedule.scheduleJob(onTime, async function(){
        const currentInfo = await getAppointmentInfo(appInfo.appointment_id,res);
        if (currentInfo.doctor_joined === 0){
            callNotfication(appInfo.doctor_token,appInfo.room_id,appInfo.user_name);
        }
        if (currentInfo.user_joined === 0){
            callNotfication(appInfo.user_token,appInfo.room_id,appInfo.doctor_name);
        }
     });
     var afterFive = schedule.scheduleJob(fiveMinAfter, async function(){
      const currentInfo = await getAppointmentInfo(appInfo.appointment_id,res);
      if (currentInfo.user_joined === 0){
        sendNotfication(currentInfo.user_token,"عدا ١٠ دقايق على المعاد، تم اغلاقه");
        await cancelApp(currentInfo.appointment_id);
      }
     });
}