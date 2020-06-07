const Sequelize = require("sequelize");
const db = require("../utils/db");
const { handleError, ErrorHandler } = require("../middleware/error");
var moment = require('moment'); // require



const appointments = db.define("appointments",{

appointment_id : {
    type:Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
},
slot_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {    
        model: 'slots',
        key: 'slot_id'
      },
      onDelete: "CASCADE", // For testing reasons,
// TODO::later just REMOVE CASCADE

},
user_id:{
    type:Sequelize.INTEGER,
    allowNull: false,
    references: {    
        model: 'users',
        key: 'user_id'
      },
      onDelete: "CASCADE", // For testing reasons,
// TODO::later just REMOVE CASCADE
},
date: {
    type:Sequelize.STRING,
    allowNull:false,
},
appointment_status: {
    type: Sequelize.ENUM("pending","upcoming","running","finished","canceled", "client missed","doctor missed","missed"),
    allowNull: false,
    defaultValue:"pending",
},
room_id:{
    type:Sequelize.STRING,
    allowNull:false,
},
user_joined:{
    type:Sequelize.BOOLEAN,
    allowNull:false,
    defaultValue: false,
},
doctor_joined:{
    type:Sequelize.BOOLEAN,
    allowNull:false,
    defaultValue: false,
}
},{
    indexes: [
        {
            fields: ["slot_id","date","appointment_status"],
          },
          {
            fields: ["user_id","date"],
          },
          {
            fields: ['room_id']
          }
      ],
      freezeTableName: true,
      timestamps: true,
}
)



const addNewAppointment = async function(data,res){
    try {
        const room_id = moment().format("x");
        data.room_id = room_id
        const newAppointment = await appointments.create(data);
        return newAppointment;
    }catch(err){
        handleError(err,res);
    }

}


const addConfirmNewAppointment = async function(data,res){
    try {
        data.appointment_status = "upcoming"
        const room_id = moment().format("x");
        data.room_id = room_id;
        const newAppointment = await appointments.create(data);
        return newAppointment;
    }catch(err){
        handleError(err,res);
    }

}


const deleteAppointment = async function(appointment_id){
    const deleted = await appointments.destroy({ where: { appointment_id } });
    return deleted;
}

const userApps = async function(user_id,res){
    try {
        const appointments =  await db.query("SELECT apps.date, apps.appointment_id,docs.first_name,docs.last_name,cats.ar,cats.en,apps.updatedAt,apps.appointment_status,slots.start_time,slots.slot_time, slots.day FROM appointments apps INNER JOIN slots ON apps.slot_id = slots.slot_id INNER JOIN doctors docs ON slots.doctor_id = docs.doctor_id INNER JOIN categories cats ON cats.category_id = docs.category_id WHERE apps.user_id = ? ORDER BY apps.appointment_id DESC",{
            replacements: [user_id],
            type: Sequelize.QueryTypes.SELECT,
        });
        return appointments;
    }catch(err){
        handleError(err,res);
    }
}



const upcomingApps = async function(user_id,res){
    try {
        const appointments =  await db.query("SELECT apps.appointment_id,docs.first_name,docs.last_name,apps.appointment_status,CONCAT(apps.date,'T',slots.start_time,'Z') start_time,slots.slot_time,cats.ar,cats.en, slots.day FROM appointments apps INNER JOIN slots ON apps.slot_id = slots.slot_id INNER JOIN doctors docs ON slots.doctor_id = docs.doctor_id INNER JOIN categories cats ON cats.category_id = docs.category_id WHERE apps.user_id = ? AND (apps.appointment_status = 'upcoming' OR apps.appointment_status = 'running') ORDER BY apps.appointment_id DESC",{
            replacements: [user_id],
            type: Sequelize.QueryTypes.SELECT,
        });
        return appointments;
    }catch(err){
        handleError(err,res);
    }
}


const finishedApps = async function(user_id,res){
    try {
        const appointments =  await db.query("SELECT CONCAT(apps.date,'T',slots.start_time,'Z') start_time, apps.appointment_id,docs.first_name,docs.last_name,apps.appointment_status,slots.day,cats.ar,cats.en FROM appointments apps INNER JOIN slots ON apps.slot_id = slots.slot_id INNER JOIN doctors docs ON slots.doctor_id = docs.doctor_id INNER JOIN categories cats ON cats.category_id = docs.category_id WHERE apps.user_id = ? AND apps.appointment_status = 'finished' ORDER BY apps.appointment_id DESC",{
            replacements: [user_id],
            type: Sequelize.QueryTypes.SELECT,
        });
        return appointments;
    }catch(err){
        handleError(err,res);
    }
}
const doctorUpcomingApps = async function(doctor_id,res){
    try {
        const appointments =  await db.query("SELECT apps.appointment_id,users.first_name,users.last_name,apps.appointment_status,CONCAT(apps.date,'T',slots.start_time,'Z') start_time,slots.slot_time, slots.day FROM appointments apps INNER JOIN slots ON apps.slot_id = slots.slot_id INNER JOIN users ON users.user_id = apps.user_id INNER JOIN doctors docs ON slots.doctor_id = docs.doctor_id INNER JOIN categories cats ON cats.category_id = docs.category_id WHERE slots.doctor_id = ? AND (apps.appointment_status = 'upcoming' OR apps.appointment_status = 'running') ORDER BY apps.appointment_id DESC",{
            replacements: [doctor_id],
            type: Sequelize.QueryTypes.SELECT,
        });
        return appointments;
    }catch(err){
        handleError(err,res);
    }
}


