const {getAppointmentsInfo} = require("../models/appointments");
const {existUpcomingTask} = require("../tasks/tasks");
const upcomingTasks = () =>{
return  async (req,res,next)=>{
   const upcomingApps =  await getAppointmentsInfo();
   for (app of upcomingApps){
       await existUpcomingTask(app,res);
   }
}
}

module.exports = {
    upcomingTasks,
}