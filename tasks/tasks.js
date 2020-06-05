const schedule = require('node-schedule');
const {cancelApp,runApp,finishApp,getAppointmentInfo} = require("../models/appointments");
const {sendNotfication,callNotfication} = require("../utils/shared/sendNotfication");
const moment = require('moment');

exports.newAppointmentTask = async (appointment_id,res)=>{ // these tasks is needed when we add a new appointment
    const appInfo = await getAppointmentInfo(appointment_id,res);
    let fiveMinBefore = moment(appInfo.start_time).utc().subtract(1,"m").format("YYYY-MM-DD HH:mm:ss");
    let onTime = moment(appInfo.start_time).utc().format("YYYY-MM-DD HH:mm:ss");
    let fiveMinAfter = moment(appInfo.start_time).utc().add(1,"m").format("YYYY-MM-DD HH:mm:ss");
    let endTime = moment(appInfo.start_time).utc().add(appInfo.slot_time,'m').format("YYYY-MM-DD HH:mm:ss");
    const beforeFive = schedule.scheduleJob(fiveMinBefore, async function(){
     await runApp(appInfo.appointment_id);
     sendNotfication(appInfo.doctor_token,"دكتور، بنفكرك عندك معاد كمان ٥ دقايق");
     sendNotfication(appInfo.user_token,"عندك معاد كمان ٥ دقايق، تقدر تدخل من دلوقتي");
    });
    const onExact = schedule.scheduleJob(onTime, async function(){
        const currentInfo = await getAppointmentInfo(appInfo.appointment_id,res);
        if (currentInfo.doctor_joined === 0){
            sendNotfication(appInfo.doctor_token,"دكتور، عندك معاد دلوقتي");
        }
        if (currentInfo.user_joined === 0){
            sendNotfication(appInfo.user_token,"معادك بدأ");
        }
     });
     const afterFive = schedule.scheduleJob(fiveMinAfter, async function(){
      const currentInfo = await getAppointmentInfo(appInfo.appointment_id,res);
      if (currentInfo.user_joined === 0){
        sendNotfication(currentInfo.user_token,"عدا ١٠ دقايق على المعاد، تم اغلاقه");
        await cancelApp(currentInfo.appointment_id);
      }
     });
     const atEnd = schedule.scheduleJob(endTime, async function(){
        await finishApp(appInfo.appointment_id);
       });
}

exports.existUpcomingTask = async (appInfo,res)=>{ // this will be used on jobs controller (for exist upcoming appointment)
    let fiveMinBefore = moment(appInfo.start_time).utc().subtract(1,"m").format("YYYY-MM-DD HH:mm:ss");
    let onTime = moment(appInfo.start_time).utc().format("YYYY-MM-DD HH:mm:ss");
    let fiveMinAfter = moment(appInfo.start_time).utc().add(1,"m").format("YYYY-MM-DD HH:mm:ss");
    let endTime = moment(appInfo.start_time).utc().add(appInfo.slot_time,'m').format("YYYY-MM-DD HH:mm:ss");
    const beforeFive = schedule.scheduleJob(fiveMinBefore, async function(){
     await runApp(appInfo.appointment_id);
     sendNotfication(appInfo.doctor_token,"دكتور، بنفكرك عندك معاد كمان ٥ دقايق");
     sendNotfication(appInfo.user_token,"عندك معاد كمان ٥ دقايق، تقدر تدخل من دلوقتي");
    });
    const onExact = schedule.scheduleJob(onTime, async function(){
        const currentInfo = await getAppointmentInfo(appInfo.appointment_id,res);
        if (currentInfo.doctor_joined === 0){
            sendNotfication(appInfo.doctor_token,"دكتور، عندك معاد دلوقتي");
        }
        if (currentInfo.user_joined === 0){
            sendNotfication(appInfo.user_token,"معادك بدأ");
        }
     });
     const afterFive = schedule.scheduleJob(fiveMinAfter, async function(){
      const currentInfo = await getAppointmentInfo(appInfo.appointment_id,res);
      if (currentInfo.user_joined === 0){
        sendNotfication(currentInfo.user_token,"عدا ١٠ دقايق على المعاد، تم اغلاقه");
        await cancelApp(currentInfo.appointment_id);
      }
     });
     const atEnd = schedule.scheduleJob(endTime, async function(){
        await finishApp(appInfo.appointment_id);
       });
}