const doctorFinishedApps = async function(doctor_id,res){
    try {
        const appointments =  await db.query("SELECT CONCAT(apps.date,'T',slots.start_time,'Z') start_time, apps.appointment_id,users.first_name,users.last_name,apps.appointment_status,slots.day FROM appointments apps INNER JOIN slots ON apps.slot_id = slots.slot_id INNER JOIN users ON users.user_id = apps.user_id INNER JOIN doctors docs ON slots.doctor_id = docs.doctor_id INNER JOIN categories cats ON cats.category_id = docs.category_id WHERE slots.doctor_id = ? AND apps.appointment_status = 'finished' ORDER BY apps.appointment_id DESC",{
            replacements: [doctor_id],
            type: Sequelize.QueryTypes.SELECT,
        });
        return appointments;
    }catch(err){
        handleError(err,res);
    }
}


const docApps = async function(doctor_id,res){
    try {
        const appointments =  await db.query("SELECT users.first_name,users.last_name,apps.date, apps.appointment_id,apps.appointment_status,apps.updatedAt,slots.start_time,slots.slot_time, slots.day FROM appointments apps INNER JOIN users ON users.user_id = apps.user_id INNER JOIN slots ON apps.slot_id = slots.slot_id INNER JOIN doctors docs ON slots.doctor_id = docs.doctor_id WHERE slots.doctor_id = ? ORDER BY apps.appointment_id DESC",{
            replacements: [doctor_id],
            type: Sequelize.QueryTypes.SELECT,
        });
        return appointments;
    }catch(err){
        handleError(err,res);
    }
}

// Will return the appointmnents at specific date (for doctors appliction):
const docAppsDate = async function(doctor_id,date,res){
    try {
        const appointments =  await db.query("SELECT users.first_name,users.last_name,apps.date, apps.appointment_id,apps.appointment_status,slots.start_time,slots.slot_time, slots.day, users.picture FROM appointments apps INNER JOIN users ON users.user_id = apps.user_id INNER JOIN slots ON apps.slot_id = slots.slot_id INNER JOIN doctors docs ON slots.doctor_id = docs.doctor_id WHERE slots.doctor_id = ? AND apps.date = ? AND apps.appointment_status != 'pending' ORDER BY apps.appointment_id DESC",{
            replacements: [doctor_id,date],
            type: Sequelize.QueryTypes.SELECT,
        });
        return appointments;
    }catch(err){
        handleError(err,res);
    }
}


const cancelApp = async function(appointment_id,res){
    try {
        const getApp = await appointments.findOne({where:{appointment_id}});
        getApp.appointment_status = 'canceled';
        const updated = await getApp.save();
        return updated;
    }catch(err){
handleError(err,res)
    }
}


const confirmApp = async function(appointment_id,res){
    try {
        const getApp = await appointments.findOne({where:{appointment_id}});
        getApp.appointment_status = 'upcoming';
        const updated = await getApp.save();
        return updated;
    }catch(err){
handleError(err,res)
    }
}

const runApp = async function(appointment_id,res){
    try {
        const getApp = await appointments.findOne({where:{appointment_id}});
        getApp.appointment_status = 'running';
        const updated = await getApp.save();
        return updated;
    }catch(err){
handleError(err,res)
    }
}

const finishApp = async function(appointment_id,res){
    try {
        const getApp = await appointments.findOne({where:{appointment_id}});
        getApp.appointment_status = 'finished';
        const updated = await getApp.save();
        return updated;
    }catch(err){
handleError(err,res)
    }
}

const missDocApp = async function(appointment_id,res){ // if doctor missed the appointment
    try {
        const getApp = await appointments.findOne({where:{appointment_id}});
        getApp.appointment_status = 'doctor missed';
        const updated = await getApp.save();
        return updated;
    }catch(err){
handleError(err,res)
    }
}

const missUserApp = async function(appointment_id,res){ // if user missed the appointment
    try {
        const getApp = await appointments.findOne({where:{appointment_id}});
        getApp.appointment_status = 'user missed';
        const updated = await getApp.save();
        return updated;
    }catch(err){
handleError(err,res)
    }
}


const missApp = async function(appointment_id,res){ // if both missed the appointment
    try {
        const getApp = await appointments.findOne({where:{appointment_id}});
        getApp.appointment_status = 'missed';
        const updated = await getApp.save();
        return updated;
    }catch(err){
handleError(err,res)
    }
}

const getAppointment = async function(appointment_id,res){
    try {
        const appointment =  await db.query("SELECT apps.date, apps.room_id, apps.appointment_id,apps.appointment_status,slots.start_time,slots.slot_time,apps.user_joined,slots.day FROM appointments apps INNER JOIN slots ON apps.slot_id = slots.slot_id WHERE apps.appointment_id = ?",{
            replacements: [appointment_id],
            type: Sequelize.QueryTypes.SELECT,
        });
        return appointment[0];
    }catch(err){
        handleError(err,res);
    }
}

const setUser_joined = async function(appointment_id,res){
    try {
        const appointment = await appointments.findOne({where:{appointment_id}});
        appointment.user_joined = true;
        await appointment.save();
       
        return appointment;
    }catch(err){
        handleError(err,res);
    }
}

const setDoctor_joined = async function(appointment_id,res){
    try {
        const appointment = await appointments.findOne({where:{appointment_id}});
        appointment.doctor_joined = true;
        await appointment.save();
        return appointment;
    }catch(err){
        handleError(err,res);
    }
}

const cancelApps = async function(slot_id,res){ // cancel apps by slot_id
    try {
        const appointment =  await db.query("UPDATE appointments SET appointment_status = 'canceled' WHERE slot_id = ?",{
            replacements: [slot_id],
            type: Sequelize.QueryTypes.UPDATE,
        });
    }catch(err){
        handleError(err,res);
    }
}

const cancelAppsByDoctor = async function(doctor_id,res){ // cancel apps by doctor_id
    try {
        const appointment =  await db.query("UPDATE appointments apps LEFT JOIN slots ON apps.slot_id = slots.slot_id  SET appointment_status = 'canceled' WHERE  apps.appointment_status = 'upcoming' AND slots.doctor_id = ? ",{
            replacements: [doctor_id],
            type: Sequelize.QueryTypes.UPDATE,
        });
    }catch(err){
        handleError(err,res);
    }
}

const cancelAppsByUser = async function(user_id,res){ // cancel apps by user_id
    try {
        const appointment =  await db.query("UPDATE appointments SET appointment_status = 'canceled' WHERE user_id = ?",{
            replacements: [user_id],
            type: Sequelize.QueryTypes.UPDATE,
        });
    }catch(err){
        handleError(err,res);
    }
}

const getAppointmentInfo = async function(appointment_id,res){ // for tasks and jobs
    try {
        const appInfo = await db.query("SELECT apps.appointment_id,apps.appointment_status,apps.user_joined,apps.doctor_joined,apps.room_id,CONCAT(apps.date,'T',slots.start_time,'Z') start_time,slots.slot_time,docs.first_name,docs.last_name ,docs.fb_token_id as 'doctor_token', users.fb_token_id as 'user_token' FROM appointments apps LEFT JOIN slots ON apps.slot_id = slots.slot_id LEFT JOIN doctors docs ON slots.doctor_id = docs.doctor_id LEFT JOIN users ON apps.user_id = users.user_id WHERE apps.appointment_id = ? ", {
            replacements: [appointment_id],
            type: Sequelize.QueryTypes.SELECT,
        });
        return appInfo[0];
    }catch(err){
        console.log(err,"getAppointmentInfo")
    }
}

const getAppointmentsInfo = async function(){ // plural :D (this will be used on the jobs controller to get all upcoming / running appointments)
    try {
        const appInfo = await db.query("SELECT apps.appointment_id,apps.appointment_status,apps.user_joined,apps.doctor_joined,apps.room_id,CONCAT(apps.date,'T',slots.start_time,'Z') start_time,slots.slot_time,CONCAT(docs.first_name + ' ' + docs.last_name) doctor_name,CONCAT(users.first_name + ' ' + users.last_name) user_name ,docs.fb_token_id as 'doctor_token', users.fb_token_id as 'user_token' FROM appointments apps LEFT JOIN slots ON apps.slot_id = slots.slot_id LEFT JOIN doctors docs ON slots.doctor_id = docs.doctor_id LEFT JOIN users ON apps.user_id = users.user_id WHERE (apps.appointment_status = 'upcoming' OR apps.appointment_status = 'running') ", {
            type: Sequelize.QueryTypes.SELECT,
        });
        return appInfo;
    }catch(err){
       console.log(err,"getAppointmentsInfo")
    }
}

module.exports = { 
    appointments,
    addNewAppointment,
    deleteAppointment,
    userApps,
    docApps,
    cancelApp,
    confirmApp,
    addConfirmNewAppointment,
    docAppsDate,
    upcomingApps,
    finishedApps,
    getAppointment,
    setUser_joined,
    setDoctor_joined,
    doctorFinishedApps,
    doctorUpcomingApps,
    cancelApps,
    runApp,
    finishApp,
    missDocApp,
    missUserApp,
    missApp,
    getAppointmentInfo,
    getAppointmentsInfo,
    cancelAppsByDoctor,
    cancelAppsByUser
}